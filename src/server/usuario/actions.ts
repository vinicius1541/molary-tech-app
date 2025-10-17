"use server"

import { PrismaClient, UsuarioStatus as UsuarioStatusEnum } from "@/generated/prisma";
import type { UsuarioStatus as UsuarioStatusType } from "@/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { clerkMetadata } from "@/lib/clerk-metadata";
import {
  DEFAULT_ROLE_SLUG,
  buildUsuarioAuthContext,
  ensureRoleHasPermissions,
} from "@/lib/authz";

const prisma = new PrismaClient();

export type UsuarioDTO = {
  id: string;
  email: string;
  nomeExibicao: string | null;
  status: string;
  roles: Array<{
    id: string;
    nome: string;
    slug: string;
    hierarquia: number;
  }>;
  permissions: string[];
  hasColaborador: boolean;
  ultimoLogin: Date | null;
};

export type UsuarioResult =
  | { success: true; usuario: UsuarioDTO }
  | { success: false; error: string };

function getPrimaryEmail(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return "";
  }
  return (
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    ""
  );
}

function mapUsuario(usuario: any): UsuarioDTO {
  const authContext = buildUsuarioAuthContext(usuario);

  return {
    id: authContext.id,
    email: authContext.email,
    nomeExibicao: usuario.nome_exibicao,
    status: usuario.status,
    roles: authContext.roles,
    permissions: authContext.permissions,
    hasColaborador: Boolean(usuario.colaborador),
    ultimoLogin: usuario.ultimo_login ? new Date(usuario.ultimo_login) : null,
  };
}

export async function getUsers(): Promise<UsuarioDTO[]> {
  const usuarios = await prisma.usuario.findMany({
    include: {
      colaborador: true,
      usuario_roles: {
        include: {
          role: {
            include: {
              role_permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { dt_criacao: "desc" },
  });

  return usuarios.map(mapUsuario);
}

async function ensureDefaultRole() {
  return prisma.role.upsert({
    where: { slug: DEFAULT_ROLE_SLUG },
    update: {},
    create: {
      nome: "Colaborador",
      slug: DEFAULT_ROLE_SLUG,
      descricao: "Acesso padrão para colaboradores da clínica",
      hierarquia: 300,
    },
  });
}

async function attachRoleToUsuario(usuarioId: bigint, roleId: bigint) {
  await prisma.usuario_role.upsert({
    where: {
      usuario_id_role_id: {
        usuario_id: usuarioId,
        role_id: roleId,
      },
    },
    update: {},
    create: {
      usuario_id: usuarioId,
      role_id: roleId,
    },
  });
}

export type CreateUsuarioInput = {
  email: string;
  nomeExibicao: string;
  status?: UsuarioDTO["status"];
};

export type UpdateUsuarioInput = {
  id: string;
  email?: string;
  nomeExibicao?: string;
  status?: string;
};

function normalizeUsuarioStatus(status: string | undefined): UsuarioStatusType | null {
  if (!status) {
    return null;
  }

  const allowed = new Set(Object.values(UsuarioStatusEnum));
  return allowed.has(status as UsuarioStatusType) ? (status as UsuarioStatusType) : null;
}

export async function createUser(input: CreateUsuarioInput): Promise<UsuarioResult> {
  try {
    const email = input.email.trim().toLowerCase();
    const nomeExibicao = input.nomeExibicao?.trim();

    if (!email) {
      return {
        success: false,
        error: "E-mail é obrigatório",
      };
    }

    if (!nomeExibicao) {
      return {
        success: false,
        error: "Nome de exibição é obrigatório",
      };
    }

    const status = normalizeUsuarioStatus(input.status) ?? UsuarioStatusEnum.ATIVO;

    const existing = await prisma.usuario.findFirst({
      where: { email },
    });

    if (existing) {
      return {
        success: false,
        error: "Já existe um usuário cadastrado com esse e-mail.",
      };
    }

    const defaultRole = await ensureDefaultRole();
    await ensureRoleHasPermissions(defaultRole.id, prisma);

    const usuarioCriado = await prisma.usuario.create({
      data: {
        external_user_id: randomUUID(),
        email,
        nome_exibicao: nomeExibicao,
        status,
        dt_atualizacao: new Date(),
      },
    });

    await attachRoleToUsuario(usuarioCriado.id, defaultRole.id);

    const usuarioComRelacionamentos = await prisma.usuario.findUnique({
      where: { id: usuarioCriado.id },
      include: {
        colaborador: true,
        usuario_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!usuarioComRelacionamentos) {
      return { success: false, error: "Falha ao carregar o usuário recém-criado" }
    }

    return { success: true, usuario: mapUsuario(usuarioComRelacionamentos) };
  } catch (error) {
    return {
      success: false,
      error: "Erro inesperado ao criar usuário interno",
    };
  }
}

export async function updateUser(user: UpdateUsuarioInput): Promise<UsuarioResult> {
  try {
    if (!user.id) {
      return {
        success: false,
        error: "Identificador do usuário é obrigatório",
      };
    }

    const data: Record<string, unknown> = {
      dt_atualizacao: new Date(),
    };

    if (typeof user.email !== "undefined") {
      const normalizedEmail = user.email?.trim().toLowerCase();

      if (!normalizedEmail) {
        return {
          success: false,
          error: "E-mail inválido",
        };
      }

      data.email = normalizedEmail;
    }

    if (typeof user.nomeExibicao !== "undefined") {
      const nomeExibicao = user.nomeExibicao?.trim();

      if (!nomeExibicao) {
        return {
          success: false,
          error: "Nome de exibição é obrigatório",
        };
      }

      data.nome_exibicao = nomeExibicao;
    }

    const normalizedStatus = normalizeUsuarioStatus(user.status);
    if (normalizedStatus) {
      data.status = normalizedStatus;
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: BigInt(user.id) },
      data,
      include: {
        colaborador: true,
        usuario_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { success: true, usuario: mapUsuario(usuarioAtualizado) };
  } catch (error) {
    console.error("Erro ao atualizar usuário interno:", error);
    return {
      success: false,
      error: "Erro inesperado ao atualizar usuário interno",
    };
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: BigInt(userId) }
        })

        if (!user) {
            return {
                success: false,
                error: "Usuário não encontrado"
            }
        }

        await prisma.usuario.delete({
            where: {
                id: BigInt(userId)
            }
        })

        return {
            success: true,
            message: "Usuario Deletado com sucesso!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Erro ao tentar deletar usuário!"
        }
    }
}
export async function initializeCurrentUsuario(): Promise<UsuarioResult> {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const email = getPrimaryEmail(user);

    if (!email) {
      return {
        success: false,
        error:
          "Não foi possível localizar um e-mail válido no perfil do Clerk. Atualize seus dados e tente novamente.",
      };
    }

    const existing = await prisma.usuario.findUnique({
      where: { external_user_id: user.id },
      include: {
        colaborador: true,
        usuario_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const defaultRole = await ensureDefaultRole();
    await ensureRoleHasPermissions(defaultRole.id, prisma);

    const baseNome = user.fullName ?? user.firstName ?? existing?.nome_exibicao ?? "Usuário";

    const usuarioUpsert = await prisma.usuario.upsert({
      where: { external_user_id: user.id },
      update: {
        email,
        nome_exibicao: baseNome,
        ultimo_login: new Date(),
      },
      create: {
        external_user_id: user.id,
        email,
        nome_exibicao: baseNome,
        ultimo_login: new Date(),
      },
      include: {
        colaborador: true,
        usuario_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    await attachRoleToUsuario(usuarioUpsert.id, defaultRole.id);

    if (!existing) {
      await clerkMetadata.setUsuarioCreated(user.id, usuarioUpsert.id.toString());
    } else if (!clerkMetadata.getUsuarioId({ publicMetadata: user.publicMetadata })) {
      await clerkMetadata.setUsuarioCreated(user.id, usuarioUpsert.id.toString());
    }

    const usuarioComRoles = await prisma.usuario.findUnique({
      where: { id: usuarioUpsert.id },
      include: {
        colaborador: true,
        usuario_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!usuarioComRoles) {
      return {
        success: false,
        error: "Falha ao carregar dados do usuário interno",
      };
    }

    const mappedUsuario = mapUsuario(usuarioComRoles);

    await clerkMetadata.setAuthz(user.id, {
      roles: mappedUsuario.roles.map((role) => role.slug),
      permissions: mappedUsuario.permissions,
    });

    return { success: true, usuario: mappedUsuario };
  } catch (error) {
    console.error("Erro ao inicializar usuário interno:", error);
    return {
      success: false,
      error: "Erro inesperado ao criar usuário interno",
    };
  }
}
