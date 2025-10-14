"use client"

import {Button} from "@/components/ui/button"
import {ArrowRight, Menu, X} from "lucide-react"
import {useState} from "react"
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import Link from "next/link";
import {MolaryIconSmall} from "@/components/logo/molary-icon-small";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-border rounded-lg bg-sidebar shadow-sm">
            <div className="w-full px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MolaryIconSmall />
                        <span className="text-2xl font-bold text-foreground">Molary Tech</span>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <SignedOut>
                            <SignInButton>
                                <div className="hidden md:flex items-center gap-4">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">Entrar</Button>
                                </div>
                            </SignInButton>

                            {/* Mobile Menu Button */}
                            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button size="lg"
                                        className="bg-primary text-white hover:bg-primary/90 text-base px-6 shadow-lg cursor-pointer">
                                    Acessar
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </Button>
                            </Link>
                        </SignedIn>
                        <UserButton showName={true}/>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-4">
                        <SignedOut>
                            <div className="flex flex-col gap-2 pt-4">
                                <SignInButton>
                                    <Button variant="ghost" className="w-full cursor-pointer">
                                        Entrar
                                    </Button>
                                </SignInButton>
                            </div>
                        </SignedOut>
                    </div>
                )}
            </div>
        </header>
    )
}
