import { Calendar } from "lucide-react"

export function DashboardHeader() {
    const currentDate = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Molary Tech</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <p className="text-sm capitalize">{currentDate}</p>
            </div>
        </div>
    )
}
