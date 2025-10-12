import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Plus } from "lucide-react"

export default function AnamnesePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Anamnese</h1>
                    <p className="text-muted-foreground">Registre e consulte fichas de anamnese</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Anamnese
                </Button>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Sistema de anamnese em desenvolvimento</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
