"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
    { mes: "Jan", receita: 32400 },
    { mes: "Fev", receita: 38200 },
    { mes: "Mar", receita: 41500 },
    { mes: "Abr", receita: 39800 },
    { mes: "Mai", receita: 45600 },
    { mes: "Jun", receita: 48500 },
]

const chartConfig = {
    receita: {
        label: "Receita",
        color: "hsl(var(--chart-2))",
    },
}

export function RevenueChart() {
    return (
        <Card className="p-6">
            <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold">Receita Mensal</h3>
                <p className="text-sm text-muted-foreground">Evolução dos últimos 6 meses</p>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
                    />
                    <Bar dataKey="receita" fill="var(--color-receita)" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ChartContainer>
        </Card>
    )
}
