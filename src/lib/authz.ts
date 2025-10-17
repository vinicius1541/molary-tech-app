import { PrismaClient } from "@/generated/prisma";

export type RoleSummary = {
  id: string;
  nome: string;
  slug: string;
  hierarquia: number;
};

export type PermissionSeed = {
  chave: string;
  descricao?: string;
  categoria?: string;
};

export type UsuarioAuthContext = {
  id: string;
  email: string;
  roles: RoleSummary[];
  permissions: string[];
};

export const DEFAULT_ROLE_SLUG = "colaborador";

export const DEFAULT_PERMISSION_SEEDS: PermissionSeed[] = [
  {
    chave: "dashboard.view",
    descricao: "Acessar o painel de visão geral",
    categoria: "Dashboard",
  },
  {
    chave: "agendamentos.manage",
    descricao: "Gerenciar agenda e compromissos",
    categoria: "Agendamentos",
  },
  {
    chave: "anamnese.manage",
    descricao: "Criar e editar anamnese de pacientes",
    categoria: "Anamnese",
  },
  {
    chave: "colaborador.manage",
    descricao: "Administrar informações de colaboradores",
    categoria: "Colaborador",
  },
  {
    chave: "configuracoes.manage",
    descricao: "Acessar configurações gerais",
    categoria: "Configurações",
  },
  {
    chave: "estoque.manage",
    descricao: "Controlar itens de estoque",
    categoria: "Estoque",
  },
  {
    chave: "financeiro.manage",
    descricao: "Gerenciar finanças e recebimentos",
    categoria: "Financeiro",
  },
  {
    chave: "funcionarios.manage",
    descricao: "Administrar dados de funcionários",
    categoria: "Funcionários",
  },
  {
    chave: "pacientes.manage",
    descricao: "Gerenciar cadastro e dados de pacientes",
    categoria: "Pacientes",
  },
  {
    chave: "prontuarios.manage",
    descricao: "Editar prontuários clínicos",
    categoria: "Prontuários",
  },
  {
    chave: "relatorios.view",
    descricao: "Visualizar relatórios do sistema",
    categoria: "Relatórios",
  },
];

let prismaSingleton: PrismaClient | null = null;

function getPrisma(prismaClient?: PrismaClient) {
  if (prismaClient) {
    return prismaClient;
  }

  if (!prismaSingleton) {
    prismaSingleton = new PrismaClient();
  }

  return prismaSingleton;
}

function extractRolesAndPermissions(usuario: any): {
  roles: RoleSummary[];
  permissions: string[];
} {
  const roles: RoleSummary[] = [];
  const permissionSet = new Set<string>();

  for (const entry of usuario?.usuario_roles ?? []) {
    const role = entry.role;
    if (!role) {
      continue;
    }

    roles.push({
      id: role.id.toString(),
      nome: role.nome,
      slug: role.slug,
      hierarquia: role.hierarquia,
    });

    for (const rolePermission of role.role_permissions ?? []) {
      const key = rolePermission.permission?.chave;
      if (key) {
        permissionSet.add(key);
      }
    }
  }

  return {
    roles,
    permissions: Array.from(permissionSet),
  };
}

export function buildUsuarioAuthContext(usuario: any): UsuarioAuthContext {
  const { roles, permissions } = extractRolesAndPermissions(usuario);

  return {
    id: usuario.id.toString(),
    email: usuario.email,
    roles,
    permissions,
  };
}

export async function ensurePermissionSeeds(
  prismaClient?: PrismaClient,
  seeds: PermissionSeed[] = DEFAULT_PERMISSION_SEEDS
) {
  const prisma = getPrisma(prismaClient);
  const createdPermissions = [];

  for (const seed of seeds) {
    const permission = await prisma.permission.upsert({
      where: { chave: seed.chave },
      update: {
        descricao: seed.descricao,
        categoria: seed.categoria,
      },
      create: {
        chave: seed.chave,
        descricao: seed.descricao,
        categoria: seed.categoria,
      },
    });

    createdPermissions.push(permission);
  }

  return createdPermissions;
}

export async function ensureRoleHasPermissions(
  roleId: bigint,
  prismaClient?: PrismaClient,
  seeds: PermissionSeed[] = DEFAULT_PERMISSION_SEEDS
) {
  const prisma = getPrisma(prismaClient);
  const permissions = await ensurePermissionSeeds(prisma, seeds);

  await Promise.all(
    permissions.map((permission) =>
      prisma.role_permission.upsert({
        where: {
          role_id_permission_id: {
            role_id: roleId,
            permission_id: permission.id,
          },
        },
        update: {},
        create: {
          role_id: roleId,
          permission_id: permission.id,
        },
      })
    )
  );
}

export async function getUsuarioAuthContextByExternalId(
  externalUserId: string,
  prismaClient?: PrismaClient
): Promise<UsuarioAuthContext | null> {
  const prisma = getPrisma(prismaClient);

  const usuario = await prisma.usuario.findUnique({
    where: { external_user_id: externalUserId },
    include: {
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

  if (!usuario) {
    return null;
  }

  return buildUsuarioAuthContext(usuario);
}

export async function getUsuarioAuthContextById(
  usuarioId: bigint,
  prismaClient?: PrismaClient
): Promise<UsuarioAuthContext | null> {
  const prisma = getPrisma(prismaClient);

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
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

  if (!usuario) {
    return null;
  }

  return buildUsuarioAuthContext(usuario);
}

export function hasPermissions(
  authContext: UsuarioAuthContext | null,
  required: string | string[]
) {
  if (!authContext) {
    return false;
  }

  const requiredList = Array.isArray(required) ? required : [required];
  const granted = new Set(authContext.permissions);

  return requiredList.every((permission) => granted.has(permission));
}

export function hasRole(authContext: UsuarioAuthContext | null, roleSlug: string) {
  if (!authContext) {
    return false;
  }

  return authContext.roles.some((role) => role.slug === roleSlug);
}
