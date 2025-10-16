import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const treatments = [
    {
        tipo: "Ortodontia",
        total: 45,
        concluidos: 12,
        emAndamento: 28,
        pendentes: 5,
    },
    {
        tipo: "Implantes",
        total: 32,
        concluidos: 18,
        emAndamento: 11,
        pendentes: 3,
    },
    {
        tipo: "Canal",
        total: 28,
        concluidos: 15,
        emAndamento: 10,
        pendentes: 3,
    },
    {
        tipo: "Clareamento",
        total: 51,
        concluidos: 38,
        emAndamento: 9,
        pendentes: 4,
    },
]

export function TreatmentStatus() {
    return (
        <Card className="p-6">
            <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold">Status dos Tratamentos</h3>
                <p className="text-sm text-muted-foreground">Visão geral por tipo</p>
            </div>
            <div className="space-y-6">
                {treatments.map((treatment) => {
                    const progressPercentage = (treatment.concluidos / treatment.total) * 100

                    return (
                        <div key={treatment.tipo} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">{treatment.tipo}</p>
                                <p className="text-sm text-muted-foreground">
                                    {treatment.concluidos}/{treatment.total}
                                </p>
                            </div>

                            <Progress value={progressPercentage} className="h-2" />

                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="rounded-md bg-chart-3/10 p-2 text-center">
                                    <p className="font-medium text-success">{treatment.concluidos}</p>
                                    <p className="text-muted-foreground">Concluídos</p>
                                </div>
                                <div className="rounded-md bg-chart-2/10 p-2 text-center">
                                    <p className="font-medium text-warning">{treatment.emAndamento}</p>
                                    <p className="text-muted-foreground">Em Andamento</p>
                                </div>
                                <div className="rounded-md bg-muted p-2 text-center">
                                    <p className="font-medium text-muted-foreground">{treatment.pendentes}</p>
                                    <p className="text-muted-foreground">Pendentes</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
