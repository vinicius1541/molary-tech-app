"use server"

import { anamnese, PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateAnamnese(anamnese: anamnese) {
    await prisma.anamnese.upsert({
        where: { id: anamnese.id },
        update: {
            queixa: anamnese.queixa,
            historico_doenca_atual: anamnese.historico_doenca_atual,
            historico_medico: anamnese.historico_medico,
            historico_odonto: anamnese.historico_odonto,
            alergias: anamnese.alergias,
            med_em_uso: anamnese.med_em_uso,
            habitos: anamnese.habitos
        },
        create: {
            ...anamnese, id: undefined
        }
    })
}