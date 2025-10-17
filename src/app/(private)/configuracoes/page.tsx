"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Users, Shield, Lock, Stethoscope, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import {UsersManagement} from "@/app/(private)/configuracoes/_components/users-management";
import {RolesManagement} from "@/app/(private)/configuracoes/_components/roles-management";
import {PermissionsManagement} from "@/app/(private)/configuracoes/_components/permissions-management";
import {TreatmentTypesManagement} from "@/app/(private)/configuracoes/_components/treatment-types-management";
import {PositionsManagement} from "@/app/(private)/configuracoes/_components/positions-management";

const tabs = [
  {
    id: "users",
    label: "Usuários",
    icon: Users,
    component: UsersManagement,
    title: "Gerenciamento de Usuários",
    description: "Visualize e edite usuários do sistema, gerencie status e permissões",
  },
  {
    id: "roles",
    label: "Roles",
    icon: Shield,
    component: RolesManagement,
    title: "Gerenciamento de Roles",
    description: "Configure roles e suas hierarquias no sistema",
  },
  {
    id: "permissions",
    label: "Permissões",
    icon: Lock,
    component: PermissionsManagement,
    title: "Gerenciamento de Permissões",
    description: "Defina permissões e associe-as a roles",
  },
  {
    id: "treatments",
    label: "Tratamentos",
    icon: Stethoscope,
    component: TreatmentTypesManagement,
    title: "Tipos de Tratamento",
    description: "Configure os tipos de tratamento disponíveis na clínica",
  },
  {
    id: "positions",
    label: "Cargos",
    icon: Briefcase,
    component: PositionsManagement,
    title: "Cargos",
    description: "Gerencie os cargos e níveis hierárquicos",
  },
]

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("users")
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const ActiveComponent = tabs[activeTabIndex].component

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-lime-500/20">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Configurações</h1>
            <p className="text-sm text-muted-foreground">Gerencie usuários, permissões e configurações do sistema</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative flex justify-center">
            <div className="inline-flex h-11 items-center justify-center rounded-xl bg-muted/50 p-1 backdrop-blur-sm">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                      "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-background shadow-sm border"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4" />
                    <span className="relative hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content with slide animation */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card className="border-muted/50">
                  <CardHeader className="border-b border-muted">
                    <CardTitle className="text-xl">{tabs[activeTabIndex].title}</CardTitle>
                    <CardDescription className="text-sm">{tabs[activeTabIndex].description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ActiveComponent />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
