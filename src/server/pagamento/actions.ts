"use server"

import {pagamento, PrismaClient} from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdatePagamento(pagamento: pagamento) {
    await prisma.pagamento.upsert({
        where: { id: pagamento.id },
        update: {
            valor_pago: pagamento.valor_pago,
            data_pagamento: pagamento.data_pagamento,
            metodo_pagamento: pagamento.metodo_pagamento
        },
        create: {
            ...pagamento, id: undefined
        }
    })
}

type Receita = {
    total: number
    variacao_perc: number
}
export async function getReceita(): Promise<Receita[]> {
    return prisma.$queryRaw<Receita[]>`
        WITH pagamentos_mes_atual AS (
            SELECT COALESCE(SUM(valor_pago), 0) AS total_atual
            FROM pagamento
            WHERE date_trunc('month', data_pagamento) = date_trunc('month', CURRENT_DATE)
        ),
             pagamentos_mes_anterior AS (
                 SELECT COALESCE(SUM(valor_pago), 0) AS total_anterior
                 FROM pagamento
                 WHERE date_trunc('month', data_pagamento) = date_trunc('month', CURRENT_DATE - interval '1 month')
             )
        SELECT
            pagamentos_mes_atual.total_atual AS total,
            CASE
                WHEN pagamentos_mes_anterior.total_anterior = 0 THEN NULL
                ELSE ROUND(((pagamentos_mes_atual.total_atual - pagamentos_mes_anterior.total_anterior) * 100.0 /
                            pagamentos_mes_anterior.total_anterior), 2)
                END AS variacao_perc
        FROM pagamentos_mes_atual, pagamentos_mes_anterior;
    `
}