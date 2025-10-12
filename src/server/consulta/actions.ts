"use server"

import { consulta, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateConsulta(consulta: consulta) {
    await prisma.consulta.upsert({
        where: { id: consulta.id },
        update: {
            status: consulta.status,
            observacao: consulta.observacao,
            dt_add: consulta.dt_add,
            valor_consulta: consulta.valor_consulta
        },
        create: {
            ...consulta, id: undefined
        }
    })
}
type Consulta = {
    total: number
    variacao: number
}
export async function getTodaysConsulta(): Promise<Consulta[]> {
    return prisma.$queryRaw<Consulta[]>`
        WITH consultas_dia_atual AS (
            SELECT COUNT(*)::int AS total_atual
            FROM consulta
            WHERE date(dt_add) = CURRENT_DATE
            ),
            consultas_dia_anterior AS (
        SELECT COUNT(*)::int AS total_anterior
        FROM consulta
        WHERE date(dt_add) = (CURRENT_DATE - interval '1 month')
            )
        SELECT
            consultas_dia_atual.total_atual AS total,
            CASE
                WHEN consultas_dia_anterior.total_anterior = 0 THEN 0
                ELSE ROUND(consultas_dia_atual.total_atual - consultas_dia_anterior.total_anterior)
                END AS variacao
        FROM consultas_dia_atual, consultas_dia_anterior;
    `
}