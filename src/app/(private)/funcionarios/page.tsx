import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCog, Plus } from "lucide-react"

export default function FuncionariosPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Funcionários</h1>
                    <p className="text-muted-foreground">Gerencie a equipe da clínica</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Funcionário
                </Button>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Sistema de funcionários em desenvolvimento</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
