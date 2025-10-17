"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { UsuarioDTO } from "@/server/usuario/actions"

type ConfirmDeleteUserDialogProps = {
    open: boolean
    user: UsuarioDTO | null
    isDeleting: boolean
    onCancel: () => void
    onConfirm: () => void
}

export function ConfirmDeleteUserDialog({ open, user, isDeleting, onCancel, onConfirm }: ConfirmDeleteUserDialogProps) {
    const targetLabel = user?.nomeExibicao?.trim()?.length ? user.nomeExibicao : user?.email ?? "este usuário"

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : undefined)}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Remover usuário</DialogTitle>
                    <DialogDescription>
                        Tem certeza de que deseja remover {targetLabel}? Essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting} className="cursor-pointer">
                        Cancelar
                    </Button>
                    <Button type="button" onClick={onConfirm} disabled={isDeleting} className="bg-destructive text-destructive-foreground cursor-pointer">
                        {isDeleting ? "Removendo..." : "Remover"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
