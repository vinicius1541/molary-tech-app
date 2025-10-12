"use server"

import { responsaveis_legais, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateResponsaveisLegais(responsaveis_legais: responsaveis_legais) {
    await prisma.responsaveis_legais.upsert({
        where: { id: responsaveis_legais.id },
        update: {
            nome: responsaveis_legais.nome,
            documento: responsaveis_legais.documento,
            parentesco: responsaveis_legais.parentesco,
            telefone: responsaveis_legais.telefone,
            email: responsaveis_legais.email,
            endereco: responsaveis_legais.endereco
        },
        create: {
            ...responsaveis_legais, id: undefined
        }
    })
}