import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"

export default function AgendamentosPage() {
    return (
        <div className="min-h-screen p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Agendamentos</h1>
                    <p className="text-muted-foreground">Gerencie os agendamentos da clínica</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Agendamento
                </Button>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-primary/30" />
                        <p>Sistema de agendamentos em desenvolvimento</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
