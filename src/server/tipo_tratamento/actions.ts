"use server"

import { tipo_tratamento, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateTipoTratamento(tipo_tratamento: tipo_tratamento) {
    await prisma.tipo_tratamento.upsert({
        where: { id: tipo_tratamento.id },
        update: {
            nome: tipo_tratamento.nome,
            descricao: tipo_tratamento.descricao
        },
        create: {
            ...tipo_tratamento, id: undefined
        }
    })
}