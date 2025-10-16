"use server"

import { PrismaClient } from "@/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { clerkMetadata } from "@/lib/clerk-metadata";

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
  hasColaborador: boolean;
};

export type InitializeUsuarioResult =
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
  return {
    id: usuario.id.toString(),
    email: usuario.email,
    nomeExibicao: usuario.nome_exibicao,
    status: usuario.status,
    roles:
      usuario.usuario_roles?.map((entry: any) => ({
        id: entry.role.id.toString(),
        nome: entry.role.nome,
        slug: entry.role.slug,
        hierarquia: entry.role.hierarquia,
      })) ?? [],
    hasColaborador: Boolean(usuario.colaborador),
  };
}

async function ensureDefaultRole() {
  const slug = "colaborador";
  return prisma.role.upsert({
    where: { slug },
    update: {},
    create: {
      nome: "Colaborador",
      slug,
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

export async function initializeCurrentUsuario(): Promise<InitializeUsuarioResult> {
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
            role: true,
          },
        },
      },
    });

    const defaultRole = await ensureDefaultRole();

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
          include: { role: true },
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
          include: { role: true },
        },
      },
    });

    if (!usuarioComRoles) {
      return {
        success: false,
        error: "Falha ao carregar dados do usuário interno",
      };
    }

    return { success: true, usuario: mapUsuario(usuarioComRoles) };
  } catch (error) {
    console.error("Erro ao inicializar usuário interno:", error);
    return {
      success: false,
      error: "Erro inesperado ao criar usuário interno",
    };
  }
}
