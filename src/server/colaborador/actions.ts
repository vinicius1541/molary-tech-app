"use server"

import {colaborador, PrismaClient} from "@/generated/prisma"
import {currentUser} from "@clerk/nextjs/server";
import { clerkMetadata } from "@/lib/clerk-metadata";

const prisma = new PrismaClient()

export async function createOrUpdateColaborador(colaborador: colaborador) {
    try {
        const user = await currentUser();
        if (!user) {
            return { success: false, error: "Usuário não autenticado" };
        }

        const result = await prisma.colaborador.upsert({
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
                ...colaborador, 
                id: undefined, 
                dt_criacao: new Date(), 
                dt_atualizacao: null,
                external_user_id: user.id // Garantir que usa o ID do Clerk
            }
        });

        // IMPORTANTE: Definir metadata do Clerk para marcar que o usuário tem colaborador
        await clerkMetadata.setColaboradorCompleted(user.id, result.id.toString());

        return {
            success: true,
            data: result
        }
    } catch (error) {
        console.error('Erro ao criar/atualizar colaborador:', error);
        return { success: false, error: "Erro inesperado ao cadastrar colaborador" }
    }
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

export async function getColaboradorByUserId() {
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