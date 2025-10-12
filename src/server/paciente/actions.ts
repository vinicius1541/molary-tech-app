"use server"

import {paciente, PrismaClient} from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdatePaciente(paciente: paciente) {
    await prisma.paciente.upsert({
        where: { id: paciente.id },
        update: {
            nome: paciente.nome,
            documento: paciente.documento,
            telefone: paciente.telefone,
            sexo: paciente.sexo,
            data_nascimento: paciente.data_nascimento,
            email: paciente.email,
            endereco: paciente.endereco
        },
        create: {
            ...paciente, id: undefined
        }
    })
}

export async function getPacientesByColaborador(colaborador_id: string) {
    await prisma.$queryRaw`
        SELECT
            *
        FROM paciente p
        JOIN consulta c ON p.id = c.paciente_id
        JOIN colaborador col ON c.responsavel_id = col.id
        WHERE col.id = ${colaborador_id}
    `
}


type PacienteStats = {
    total: number
    variacao_perc: number
}

export async function getPacientes(): Promise<PacienteStats[]> {
    return prisma.$queryRaw<PacienteStats[]>`
        WITH pacientes_mes_atual AS (SELECT COUNT(*) ::int AS total_atual
                                     FROM paciente
                                     WHERE date_trunc('month', data_add) = date_trunc('month', CURRENT_DATE)),
             pacientes_mes_anterior AS (SELECT COUNT(*) ::int AS total_anterior
                                        FROM paciente
                                        WHERE date_trunc('month', data_add) =
                                              date_trunc('month', CURRENT_DATE - interval '1 month'))
        SELECT pacientes_mes_atual.total_atual AS total,
               CASE
                   WHEN pacientes_mes_anterior.total_anterior = 0 THEN 0
                   ELSE ROUND(((pacientes_mes_atual.total_atual - pacientes_mes_anterior.total_anterior) * 100.0 /
                               pacientes_mes_anterior.total_anterior), 2)
                   END                         AS variacao_perc
        FROM pacientes_mes_atual,
             pacientes_mes_anterior;
    `;
}