"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UsuarioDTO } from "@/server/usuario/actions"

const STATUS_OPTIONS: UsuarioDTO["status"][] = ["ATIVO", "INATIVO", "SUSPENSO"]

export type UserFormValues = {
    email: string
    nomeExibicao: string
    status: UsuarioDTO["status"]
}

type UserFormDialogProps = {
    open: boolean
    mode: "create" | "edit"
    user: UsuarioDTO | null
    isSubmitting: boolean
    onClose: () => void
    onSubmit: (values: UserFormValues) => Promise<void> | void
    onValidationError?: (message: string) => void
}

export function UserFormDialog({ open, mode, user, isSubmitting, onClose, onSubmit, onValidationError }: UserFormDialogProps) {
    const [formValues, setFormValues] = useState<UserFormValues>({
        email: "",
        nomeExibicao: "",
        status: "ATIVO",
    })

    useEffect(() => {
        if (!open) {
            return
        }

        if (mode === "edit" && user) {
            setFormValues({
                email: user.email,
                nomeExibicao: user.nomeExibicao ?? "",
                status: user.status,
            })
            return
        }

        setFormValues({ email: "", nomeExibicao: "", status: "ATIVO" })
    }, [mode, user, open])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isSubmitting) {
            return
        }

        const email = formValues.email.trim()
        const nome = formValues.nomeExibicao.trim()

        if (mode === "create") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailPattern.test(email)) {
                onValidationError?.("Informe um e-mail válido.")
                return
            }
        }

        if (nome.length === 0) {
            onValidationError?.("Informe um nome de exibição.")
            return
        }

        await onSubmit({
            email,
            nomeExibicao: nome,
            status: formValues.status,
        })
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {mode === "create" ? "Novo Usuário" : "Editar Usuário"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Informe os dados para cadastrar um novo usuário."
                            : "Atualize as informações do usuário selecionado."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    {mode === "create" && (
                        <div className="space-y-2">
                            <Label htmlFor="user-email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="user-email"
                                value={formValues.email}
                                onChange={(event) =>
                                    setFormValues((prev) => ({ ...prev, email: event.target.value }))
                                }
                                className="h-10 border-muted/50"
                                type="email"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="user-nome" className="text-sm font-medium">
                            Nome de Exibição
                        </Label>
                        <Input
                            id="user-nome"
                            value={formValues.nomeExibicao}
                            onChange={(event) =>
                                setFormValues((prev) => ({ ...prev, nomeExibicao: event.target.value }))
                            }
                            className="h-10 border-muted/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="user-status" className="text-sm font-medium">
                            Status
                        </Label>
                        <Select
                            value={formValues.status}
                            onValueChange={(value) =>
                                setFormValues((prev) => ({ ...prev, status: value as UsuarioDTO["status"] }))
                            }
                        >
                            <SelectTrigger id="user-status" className="h-10 border-muted/50 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status} className="cursor-pointer">
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary cursor-pointer">
                            {isSubmitting ? "Salvando..." : mode === "create" ? "Adicionar" : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
