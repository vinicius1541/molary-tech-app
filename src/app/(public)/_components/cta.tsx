import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
    return (
        <section className="bg-gradient-to-br from-secondary via-secondary/90 to-primary py-20 md:py-32">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="mb-6 text-balance text-4xl font-bold text-background md:text-5xl lg:text-6xl">
                        Pronto para transformar sua clínica?
                    </h2>
                    <p className="mb-8 text-pretty text-xl text-background">
                        Junte-se a milhares de dentistas que já modernizaram sua gestão com o Molary Tech. Comece seu teste grátis hoje
                        mesmo, sem cartão de crédito.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="px-8 text-lg bg-card text-secondary hover:bg-card/90 cursor-pointer">
                            Começar Teste Grátis de 14 Dias
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-background/60 bg-transparent px-8 text-lg text-background hover:bg-background/10"
                        >
                            Agendar Demonstração
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-background/80">
                        ✓ Sem cartão de crédito ✓ Cancele quando quiser ✓ Suporte em português
                    </p>
                </div>
            </div>
        </section>
    )
}
