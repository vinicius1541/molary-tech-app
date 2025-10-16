import { Hero } from "@/app/(public)/_components/hero"
import { Features } from "@/app/(public)/_components/features"
import { Statistics } from "@/app/(public)/_components/statistics"
import { SystemModules } from "@/app/(public)/_components/system-modules"
import { Testimonials } from "@/app/(public)/_components/testimonials"
import { Pricing } from "@/app/(public)/_components/pricing"
import { CTA } from "@/app/(public)/_components/cta"
import { Header } from "@/components/menu/header"
import { Footer } from "@/components/footer"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <div className="flex-1">
                <Hero />
                <Features />
                <Statistics />
                <SystemModules />
                <Testimonials />
                <Pricing />
                <CTA />
            </div>
            <Footer />
        </main>
    )
}
