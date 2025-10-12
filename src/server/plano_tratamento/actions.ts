"use server"

import { plano_tratamento, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdatePlanoTratamento(plano_tratamento: plano_tratamento) {
    await prisma.plano_tratamento.upsert({
        where: { id: plano_tratamento.id },
        update: {
            descricao: plano_tratamento.descricao,
            status: plano_tratamento.status
        },
        create: {
            ...plano_tratamento, id: undefined
        }

    })
}


type PlanoTratamento = {
    total: number
    variacao: number
}
export async function getTratamentosAtivos(): Promise<PlanoTratamento[]> {
    return prisma.$queryRaw<PlanoTratamento[]>`
        WITH tratamentos_mes_atual AS (
            SELECT COUNT(*)::int AS total_atual
            FROM plano_tratamento
            WHERE date_trunc('month', dt_add) = date_trunc('month', CURRENT_DATE)
                AND status = true
        ),
        tratamentos_mes_anterior AS (
            SELECT COUNT(*)::int AS total_anterior
            FROM plano_tratamento
            WHERE date_trunc('month', dt_add) = date_trunc('month', CURRENT_DATE - interval '1 month')
        )
        SELECT 
            tratamentos_mes_atual.total_atual AS total,
            CASE
                WHEN tratamentos_mes_anterior.total_anterior = 0 THEN 0
                ELSE ROUND(tratamentos_mes_atual.total_atual - tratamentos_mes_anterior.total_anterior)
            END AS variacao
        FROM tratamentos_mes_atual, tratamentos_mes_anterior;
    `
}