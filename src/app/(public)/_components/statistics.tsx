"use client"

import { Card } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts"

const monthlyData = [
    { month: "Jan", consultas: 145, receita: 28500 },
    { month: "Fev", consultas: 168, receita: 32400 },
    { month: "Mar", consultas: 192, receita: 38200 },
    { month: "Abr", consultas: 178, receita: 35600 },
    { month: "Mai", consultas: 210, receita: 42800 },
    { month: "Jun", consultas: 234, receita: 48900 },
]

// Função para obter cores CSS do tema
const getCSSVariable = (variable: string) => {
    if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
    }
    return ''
}

const treatmentData = [
    { name: "Limpeza", value: 35, color: "--color-chart-1" },
    { name: "Restauração", value: 28, color: "--color-chart-2" },
    { name: "Canal", value: 18, color: "--color-chart-3" },
    { name: "Ortodontia", value: 12, color: "--color-chart-4" },
    { name: "Outros", value: 7, color: "--color-chart-5" },
]

const weeklyData = [
    { day: "Seg", pacientes: 32 },
    { day: "Ter", pacientes: 45 },
    { day: "Qua", pacientes: 38 },
    { day: "Qui", pacientes: 52 },
    { day: "Sex", pacientes: 48 },
    { day: "Sáb", pacientes: 28 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-3 shadow-xl">
                <p className="font-semibold text-foreground mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export function Statistics() {
    // Obter cores do tema dinamicamente
    const primaryColor = getCSSVariable('--color-primary')
    const secondaryColor = getCSSVariable('--color-secondary')
    const accentColor = getCSSVariable('--color-accent')
    const chart1 = getCSSVariable('--color-chart-1')
    const chart2 = getCSSVariable('--color-chart-2')
    const chart3 = getCSSVariable('--color-chart-3')
    const chart4 = getCSSVariable('--color-chart-4')

    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                        Dados que impulsionam <span className="text-primary">resultados</span>
                    </h2>
                    <p className="text-base text-muted-foreground text-pretty">
                        Visualize o desempenho da sua clínica com dashboards intuitivos e relatórios detalhados.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-5 mb-5">
                    <Card className="p-5 border-2 hover:border-primary/30 transition-all shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-primary">Consultas e Receita Mensal</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chart1} stopOpacity={0.6} />
                                        <stop offset="95%" stopColor={chart1} stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chart2} stopOpacity={0.6} />
                                        <stop offset="95%" stopColor={chart2} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} />
                                <YAxis yAxisId="left" stroke={chart1} style={{ fontSize: "12px" }} />
                                <YAxis yAxisId="right" orientation="right" stroke={chart2} style={{ fontSize: "12px" }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: "13px" }} />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="consultas"
                                    stroke={chart1}
                                    strokeWidth={2.5}
                                    fill="url(#colorConsultas)"
                                    name="Consultas"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="receita"
                                    stroke={chart2}
                                    strokeWidth={2.5}
                                    fill="url(#colorReceita)"
                                    name="Receita (R$)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="p-5 border-2 hover:border-secondary/30 transition-all shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-secondary">Distribuição de Tratamentos</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <defs>
                                    {treatmentData.map((entry, index) => {
                                        const color = getCSSVariable(entry.color)
                                        return (
                                            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={color} stopOpacity={1} />
                                                <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                                            </linearGradient>
                                        )
                                    })}
                                </defs>
                                <Pie
                                    data={treatmentData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={{
                                        stroke: "#94a3b8",
                                        strokeWidth: 1,
                                    }}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={95}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={2}
                                    stroke="#fff"
                                    strokeWidth={2}
                                >
                                    {treatmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                <Card className="p-5 border-2 hover:border-accent/30 transition-all shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-accent">Fluxo de Pacientes Semanal</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={weeklyData} barSize={45}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={chart3} />
                                    <stop offset="100%" stopColor={chart4} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} vertical={false} />
                            <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: "12px" }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139, 92, 246, 0.1)" }} />
                            <Bar dataKey="pacientes" fill="url(#barGradient)" radius={[8, 8, 0, 0]} name="Pacientes" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </section>
    )
}
