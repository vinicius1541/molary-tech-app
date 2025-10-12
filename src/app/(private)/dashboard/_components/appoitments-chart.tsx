"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
    { date: "01/01", consultas: 18 },
    { date: "02/01", consultas: 22 },
    { date: "03/01", consultas: 19 },
    { date: "04/01", consultas: 25 },
    { date: "05/01", consultas: 21 },
    { date: "06/01", consultas: 28 },
    { date: "07/01", consultas: 24 },
    { date: "08/01", consultas: 26 },
    { date: "09/01", consultas: 23 },
    { date: "10/01", consultas: 29 },
    { date: "11/01", consultas: 27 },
    { date: "12/01", consultas: 31 },
]

const chartConfig = {
    consultas: {
        label: "Consultas",
        color: "hsl(var(--chart-1))",
    },
}

export function AppointmentsChart() {
    return (
        <Card className="p-6">
            <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold">Consultas Realizadas</h3>
                <p className="text-sm text-muted-foreground">Últimos 12 dias de atividade</p>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="fillConsultas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-consultas)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-consultas)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        type="monotone"
                        dataKey="consultas"
                        stroke="var(--color-consultas)"
                        fill="url(#fillConsultas)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </Card>
    )
}
