"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Pencil, Trash2, Lock } from "lucide-react"
import { toast } from "sonner"

interface Permission {
    id: string
    chave: string
    descricao: string | null
    categoria: string | null
    rolesCount: number
}

const mockPermissions: Permission[] = [
    {
        id: "1",
        chave: "usuarios.criar",
        descricao: "Criar novos usuários",
        categoria: "Usuários",
        rolesCount: 1,
    },
    {
        id: "2",
        chave: "usuarios.editar",
        descricao: "Editar usuários existentes",
        categoria: "Usuários",
        rolesCount: 2,
    },
    {
        id: "3",
        chave: "agendamentos.criar",
        descricao: "Criar agendamentos",
        categoria: "Agendamentos",
        rolesCount: 3,
    },
    {
        id: "4",
        chave: "financeiro.visualizar",
        descricao: "Visualizar dados financeiros",
        categoria: "Financeiro",
        rolesCount: 2,
    },
]

export function PermissionsManagement() {
    const [permissions, setPermissions] = useState<Permission[]>(mockPermissions)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const filteredPermissions = permissions.filter(
        (permission) =>
            permission.chave.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.categoria?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getCategoryColor = (categoria: string | null) => {
        if (!categoria) return "bg-gray-500/10 text-gray-700 dark:text-gray-400"

        const colors: Record<string, string> = {
            Usuários: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
            Agendamentos: "bg-green-500/10 text-green-700 dark:text-green-400",
            Financeiro: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
            Pacientes: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
        }

        return colors[categoria] || "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }

    const handleEdit = (permission: Permission) => {
        setEditingPermission(permission)
        setIsCreating(false)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingPermission({
            id: "",
            chave: "",
            descricao: "",
            categoria: "",
            rolesCount: 0,
        })
        setIsCreating(true)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingPermission) {
            if (isCreating) {
                setPermissions([...permissions, { ...editingPermission, id: String(Date.now()) }])
                toast.success("Permissão criada com sucesso!")
            } else {
                setPermissions(permissions.map((p) => (p.id === editingPermission.id ? editingPermission : p)))
                toast.success("Permissão atualizada com sucesso!")
            }
            setIsDialogOpen(false)
            setEditingPermission(null)
        }
    }

    const handleDelete = (id: string) => {
        setPermissions(permissions.filter((p) => p.id !== id))
        toast.success("Permissão removida com sucesso!")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar permissões..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-muted/50 focus-visible:ring-lime-500/20"
                    />
                </div>
                <Button onClick={handleCreate} className="gap-2 bg-lime-500 hover:bg-lime-600 shadow-sm cursor-pointer h-10">
                    <Plus className="h-4 w-4" />
                    Nova Permissão
                </Button>
            </div>

            <div className="rounded-xl border border-muted/50 overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-muted/50">
                            <TableHead className="font-semibold text-foreground h-12">Chave</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Descrição</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Categoria</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Roles</TableHead>
                            <TableHead className="text-right font-semibold text-foreground h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPermissions.map((permission) => (
                            <TableRow key={permission.id} className="border-b border-muted/30 hover:bg-muted/20 transition-colors">
                                <TableCell className="font-mono text-sm font-medium py-4">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-lime-500" />
                                        {permission.chave}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground py-4">{permission.descricao || "-"}</TableCell>
                                <TableCell className="py-4">
                                    {permission.categoria ? (
                                        <Badge variant="secondary" className={getCategoryColor(permission.categoria)}>
                                            {permission.categoria}
                                        </Badge>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className="font-medium border-muted">
                                        {permission.rolesCount} roles
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(permission)}
                                            className="h-8 w-8 cursor-pointer hover:bg-muted/50 hover:text-foreground"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(permission.id)}
                                            className="h-8 w-8 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{isCreating ? "Nova Permissão" : "Editar Permissão"}</DialogTitle>
                        <DialogDescription>
                            {isCreating ? "Crie uma nova permissão no sistema" : "Atualize as informações da permissão"}
                        </DialogDescription>
                    </DialogHeader>
                    {editingPermission && (
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="chave" className="text-sm font-medium">
                                    Chave
                                </Label>
                                <Input
                                    id="chave"
                                    value={editingPermission.chave}
                                    onChange={(e) => setEditingPermission({ ...editingPermission, chave: e.target.value })}
                                    placeholder="Ex: usuarios.criar"
                                    className="h-10 border-muted/50 font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descricao" className="text-sm font-medium">
                                    Descrição
                                </Label>
                                <Input
                                    id="descricao"
                                    value={editingPermission.descricao || ""}
                                    onChange={(e) => setEditingPermission({ ...editingPermission, descricao: e.target.value })}
                                    placeholder="Descreva o que esta permissão permite"
                                    className="h-10 border-muted/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="categoria" className="text-sm font-medium">
                                    Categoria
                                </Label>
                                <Input
                                    id="categoria"
                                    value={editingPermission.categoria || ""}
                                    onChange={(e) => setEditingPermission({ ...editingPermission, categoria: e.target.value })}
                                    placeholder="Ex: Usuários, Agendamentos, Financeiro"
                                    className="h-10 border-muted/50"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} className="bg-lime-500 hover:bg-lime-600 cursor-pointer">
                            {isCreating ? "Criar" : "Salvar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
