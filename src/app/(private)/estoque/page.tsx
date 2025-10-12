import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"

export default function EstoquePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Estoque</h1>
                    <p className="text-muted-foreground">Gerencie materiais e equipamentos</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Item
                </Button>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Sistema de estoque em desenvolvimento</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
