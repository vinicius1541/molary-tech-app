"use server"

import { horario_expediente, PrismaClient} from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateHorarioExpediente(horario_expediente: horario_expediente) {
    await prisma.horario_expediente.upsert({
        where: { id: horario_expediente.id },
        update: {
            inicio_expediente: horario_expediente.inicio_expediente,
            fim_expediente: horario_expediente.fim_expediente
        },
        create: {
            ...horario_expediente, id: undefined
        }
    })
}