import { Card } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function RelatoriosPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
                <p className="text-muted-foreground">Visualize relatórios e estatísticas</p>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Sistema de relatórios em desenvolvimento</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
