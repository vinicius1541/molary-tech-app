"use server"

import { receita, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateReceita(receita: receita) {
    await prisma.receita.upsert({
        where: { id: receita.id },
        update: {
            medicamento: receita.medicamento,
            dosagem: receita.dosagem
        },
        create: {
            ...receita, id: undefined
        }
    })
}