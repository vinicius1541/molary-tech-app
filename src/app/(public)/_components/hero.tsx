import {Button} from "@/components/ui/button"
import {ArrowRight, Play, Sparkles} from "lucide-react"
import {SignedIn, SignedOut, SignInButton} from "@clerk/nextjs";
import Link from "next/link";

export function Hero() {
    return (
        <section
            className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-12 md:py-16">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"/>
                <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"/>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="inline-block">
                          <span
                              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-lg">
                            <Sparkles className="h-4 w-4"/>
                            Sistema Completo de Gestão Odontológica
                          </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                            Transforme sua <span className="text-primary">clínica</span> com tecnologia
                        </h1>

                        <p className="text-lg text-foreground/80 text-pretty leading-relaxed">
                            Sistema completo para gestão de pacientes, consultas, anamnese, receitas e muito mais.
                            Simplifique sua
                            rotina e foque no que realmente importa: o sorriso dos seus pacientes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <SignedOut>
                                <SignInButton>
                                    <Button size="lg"
                                            className="text-base px-6 shadow-lg cursor-pointer">
                                        Criar sua conta
                                        <ArrowRight className="ml-2 h-5 w-5"/>
                                    </Button>
                                </SignInButton>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-primary/30 bg-transparent px-6 text-base text-primary hover:bg-primary/10 cursor-pointer"
                                >
                                    <Play className="mr-2 h-5 w-5"/>
                                    Ver Demonstração
                                </Button>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/dashboard">
                                    <Button size="lg"
                                            className="text-base px-6 shadow-lg cursor-pointer">
                                        Acessar Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5"/>
                                    </Button>
                                </Link>
                            </SignedIn>
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                            <div>
                                <div className="text-2xl font-bold text-primary">5.000+</div>
                                <div className="text-xs text-muted-foreground">Dentistas Ativos</div>
                            </div>
                            <div className="h-10 w-px bg-border"/>
                            <div>
                                <div className="text-2xl font-bold text-secondary">98%</div>
                                <div className="text-xs text-muted-foreground">Satisfação</div>
                            </div>
                            <div className="h-10 w-px bg-border"/>
                            <div>
                                <div className="text-2xl font-bold text-accent">24/7</div>
                                <div className="text-xs text-muted-foreground">Suporte</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative rounded-2xl bg-primary p-1 shadow-2xl">
                            <div className="rounded-xl bg-card p-5 shadow-lg">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold text-card-foreground">Consultas Hoje</h3>
                                        <span
                                            className="rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground shadow">
                      +12%
                    </span>
                                    </div>
                                    <div className="text-3xl font-bold text-primary">24</div>
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div className="h-2 w-3/4 rounded-full bg-primary"/>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        <div
                                            className="rounded-lg border border-primary/20 bg-primary/10 p-2.5 text-center">
                                            <div className="text-xl font-bold text-primary">18</div>
                                            <div className="text-[10px] text-muted-foreground">Concluídas</div>
                                        </div>
                                        <div
                                            className="rounded-lg border border-secondary/20 bg-secondary/10 p-2.5 text-center">
                                            <div className="text-xl font-bold text-secondary">4</div>
                                            <div className="text-[10px] text-muted-foreground">Pendentes</div>
                                        </div>
                                        <div
                                            className="rounded-lg border border-accent/20 bg-accent/10 p-2.5 text-center">
                                            <div className="text-xl font-bold text-accent">2</div>
                                            <div className="text-[10px] text-muted-foreground">Aguardando</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-3 -right-3 rounded-xl bg-accent p-3 shadow-lg animate-bounce">
                            <div className="text-xl">🦷</div>
                        </div>
                        <div className="absolute -bottom-3 -left-3 rounded-xl bg-secondary p-3 shadow-lg animate-pulse">
                            <div className="text-xl">⭐</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
