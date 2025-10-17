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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Pencil, Trash2, Shield } from "lucide-react"
import { toast } from "sonner"

interface Role {
    id: string
    nome: string
    slug: string
    descricao: string | null
    hierarquia: number
    permissionsCount: number
}

const mockRoles: Role[] = [
    {
        id: "1",
        nome: "Administrador",
        slug: "admin",
        descricao: "Acesso total ao sistema",
        hierarquia: 1,
        permissionsCount: 25,
    },
    {
        id: "2",
        nome: "Dentista",
        slug: "dentista",
        descricao: "Profissional de odontologia",
        hierarquia: 50,
        permissionsCount: 15,
    },
    {
        id: "3",
        nome: "Recepcionista",
        slug: "recepcionista",
        descricao: "Atendimento e agendamentos",
        hierarquia: 100,
        permissionsCount: 8,
    },
]

export function RolesManagement() {
    const [roles, setRoles] = useState<Role[]>(mockRoles)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const filteredRoles = roles.filter(
        (role) =>
            role.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleEdit = (role: Role) => {
        setEditingRole(role)
        setIsCreating(false)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingRole({
            id: "",
            nome: "",
            slug: "",
            descricao: "",
            hierarquia: 100,
            permissionsCount: 0,
        })
        setIsCreating(true)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingRole) {
            if (isCreating) {
                setRoles([...roles, { ...editingRole, id: String(Date.now()) }])
                toast.success("Role criada com sucesso!")
            } else {
                setRoles(roles.map((r) => (r.id === editingRole.id ? editingRole : r)))
                toast.success("Role atualizada com sucesso!")
            }
            setIsDialogOpen(false)
            setEditingRole(null)
        }
    }

    const handleDelete = (id: string) => {
        setRoles(roles.filter((r) => r.id !== id))
        toast.success("Role removida com sucesso!")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-muted/50 focus-visible:ring-lime-500/20"
                    />
                </div>
                <Button onClick={handleCreate} className="gap-2 bg-lime-500 hover:bg-lime-600 shadow-sm cursor-pointer h-10">
                    <Plus className="h-4 w-4" />
                    Nova Role
                </Button>
            </div>

            <div className="rounded-xl border border-muted/50 overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-muted/50">
                            <TableHead className="font-semibold text-foreground h-12">Nome</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Slug</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Descrição</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Hierarquia</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Permissões</TableHead>
                            <TableHead className="text-right font-semibold text-foreground h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRoles.map((role) => (
                            <TableRow key={role.id} className="border-b border-muted/30 hover:bg-muted/20 transition-colors">
                                <TableCell className="font-medium py-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-lime-500" />
                                        {role.nome}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className="font-medium border-muted">
                                        {role.slug}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground py-4">{role.descricao || "-"}</TableCell>
                                <TableCell className="py-4">{role.hierarquia}</TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="secondary" className="font-medium">
                                        {role.permissionsCount}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(role)}
                                            className="h-8 w-8 cursor-pointer hover:bg-muted/50 hover:text-foreground"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(role.id)}
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
                        <DialogTitle className="text-xl">{isCreating ? "Nova Role" : "Editar Role"}</DialogTitle>
                        <DialogDescription>
                            {isCreating ? "Crie uma nova role no sistema" : "Atualize as informações da role"}
                        </DialogDescription>
                    </DialogHeader>
                    {editingRole && (
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="text-sm font-medium">
                                    Nome
                                </Label>
                                <Input
                                    id="nome"
                                    value={editingRole.nome}
                                    onChange={(e) => setEditingRole({ ...editingRole, nome: e.target.value })}
                                    placeholder="Ex: Administrador"
                                    className="h-10 border-muted/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-sm font-medium">
                                    Slug
                                </Label>
                                <Input
                                    id="slug"
                                    value={editingRole.slug}
                                    onChange={(e) => setEditingRole({ ...editingRole, slug: e.target.value })}
                                    placeholder="Ex: admin"
                                    className="h-10 border-muted/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descricao" className="text-sm font-medium">
                                    Descrição
                                </Label>
                                <Textarea
                                    id="descricao"
                                    value={editingRole.descricao || ""}
                                    onChange={(e) => setEditingRole({ ...editingRole, descricao: e.target.value })}
                                    placeholder="Descreva as responsabilidades desta role"
                                    className="border-muted/50 min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hierarquia" className="text-sm font-medium">
                                    Hierarquia
                                </Label>
                                <Input
                                    id="hierarquia"
                                    type="number"
                                    value={editingRole.hierarquia}
                                    onChange={(e) => setEditingRole({ ...editingRole, hierarquia: Number.parseInt(e.target.value) })}
                                    placeholder="1-1000 (menor = maior prioridade)"
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
