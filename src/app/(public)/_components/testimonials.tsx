import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Dr. Carlos Silva",
        role: "Ortodontista",
        clinic: "Clínica Sorriso Perfeito",
        content:
            "O Molary Tech revolucionou a gestão da minha clínica. Economizo horas por dia e meus pacientes adoram a praticidade do sistema.",
        rating: 5,
        avatar: "👨‍⚕️",
    },
    {
        name: "Dra. Ana Paula",
        role: "Dentista Geral",
        clinic: "Odonto Center",
        content:
            "Interface intuitiva e recursos completos. A anamnese digital facilitou muito o atendimento e organização dos prontuários.",
        rating: 5,
        avatar: "👩‍⚕️",
    },
    {
        name: "Dr. Roberto Mendes",
        role: "Implantodontista",
        clinic: "Implante Já",
        content:
            "Os relatórios e gráficos me ajudam a tomar decisões estratégicas. Aumentei minha produtividade em 40% desde que comecei a usar.",
        rating: 5,
        avatar: "👨‍⚕️",
    },
    {
        name: "Dra. Juliana Costa",
        role: "Endodontista",
        clinic: "Endo Clinic",
        content: "Suporte excepcional e sistema sempre atualizado. Recomendo para todos os colegas da área odontológica!",
        rating: 5,
        avatar: "👩‍⚕️",
    },
]

export function Testimonials() {
    return (
        <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                        Amado por <span className="text-primary">dentistas</span> em todo Brasil
                    </h2>
                    <p className="text-xl text-muted-foreground text-pretty">
                        Veja o que profissionais da odontologia estão dizendo sobre o Molary Tech.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{testimonial.avatar}</div>
                                <div>
                                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                    <div className="text-xs text-muted-foreground">{testimonial.clinic}</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
