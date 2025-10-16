import { Calendar, Users, FileText, Pill, ClipboardList, TrendingUp } from "lucide-react"

const features = [
    {
        icon: Calendar,
        title: "Gestão de Consultas",
        description: "Agende, gerencie e acompanhe todas as consultas em um só lugar com sistema inteligente de lembretes.",
        gradient: "from-primary to-secondary",
    },
    {
        icon: Users,
        title: "Cadastro de Pacientes",
        description: "Prontuários digitais completos com histórico médico, documentos e responsáveis legais.",
        gradient: "from-secondary to-accent",
    },
    {
        icon: ClipboardList,
        title: "Anamnese Digital",
        description: "Formulários personalizáveis para coleta completa de informações clínicas e histórico do paciente.",
        gradient: "from-accent to-primary",
    },
    {
        icon: Pill,
        title: "Receitas e Atestados",
        description: "Emita receitas e atestados digitais com assinatura eletrônica e envio automático.",
        gradient: "from-primary via-accent to-secondary",
    },
    {
        icon: FileText,
        title: "Planos de Tratamento",
        description: "Crie e acompanhe planos de tratamento detalhados com custos e etapas bem definidas.",
        gradient: "from-secondary to-primary",
    },
    {
        icon: TrendingUp,
        title: "Relatórios e Analytics",
        description: "Dashboards intuitivos com métricas importantes para tomada de decisões estratégicas.",
        gradient: "from-accent via-secondary to-primary",
    },
]

export function Features() {
    return (
    <section id="features" className="bg-background py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                        Tudo que sua clínica precisa em{" "}
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              um só lugar
            </span>
                    </h2>
                    <p className="text-base text-muted-foreground text-pretty">
                        Recursos completos para modernizar sua gestão odontológica e proporcionar a melhor experiência para seus
                        pacientes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative rounded-xl border border-border bg-card p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-primary/40"
                        >
                            <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br p-2.5 ${feature.gradient} shadow-lg`}>
                                <feature.icon className="h-5 w-5 text-on-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
