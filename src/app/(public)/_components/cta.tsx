import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
    return (
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary/90 to-secondary">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white text-balance">
                        Pronto para transformar sua clínica?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 text-pretty">
                        Junte-se a milhares de dentistas que já modernizaram sua gestão com o Molary Tech. Comece seu teste grátis hoje
                        mesmo, sem cartão de crédito.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
                            Começar Teste Grátis de 14 Dias
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent"
                        >
                            Agendar Demonstração
                        </Button>
                    </div>
                    <p className="text-sm text-white/80 mt-6">
                        ✓ Sem cartão de crédito ✓ Cancele quando quiser ✓ Suporte em português
                    </p>
                </div>
            </div>
        </section>
    )
}
