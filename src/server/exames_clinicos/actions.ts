"use server"

import {exames_clinicos, PrismaClient} from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateExamesClinicos(exames_clinicos: exames_clinicos) {
    await prisma.exames_clinicos.upsert({
        where: { id: exames_clinicos.id },
        update: {
            observacoes: exames_clinicos.observacoes,
            obs_extra_oral: exames_clinicos.obs_extra_oral,
            obs_intra_oral: exames_clinicos.obs_intra_oral,
            img_path: exames_clinicos.img_path
        },
        create: {
            ...exames_clinicos, id: undefined
        }
    })
}

export async function getExamesClinicosByPacienteId(id: bigint) {
    await prisma.exames_clinicos.findMany({
        select: {
            paciente_id: true,
            observacoes: true,
            obs_extra_oral: true,
            obs_intra_oral: true,
            img_path: true,
            dt_add: true
        },
        where: { paciente_id: id }
    })

}