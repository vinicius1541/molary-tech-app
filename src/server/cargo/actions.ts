"use server"

import {cargo, PrismaClient} from "@/generated/prisma"

const prisma = new PrismaClient()

export async function createOrUpdateCargo(cargo: cargo) {
    await prisma.cargo.upsert({
        where: { id: cargo.id },
        update: {
            nome: cargo.nome
        },
        create: {
            ...cargo, id: undefined
        }
    })
}