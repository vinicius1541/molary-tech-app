import { Card } from "@/components/ui/card"
import { Users, Calendar, DollarSign, ClipboardList } from "lucide-react"

const icons = { Users, Calendar, DollarSign, ClipboardList }

export interface StatItem {
    title: string
    value: string
    change: string
    trend: "up" | "down"
    icon: keyof typeof icons
    color: string
}

export function StatsCards({ stats }: { stats: StatItem[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = icons[stat.icon]
                return (
                    <Card key={stat.title} className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-chart-3">{stat.change}</span> vs mês anterior
                                </p>
                            </div>
                            <div className={`rounded-lg bg-secondary p-3 ${stat.color}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
