import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
    {
        name: "Starter",
        price: "R$ 197",
        period: "/mês",
        description: "Perfeito para dentistas iniciantes",
        features: [
            "Até 100 pacientes",
            "Agendamento de consultas",
            "Prontuário digital",
            "Anamnese básica",
            "Suporte por email",
            "1 usuário",
        ],
        cta: "Começar Grátis",
        popular: false,
    },
    {
        name: "Professional",
        price: "R$ 397",
        period: "/mês",
        description: "Ideal para clínicas em crescimento",
        features: [
            "Pacientes ilimitados",
            "Todos os módulos inclusos",
            "Receitas e atestados digitais",
            "Planos de tratamento",
            "Relatórios avançados",
            "Até 5 usuários",
            "Suporte prioritário",
            "Integração WhatsApp",
        ],
        cta: "Começar Teste Grátis",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Personalizado",
        period: "",
        description: "Para grandes clínicas e redes",
        features: [
            "Tudo do Professional",
            "Usuários ilimitados",
            "API personalizada",
            "Treinamento dedicado",
            "Suporte 24/7",
            "Gerente de conta",
            "SLA garantido",
            "Customizações",
        ],
        cta: "Falar com Vendas",
        popular: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                        Planos para clínicas de{" "}
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              todos os tamanhos
            </span>
                    </h2>
                    <p className="text-base text-muted-foreground text-pretty">
                        Escolha o plano ideal para sua clínica. Todos incluem 14 dias de teste grátis.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`p-6 relative ${
                                plan.popular
                                    ? "border-2 border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/5 to-secondary/5"
                                    : "border-2 border-border hover:border-primary/20 transition-all"
                            }`}
                        >
                            {plan.popular && (
                                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-xs font-semibold shadow-lg text-on-primary">
                    Mais Popular
                  </span>
                                </div>
                            )}

                            <div className="text-center mb-5">
                                <h3 className="text-xl font-bold mb-1.5 text-card-foreground">{plan.name}</h3>
                                <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>
                                <div className="flex items-baseline justify-center gap-1">
                  <span
                      className={`text-3xl font-bold ${plan.popular ? "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" : "text-card-foreground"}`}
                  >
                    {plan.price}
                  </span>
                                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-2.5 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                        <Check
                                            className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-primary" : "text-secondary"}`}
                                        />
                                        <span className="text-xs text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-secondary text-on-primary shadow-lg hover:opacity-90" : "border-2"}`}
                                variant={plan.popular ? "default" : "outline"}
                            >
                                {plan.cta}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
