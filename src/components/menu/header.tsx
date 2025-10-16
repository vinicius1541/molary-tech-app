"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import { useState } from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import {MolaryLogoSmall} from "@/components/logo/molary-logo-small";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-header shadow-lg backdrop-blur-sm">
            <div className="w-full px-4 md:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                        <MolaryLogoSmall molaryColor="var(--header-foreground)"/>
                    </Link>

                    <div className="ml-auto flex items-center gap-4">
                        <SignedOut>
                            <SignInButton>
                                <div className="hidden items-center gap-4 md:flex">
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer text-header hover:bg-primary/10 hover:text-primary"
                                    >
                                        Entrar
                                    </Button>
                                    <Button className="cursor-pointer bg-primary text-on-primary shadow-lg hover:bg-primary/90">
                                        Começar Grátis
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </SignInButton>

                            {/* Mobile Menu Button */}
                            <button
                                className="text-header transition-colors hover:text-primary md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    className="cursor-pointer bg-primary text-on-primary px-6 text-base font-semibold shadow-lg hover:bg-primary/90"
                                >
                                    Acessar Dashboard
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-10 w-10",
                                        userButtonTrigger: "transition-opacity hover:opacity-80",
                                    },
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="space-y-3 border-t border-border/30 py-4 md:hidden">
                        <SignedOut>
                            <div className="flex flex-col gap-2">
                                <SignInButton>
                                    <Button
                                        variant="ghost"
                                        className="w-full cursor-pointer justify-start text-header hover:bg-primary/10 hover:text-primary"
                                    >
                                        Entrar
                                    </Button>
                                </SignInButton>
                                <SignInButton>
                                    <Button className="w-full cursor-pointer bg-primary text-on-primary hover:bg-primary/90">
                                        Começar Grátis
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
