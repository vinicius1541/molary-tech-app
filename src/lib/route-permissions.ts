import { createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

type RoutePermissionEntry = {
  matcher: ReturnType<typeof createRouteMatcher>;
  permissions: string[];
};

const routePermissions: RoutePermissionEntry[] = [
  {
    matcher: createRouteMatcher(["/dashboard(.*)"]),
    permissions: ["dashboard.view"],
  },
  {
    matcher: createRouteMatcher(["/agendamentos(.*)"]),
    permissions: ["agendamentos.manage"],
  },
  {
    matcher: createRouteMatcher(["/anamnese(.*)"]),
    permissions: ["anamnese.manage"],
  },
  {
    matcher: createRouteMatcher(["/colaborador(.*)"]),
    permissions: ["colaborador.manage"],
  },
  {
    matcher: createRouteMatcher(["/configuracoes(.*)"]),
    permissions: ["configuracoes.manage"],
  },
  {
    matcher: createRouteMatcher(["/estoque(.*)"]),
    permissions: ["estoque.manage"],
  },
  {
    matcher: createRouteMatcher(["/financeiro(.*)"]),
    permissions: ["financeiro.manage"],
  },
  {
    matcher: createRouteMatcher(["/funcionarios(.*)"]),
    permissions: ["funcionarios.manage"],
  },
  {
    matcher: createRouteMatcher(["/pacientes(.*)"]),
    permissions: ["pacientes.manage"],
  },
  {
    matcher: createRouteMatcher(["/prontuarios(.*)"]),
    permissions: ["prontuarios.manage"],
  },
  {
    matcher: createRouteMatcher(["/relatorios(.*)"]),
    permissions: ["relatorios.view"],
  },
];

export function getRequiredPermissionsForRoute(req: NextRequest): string[] {
  for (const entry of routePermissions) {
    if (entry.matcher(req)) {
      return entry.permissions;
    }
  }

  return [];
}
