"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, User, Settings, Shield } from 'lucide-react'

interface OnboardingProgressProps {
  isProfileComplete: boolean
  hasColaborador: boolean
  hasPermissions: boolean
}

export function OnboardingProgress({
  isProfileComplete,
  hasColaborador,
  hasPermissions
}: OnboardingProgressProps) {
  const steps = [
    {
      icon: <User className="h-4 w-4" />,
      label: 'Perfil',
      completed: isProfileComplete
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: 'Colaborador',
      completed: hasColaborador
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: 'Permissões',
      completed: hasPermissions
    }
  ]

  const completedSteps = steps.filter(step => step.completed).length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso da Configuração</span>
            <Badge variant={completedSteps === totalSteps ? "default" : "secondary"}>
              {completedSteps}/{totalSteps}
            </Badge>
          </div>

          <Progress value={progressPercentage} className="h-2" />

          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className={`${
                  step.completed ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}