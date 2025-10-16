"use server"

import { PrismaClient } from "@/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { clerkMetadata } from "@/lib/clerk-metadata";
import { initializeCurrentUsuario } from "@/server/usuario/actions";
import { z } from "zod";

const prisma = new PrismaClient();

const createColaboradorSchema = z.object({
    nome: z.string().min(1, "Informe o nome completo"),
    email: z.string().email("E-mail inválido"),
    telefone: z
        .string()
        .min(10, "Telefone inválido")
        .max(20)
        .optional()
        .or(z.literal("").optional())
        .nullable(),
    endereco: z
        .string()
        .max(255, "Endereço muito longo")
        .optional()
        .or(z.literal("").optional())
        .nullable(),
    cargoId: z.string().min(1, "Selecione um cargo"),
    numeroCro: z
        .string()
        .min(4, "Número CRO inválido")
        .max(15, "Número CRO inválido")
        .optional()
        .or(z.literal("").optional())
        .nullable(),
});

export type CreateColaboradorPayload = z.infer<typeof createColaboradorSchema>;

function sanitizeTelefone(value?: string | null) {
    if (!value) return null;
    const digits = value.replace(/\D/g, "");
    return digits.length ? digits : null;
}

export async function createOrUpdateColaborador(
    payload: CreateColaboradorPayload
) {
    try {
        const parseResult = createColaboradorSchema.safeParse(payload);

        if (!parseResult.success) {
            const issues = parseResult.error.issues.map((issue) => issue.message);
            return { success: false, error: issues.join(" | ") };
        }

        const user = await currentUser();
        if (!user) {
            return { success: false, error: "Usuário não autenticado" };
        }

        const usuarioResult = await initializeCurrentUsuario();
        if (!usuarioResult.success) {
            return usuarioResult;
        }

        const usuarioId = BigInt(usuarioResult.usuario.id);
        const cargoId = BigInt(parseResult.data.cargoId);

        const cargo = await prisma.cargo.findUnique({
            where: { id: cargoId },
            select: {
                id: true,
                nome: true,
                requer_cro: true,
            },
        });

        if (!cargo) {
            return { success: false, error: "Cargo selecionado não foi encontrado" };
        }

        const croDigits = parseResult.data.numeroCro
            ? parseResult.data.numeroCro.replace(/\D/g, "")
            : "";

        if (cargo.requer_cro && !croDigits) {
            return {
                success: false,
                error: "Informe o número do CRO para este cargo",
            };
        }

        const numeroCroValue = cargo.requer_cro && croDigits ? BigInt(croDigits) : null;

        const telefone = sanitizeTelefone(parseResult.data.telefone ?? null);

        const resultado = await prisma.colaborador.upsert({
            where: { usuario_id: usuarioId },
            update: {
                nome: parseResult.data.nome,
                cargo_id: cargoId,
                email: parseResult.data.email,
                telefone,
                endereco: parseResult.data.endereco ?? null,
                numero_cro: numeroCroValue,
                dt_atualizacao: new Date(),
            },
            create: {
                usuario_id: usuarioId,
                nome: parseResult.data.nome,
                cargo_id: cargoId,
                email: parseResult.data.email,
                telefone,
                endereco: parseResult.data.endereco ?? null,
                numero_cro: numeroCroValue,
                dt_criacao: new Date(),
                dt_atualizacao: null,
            },
            include: {
                cargo: true,
            },
        });

        await clerkMetadata.setColaboradorCompleted(
            user.id,
            resultado.id.toString()
        );

        return {
            success: true,
            data: {
                id: resultado.id.toString(),
                nome: resultado.nome,
                email: resultado.email,
                telefone: resultado.telefone,
                endereco: resultado.endereco,
                    numero_cro: resultado.numero_cro ? resultado.numero_cro.toString() : null,
                cargo: resultado.cargo
                    ? {
                            id: resultado.cargo.id.toString(),
                            nome: resultado.cargo.nome,
                            requerCro: resultado.cargo.requer_cro,
                        }
                    : null,
            },
        } as const;
    } catch (error) {
        console.error("Erro ao criar/atualizar colaborador:", error);
        return { success: false, error: "Erro inesperado ao cadastrar colaborador" };
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
            dt_criacao: true,
        },
    });
}

export async function getColaboradorByUserId() {
    const user = await currentUser();

    if (!user) {
        throw new Error("User not found");
    }

    const usuario = await prisma.usuario.findUnique({
        where: { external_user_id: user.id },
        select: {
            id: true,
        },
    });

    if (!usuario) {
        return null;
    }

    return prisma.colaborador.findUnique({
        where: {
            usuario_id: usuario.id,
        },
        include: {
            cargo: true,
        },
    });
}