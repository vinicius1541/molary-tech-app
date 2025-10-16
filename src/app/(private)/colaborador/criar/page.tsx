import { ColaboradorForm } from "@/app/(private)/colaborador/_components/colaborador-form"
import { getCargos } from "@/server/cargo/actions";
import { initializeCurrentUsuario } from "@/server/usuario/actions";
import { redirect } from "next/navigation";

export default async function CriarColaborador() {
    const [usuarioResult, cargosRaw] = await Promise.all([
        initializeCurrentUsuario(),
        getCargos(),
    ])

    if (!usuarioResult.success) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                    <h1 className="text-2xl font-semibold text-foreground">Não foi possível carregar o cadastro</h1>
                    <p className="text-muted-foreground">{usuarioResult.error}</p>
                </div>
            </div>
        )
    }

    if (usuarioResult.usuario.hasColaborador) {
        redirect("/dashboard")
    }

    const cargos = cargosRaw.map((cargo) => ({
        id: cargo.id.toString(),
        nome: cargo.nome,
        requerCro: cargo.requer_cro,
    }))

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Colaborador</h1>
                    <p className="text-muted-foreground">Preencha as informações em etapas para vincular um novo colaborador</p>
                </div>
                <ColaboradorForm
                    cargos={cargos}
                    usuario={{
                        nome: usuarioResult.usuario.nomeExibicao,
                        email: usuarioResult.usuario.email,
                    }}
                />
            </div>
        </div>
    )
}
