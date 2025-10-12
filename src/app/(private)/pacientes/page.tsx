import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"

export default function PacientesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Pacientes</h1>
                    <p className="text-muted-foreground">Gerencie o cadastro de pacientes</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Paciente
                </Button>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Sistema de pacientes em desenvolvimento</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
