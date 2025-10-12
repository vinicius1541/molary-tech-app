"use server"

import { etapa_tratamento, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateEtapaTratamento(etapa_tratamento: etapa_tratamento) {
    await prisma.etapa_tratamento.upsert({
        where: { id: etapa_tratamento.id },
        update: {
            descricao: etapa_tratamento.descricao,
            status: etapa_tratamento.status,
            dt_add: etapa_tratamento.dt_add
        },
        create: {
            ...etapa_tratamento, id: undefined
        }
    })
}