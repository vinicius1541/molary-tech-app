import { Card } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function ConfiguracoesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Configurações</h1>
                <p className="text-muted-foreground">Configure o sistema da clínica</p>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Configurações em desenvolvimento</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
