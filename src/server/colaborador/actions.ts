"use server"

import {colaborador, PrismaClient} from "@/generated/prisma"
import {currentUser} from "@clerk/nextjs/server";

const prisma = new PrismaClient()

export async function createOrUpdateColaborador(colaborador: colaborador) {
    await prisma.colaborador.upsert({
        where: { id: colaborador.id },
        update: {
            nome: colaborador.nome,
            cargo_id: colaborador.cargo_id,
            email: colaborador.email,
            telefone: colaborador.telefone,
            endereco: colaborador.endereco,
            dt_atualizacao: new Date()
        },
        create: {
            ...colaborador, id: undefined
        }
    })
}

export async function getColaboradores() {
    return prisma.colaborador.findMany({
        select: {
            nome: true,
            cargo_id: true,
            email: true,
            telefone: true,
            endereco: true,
            dt_criacao: true
        }
    })
}

export async function getColaboradorById() {
    const user = await currentUser()

    if (!user) {
        throw new Error('User not found')
    }
    return prisma.colaborador.findFirst({
        where: {
            external_user_id: user.id
        },
    })
}