"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createUser, deleteUser, updateUser, type UsuarioDTO } from "@/server/usuario/actions"
import { UserFormDialog, type UserFormValues } from "./user-form-dialog"
import { ConfirmDeleteUserDialog } from "./confirm-delete-user-dialog"

export function UsersManagement() {
    const [users, setUsers] = useState<UsuarioDTO[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<UsuarioDTO | null>(null)
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [userPendingDeletion, setUserPendingDeletion] = useState<UsuarioDTO | null>(null)

    useEffect(() => {
        let isActive = true

        const loadUsers = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/users", { cache: "no-store" })
                if (!response.ok) {
                    toast.error("Falha ao buscar usuários")
                }

                const payload: Array<Omit<UsuarioDTO, "ultimoLogin"> & { ultimoLogin: string | null }> =
                    await response.json()

                const normalizedUsers: UsuarioDTO[] = payload.map((user): UsuarioDTO => ({
                    ...user,
                    ultimoLogin: user.ultimoLogin ? new Date(user.ultimoLogin) : null,
                }))

                if (!isActive) {
                    return
                }

                setUsers(normalizedUsers)
                setError(null)
            } catch (fetchError) {
                console.error(fetchError)
                if (isActive) {
                    const message = "Não foi possível carregar os usuários."
                    setError(message)
                    toast.error(message)
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        loadUsers().then(() => {})

        return () => {
            isActive = false
        }
    }, [])

    const filteredUsers = useMemo(
        () =>
            users.filter(
                (user) =>
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.nomeExibicao?.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [users, searchTerm],
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ATIVO":
                return "bg-green-500/10 text-green-700 dark:text-green-400"
            case "INATIVO":
                return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
            case "SUSPENSO":
                return "bg-red-500/10 text-red-700 dark:text-red-400"
            default:
                return "bg-muted/50 text-muted-foreground"
        }
    }

    const normalizeUsuario = (usuario: UsuarioDTO): UsuarioDTO => ({
        ...usuario,
        ultimoLogin: usuario.ultimoLogin ? new Date(usuario.ultimoLogin) : null,
    })

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setSelectedUser(null)
    }

    const openCreateDialog = () => {
        setDialogMode("create")
        setSelectedUser(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (user: UsuarioDTO) => {
        setDialogMode("edit")
        setSelectedUser(user)
        setIsDialogOpen(true)
    }

    const handleDialogSubmit = async (values: UserFormValues) => {
        if (dialogMode === "create" && values.email.trim() === "") {
            toast.error("Informe um e-mail válido.")
            return
        }

        setIsSaving(true)

        try {
            if (dialogMode === "create") {
                const normalizedName = values.nomeExibicao.trim()

                const result = await createUser({
                    email: values.email.trim(),
                    nomeExibicao: normalizedName,
                    status: values.status,
                })

                if (!result.success) {
                    toast.error(result.error)
                    return
                }

                const normalized = normalizeUsuario(result.usuario)
                setUsers((prev) => [normalized, ...prev])
                toast.success("Usuário criado com sucesso!")
                handleDialogClose()
                return
            }

            if (dialogMode === "edit" && selectedUser) {
                const normalizedName = values.nomeExibicao.trim()

                const result = await updateUser({
                    id: selectedUser.id,
                    nomeExibicao: normalizedName,
                    status: values.status,
                })

                if (!result.success) {
                    toast.error(result.error)
                    return
                }

                const normalized = normalizeUsuario(result.usuario)
                setUsers((prev) => prev.map((user) => (user.id === normalized.id ? normalized : user)))
                toast.success("Usuário atualizado com sucesso!")
                handleDialogClose()
            }
        } catch (updateError) {
            console.error("Erro ao salvar usuário:", updateError)
            toast.error("Não foi possível salvar as alterações.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteRequest = (user: UsuarioDTO) => {
        setUserPendingDeletion(user)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false)
        setUserPendingDeletion(null)
    }

    const handleDeleteConfirm = async () => {
        if (!userPendingDeletion) {
            return
        }

        setIsDeleting(true)

        try {
            const result = await deleteUser(userPendingDeletion.id)

            if (!result.success) {
                toast.error(result.error ?? "Não foi possível remover o usuário.")
                return
            }

            setUsers((prev) => prev.filter((user) => user.id !== userPendingDeletion.id))
            toast.success(result.message ?? "Usuário removido com sucesso!")
            handleDeleteCancel()
        } catch (deleteError) {
            console.error("Erro ao remover usuário:", deleteError)
            toast.error("Não foi possível remover o usuário.")
        } finally {
            setIsDeleting(false)
        }
    }

    const renderTableRows = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="py-8">
                        <div className="flex items-center justify-center">
                            <div className="h-32 w-32 animate-spin rounded-full border-8 border-muted border-t-8 border-t-primary ease-linear" />
                        </div>
                    </TableCell>
                </TableRow>
            )
        }

        if (error) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-destructive">
                        {error}
                    </TableCell>
                </TableRow>
            )
        }

        if (filteredUsers.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        Nenhum usuário encontrado.
                    </TableCell>
                </TableRow>
            )
        }

        return filteredUsers.map((user) => (
            <TableRow key={user.id} className="border-b border-muted/30 hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium py-4">{user.email}</TableCell>
                <TableCell className="py-4">{user.nomeExibicao || "-"}</TableCell>
                <TableCell className="py-4">
                    <Badge variant="secondary" className={getStatusColor(user.status)}>
                        {user.status}
                    </Badge>
                </TableCell>
                <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1.5">
                        {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                                <Badge key={role.id} variant="outline" className="text-xs font-medium border-muted">
                                    {role.nome}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground">Sem roles</span>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-muted-foreground py-4">
                    {user.ultimoLogin ? user.ultimoLogin.toLocaleDateString() : "Nunca"}
                </TableCell>
                <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            className="h-8 w-8 cursor-pointer text-warning-foreground hover:bg-warning/50 hover:text-foreground"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRequest(user)}
                            className="h-8 w-8 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por email ou nome..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="pl-9 h-10 border-muted/50 focus-visible:ring-accent"
                    />
                </div>
                <Button className="gap-2 bg-primary shadow-sm cursor-pointer h-10" onClick={openCreateDialog}>
                    <Plus className="h-4 w-4" />
                    Novo Usuário
                </Button>
            </div>

            <div className="rounded-xl border border-muted overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-muted/50">
                            <TableHead className="font-semibold text-foreground h-12">Email</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Nome</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Status</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Roles</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Último Login</TableHead>
                            <TableHead className="text-right font-semibold text-foreground h-12 pr-5">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{renderTableRows()}</TableBody>
                </Table>
            </div>
            <UserFormDialog
                open={isDialogOpen}
                mode={dialogMode}
                user={dialogMode === "edit" ? selectedUser : null}
                isSubmitting={isSaving}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
                onValidationError={(message) => toast.error(message)}
            />
            <ConfirmDeleteUserDialog
                open={isDeleteDialogOpen}
                user={userPendingDeletion}
                isDeleting={isDeleting}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}
