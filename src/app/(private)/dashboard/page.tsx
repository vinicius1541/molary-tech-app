import {DashboardHeader} from "@/app/(private)/dashboard/_components/dashboard-header";
import {StatItem, StatsCards} from "@/app/(private)/dashboard/_components/stats-cards";
import {AppointmentsChart} from "@/app/(private)/dashboard/_components/appoitments-chart";
import {RevenueChart} from "@/app/(private)/dashboard/_components/revenue-chart";
import {RecentAppointments} from "@/app/(private)/dashboard/_components/recent-apointments";
import {TreatmentStatus} from "@/app/(private)/dashboard/_components/treatment-status";
import {getPacientes} from "@/server/paciente/actions";
import {getTodaysConsulta} from "@/server/consulta/actions";
import {getTratamentosAtivos} from "@/server/plano_tratamento/actions";
import {getReceita} from "@/server/pagamento/actions";

export default async function Dashboard() {

    const pacienteStats = await getPacientes()
    const consultaStats = await getTodaysConsulta()
    const tratamentosAtivos = await getTratamentosAtivos()
    const receitaMensal = await getReceita()

    const stats: StatItem[] = [
        {
            title: "Total de Pacientes",
            value: `${pacienteStats[0].total}`,
            change: `+${pacienteStats[0].variacao_perc}%`,
            trend: "up" as const,
            icon: "Users",
            color: "text-chart-1",
        },
        {
            title: "Consultas Hoje",
            value: `${consultaStats[0].total}`,
            change: `+${consultaStats[0].variacao}`,
            trend: "up" as const,
            icon: "Calendar",
            color: "text-chart-2",
        },
        {
            title: "Receita Mensal",
            value: `R$ ${receitaMensal[0].total}`,
            change: `+${receitaMensal[0].variacao_perc}%`,
            trend: "up" as const,
            icon: "DollarSign",
            color: "text-chart-3",
        },
        {
            title: "Tratamentos Ativos",
            value: `${tratamentosAtivos[0].total}`,
            change: `+${tratamentosAtivos[0].variacao}`,
            trend: "up" as const,
            icon: "ClipboardList",
            color: "text-chart-4",
        },
    ]

    return (
        <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12">
            <div className="mx-auto max-w-[1600px] space-y-8">
                <DashboardHeader />
                <StatsCards stats={stats}/>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RecentAppointments />
                    </div>
                    <TreatmentStatus />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <AppointmentsChart />
                    <RevenueChart />
                </div>

            </div>
        </div>
    )
}
