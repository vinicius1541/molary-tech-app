import { Card } from "@/components/ui/card"
import { Database, UserCheck, FileHeart, Pill, ClipboardCheck, Stethoscope, Receipt, Calendar } from "lucide-react"

const modules = [
    {
        icon: UserCheck,
        title: "Pacientes",
        description: "Cadastro completo com documentos, contatos e histórico",
        features: ["CPF/RG", "Endereço", "Responsáveis Legais", "Histórico Completo"],
        gradient: "from-primary to-secondary",
    },
    {
        icon: Calendar,
        title: "Consultas",
        description: "Agendamento e gestão de atendimentos",
        features: ["Status em Tempo Real", "Prontuário Digital", "Observações", "Histórico"],
        gradient: "from-secondary to-accent",
    },
    {
        icon: FileHeart,
        title: "Anamnese",
        description: "Coleta detalhada de informações clínicas",
        features: ["Queixa Principal", "Histórico Médico", "Medicamentos", "Hábitos"],
        gradient: "from-accent to-primary",
    },
    {
        icon: Pill,
        title: "Receitas",
        description: "Prescrição digital de medicamentos",
        features: ["Medicamentos", "Dosagem", "Assinatura Digital", "Envio Automático"],
        gradient: "from-primary via-accent to-secondary",
    },
    {
        icon: ClipboardCheck,
        title: "Atestados",
        description: "Emissão de atestados médicos",
        features: ["Descrição", "Validade", "Assinatura", "Impressão"],
        gradient: "from-secondary to-primary",
    },
    {
        icon: Stethoscope,
        title: "Planos de Tratamento",
        description: "Planejamento completo de procedimentos",
        features: ["Etapas", "Custos", "Prazos", "Acompanhamento"],
        gradient: "from-accent via-secondary to-primary",
    },
    {
        icon: Receipt,
        title: "Etapas de Tratamento",
        description: "Detalhamento de cada fase do tratamento",
        features: ["Descrição", "Valores", "Status", "Responsável"],
        gradient: "from-primary to-accent",
    },
    {
        icon: Database,
        title: "Diários Clínicos",
        description: "Registro de observações importantes",
        features: ["Anotações", "Alertas", "Histórico", "Compartilhamento"],
        gradient: "from-secondary via-primary to-accent",
    },
]

export function SystemModules() {
    return (
        <section id="modules" className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                        Módulos completos para{" "}
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              gestão total
            </span>
                    </h2>
                    <p className="text-base text-muted-foreground text-pretty">
                        Sistema integrado baseado em arquitetura robusta para atender todas as necessidades da sua clínica
                        odontológica.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {modules.map((module, index) => (
                        <Card
                            key={index}
                            className="bg-gradient-to-br from-card to-muted/20 p-4 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                        >
                            <div className={`mb-3 inline-flex rounded-lg bg-primary p-2.5 ${module.gradient} shadow-md`}>
                                <module.icon className="h-5 w-5 text-on-primary" />
                            </div>
                            <h3 className="text-base font-semibold mb-1.5 text-card-foreground">{module.title}</h3>
                            <p className="text-xs text-muted-foreground mb-3">{module.description}</p>
                            <ul className="space-y-1.5">
                                {module.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-xs text-muted-foreground">
                                        <span className={`mr-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${module.gradient}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
