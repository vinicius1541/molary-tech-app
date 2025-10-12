"use server"

import { atestado, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateAtestado(atestado: atestado) {
    await prisma.atestado.upsert({
        where: { id: atestado.id },
        update: {
            descricao: atestado.descricao,
            responsavel_id: atestado.responsavel_id,
            dt_add: atestado.dt_add
        },
        create: {
            ...atestado, id: undefined
        }
    })
}