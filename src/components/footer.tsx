import { MonicaoLogo } from "./logo/monicao-logo"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <MonicaoLogo />
                            <span className="text-2xl font-bold text-foreground">Molary Tech</span>
                        </div>
                        <p className="text-muted-foreground mb-4 max-w-sm">
                            Sistema completo de gestão odontológica para modernizar sua clínica e proporcionar a melhor experiência
                            para seus pacientes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Produto</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                                    Recursos
                                </a>
                            </li>
                            <li>
                                <a href="#modules" className="text-muted-foreground hover:text-primary transition-colors">
                                    Módulos
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                                    Preços
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Atualizações
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Empresa</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Sobre
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Carreiras
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contato
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Suporte</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Central de Ajuda
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Documentação
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    API
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">© 2025 Molary Tech. Todos os direitos reservados.</p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Privacidade
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Termos
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
