import { initializeCurrentUsuario } from "@/server/usuario/actions";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const usuarioResult = await initializeCurrentUsuario();

  if (!usuarioResult.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Não foi possível concluir essa etapa</h1>
          <p className="text-muted-foreground">
            {usuarioResult.error}
          </p>
          <p className="text-sm text-muted-foreground">
            Atualize a página para tentar novamente. Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }

  if (usuarioResult.usuario.hasColaborador) {
    redirect("/dashboard");
  }

  redirect("/colaborador/criar");
}
