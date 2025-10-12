import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock } from "lucide-react"

const appointments = [
    {
        id: 1,
        paciente: "Maria Silva",
        colaborador: "Dr. João Santos",
        horario: "09:00",
        status: "confirmado",
        tipo: "Limpeza",
    },
    {
        id: 2,
        paciente: "Pedro Oliveira",
        colaborador: "Dra. Ana Costa",
        horario: "10:30",
        status: "em-andamento",
        tipo: "Tratamento de Canal",
    },
    {
        id: 3,
        paciente: "Carla Mendes",
        colaborador: "Dr. João Santos",
        horario: "11:00",
        status: "confirmado",
        tipo: "Consulta",
    },
    {
        id: 4,
        paciente: "Lucas Ferreira",
        colaborador: "Dra. Paula Lima",
        horario: "14:00",
        status: "confirmado",
        tipo: "Extração",
    },
    {
        id: 5,
        paciente: "Juliana Rocha",
        colaborador: "Dr. João Santos",
        horario: "15:30",
        status: "pendente",
        tipo: "Avaliação",
    },
]

const statusConfig = {
    confirmado: { label: "Confirmado", color: "bg-chart-3 text-chart-3" },
    "em-andamento": { label: "Em Andamento", color: "bg-chart-2 text-chart-2" },
    pendente: { label: "Pendente", color: "bg-muted-foreground text-muted-foreground" },
}

export function RecentAppointments() {
    return (
        <Card className="p-6">
            <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold">Consultas de Hoje</h3>
                <p className="text-sm text-muted-foreground">{appointments.length} consultas agendadas</p>
            </div>
            <div className="space-y-4">
                {appointments.map((appointment) => {
                    const status = statusConfig[appointment.status as keyof typeof statusConfig]
                    const initials = appointment.paciente
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)

                    return (
                        <div
                            key={appointment.id}
                            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{appointment.paciente}</p>
                                    <Badge variant="secondary" className={`${status.color} bg-opacity-10`}>
                                        {status.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{appointment.colaborador}</span>
                                    <span>•</span>
                                    <span>{appointment.tipo}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {appointment.horario}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
