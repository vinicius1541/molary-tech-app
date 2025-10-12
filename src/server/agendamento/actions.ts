"use server"

import { agendamento, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateAgendamento(agendamento: agendamento) {
    await prisma.agendamento.upsert({
        where: { id: agendamento.id },
        update: {
            data_hora: agendamento.data_hora,
            status: agendamento.status,
            observacoes: agendamento.observacoes
        },
        create: {
            ...agendamento, id: undefined
        }
    })
}

export async function getTodaysAgendamentos() {
    return prisma.agendamento.findMany({
        where: {
            data_hora: {
                //buscar pelo dia atual
                equals: new Date()
            }
        }
    })
}