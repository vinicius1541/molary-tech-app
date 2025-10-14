import { ColaboradorForm } from "@/app/(private)/colaborador/_components/colaborador-form"
import {Cargo, getCargos} from "@/server/cargo/actions";

export default async function CriarColaborador() {
    const cargos: Cargo[] = await getCargos()
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Colaborador</h1>
                    <p className="text-muted-foreground">Preencha as informações em etapas para vincular um novo colaborador</p>
                </div>
                <ColaboradorForm CARGO_OPTIONS={cargos} />
            </div>
        </div>
    )
}
