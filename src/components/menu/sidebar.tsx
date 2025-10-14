"use client"

import {useState} from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {
    BarChart3,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    DollarSign,
    FileText,
    LayoutDashboard,
    Menu,
    Package,
    Settings,
    UserCog,
    Users,
    X,
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import dynamic from "next/dynamic"
import { MolaryIconSmall } from "../logo/molary-icon-small"
import { MolaryLogoSmall } from "../logo/molary-logo-small"

// Importação dinâmica do UserButton só no client
const UserButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.UserButton), { ssr: false })

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-primary",
    },
    {
        label: "Agendamentos",
        icon: Calendar,
        href: "/agendamentos",
        color: "text-primary",
    },
    {
        label: "Pacientes",
        icon: Users,
        href: "/pacientes",
        color: "text-primary",
    },
    {
        label: "Anamnese",
        icon: ClipboardList,
        href: "/anamnese",
        color: "text-primary",
    },
    {
        label: "Prontuários",
        icon: FileText,
        href: "/prontuarios",
        color: "text-primary",
    },
    {
        label: "Funcionários",
        icon: UserCog,
        href: "/funcionarios",
        color: "text-primary",
    },
    {
        label: "Financeiro",
        icon: DollarSign,
        href: "/financeiro",
        color: "text-primary",
    },
    {
        label: "Estoque",
        icon: Package,
        href: "/estoque",
        color: "text-primary",
    },
    {
        label: "Relatórios",
        icon: BarChart3,
        href: "/relatorios",
        color: "text-primary",
    },
    {
        label: "Configurações",
        icon: Settings,
        href: "/configuracoes",
        color: "text-primary",
    },
]

export function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div>
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 right-4 z-50 md:hidden bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
            </Button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileOpen(false)}/>
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-16",
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-center p-3 border-b border-sidebar-border relative">
                        <div className="flex items-center gap-3 min-w-0">
                            {!isExpanded &&

                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center">
                                {<MolaryIconSmall />}
                            </div>}
                            
                            <div className={cn(
                                "transition-all duration-300 overflow-hidden",
                                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0",
                            )}>
                                <h2 className="font-bold text-lg text-sidebar-foreground whitespace-nowrap"><MolaryLogoSmall /></h2>
                                {/* <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">
                                    Clínica Odontológica
                                </p> */}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hidden md:flex items-center justify-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronLeft className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        <TooltipProvider delayDuration={300}>
                            <div className="space-y-1">
                                {routes.map((route) => (
                                    <Tooltip key={route.href}>
                                        <TooltipTrigger asChild>
                                            <Link href={route.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center rounded-lg transition-all duration-200",
                                                    isExpanded ? " gap-3 px-3 py-3" : "px-0 py-3 justify-center",
                                                    pathname === route.href
                                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                            )}>
                                                <route.icon className={cn("h-5 w-5 flex-shrink-0", pathname === route.href ? "" : route.color)} />
                                                <span className={cn(
                                                    "font-medium text-sm transition-all duration-300 whitespace-nowrap",
                                                    isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden",
                                                )}>
                                                    {route.label}
                                                </span>
                                            </Link>
                                        </TooltipTrigger>
                                        {!isExpanded && (
                                            <TooltipContent side="right" className="ml-2">
                                                {route.label}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                ))}
                            </div>
                        </TooltipProvider>
                    </nav>

                    <div className="border-t border-sidebar-border p-2">
                        <div
                            className={cn(
                                "flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer",
                                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                isExpanded ? "px-3 py-3" : "px-0 py-2 justify-center"
                            )}
                        >
                            {/* Avatar e menu do Clerk */}
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonOuterIdentifier: cn(
                                            "text-sm font-medium transition-all duration-300",
                                            isExpanded
                                                ? "opacity-100 ml-2 !text-blue-500"
                                                : "opacity-0 w-0"
                                        )
                                    }
                                }}
                                showName={isExpanded}
                            />
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}
