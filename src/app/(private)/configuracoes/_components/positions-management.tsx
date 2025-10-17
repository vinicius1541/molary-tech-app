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
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Pencil, Trash2, Briefcase } from "lucide-react"
import { toast } from "sonner"

interface Cargo {
    id: string
    nome: string
    descricao: string | null
    nivel: number
    ativo: boolean
    colaboradoresCount: number
}

const mockPositions: Cargo[] = [
    {
        id: "1",
        nome: "Dentista",
        descricao: "Profissional de odontologia",
        nivel: 3,
        ativo: true,
        colaboradoresCount: 5,
    },
    {
        id: "2",
        nome: "Recepcionista",
        descricao: "Atendimento ao público",
        nivel: 1,
        ativo: true,
        colaboradoresCount: 2,
    },
    {
        id: "3",
        nome: "Auxiliar de Dentista",
        descricao: "Auxilia nos procedimentos",
        nivel: 2,
        ativo: true,
        colaboradoresCount: 3,
    },
    {
        id: "4",
        nome: "Gerente",
        descricao: "Gestão da clínica",
        nivel: 4,
        ativo: true,
        colaboradoresCount: 1,
    },
]

export function PositionsManagement() {
    const [positions, setPositions] = useState<Cargo[]>(mockPositions)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingPosition, setEditingPosition] = useState<Cargo | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const filteredPositions = positions.filter(
        (position) =>
            position.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            position.descricao?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleEdit = (position: Cargo) => {
        setEditingPosition(position)
        setIsCreating(false)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingPosition({
            id: "",
            nome: "",
            descricao: "",
            nivel: 1,
            ativo: true,
            colaboradoresCount: 0,
        })
        setIsCreating(true)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingPosition) {
            if (isCreating) {
                setPositions([...positions, { ...editingPosition, id: String(Date.now()) }])
                toast.success("Cargo criado com sucesso!")
            } else {
                setPositions(positions.map((p) => (p.id === editingPosition.id ? editingPosition : p)))
                toast.success("Cargo atualizado com sucesso!")
            }
            setIsDialogOpen(false)
            setEditingPosition(null)
        }
    }

    const handleDelete = (id: string) => {
        setPositions(positions.filter((p) => p.id !== id))
        toast.success("Cargo removido com sucesso!")
    }

    const getNivelBadge = (nivel: number) => {
        const colors = [
            "bg-gray-500/10 text-gray-700 dark:text-gray-400",
            "bg-blue-500/10 text-blue-700 dark:text-blue-400",
            "bg-green-500/10 text-green-700 dark:text-green-400",
            "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
            "bg-purple-500/10 text-purple-700 dark:text-purple-400",
        ]
        return colors[nivel] || colors[0]
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar cargos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-muted/50 focus-visible:ring-lime-500/20"
                    />
                </div>
                <Button onClick={handleCreate} className="gap-2 bg-lime-500 hover:bg-lime-600 shadow-sm cursor-pointer h-10">
                    <Plus className="h-4 w-4" />
                    Novo Cargo
                </Button>
            </div>

            <div className="rounded-xl border border-muted/50 overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-muted/50">
                            <TableHead className="font-semibold text-foreground h-12">Nome</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Descrição</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Nível</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Status</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Colaboradores</TableHead>
                            <TableHead className="text-right font-semibold text-foreground h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPositions.map((position) => (
                            <TableRow key={position.id} className="border-b border-muted/30 hover:bg-muted/20 transition-colors">
                                <TableCell className="font-medium py-4">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-lime-500" />
                                        {position.nome}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground py-4">{position.descricao || "-"}</TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="secondary" className={getNivelBadge(position.nivel)}>
                                        Nível {position.nivel}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge
                                        variant={position.ativo ? "default" : "secondary"}
                                        className={position.ativo ? "bg-green-500" : ""}
                                    >
                                        {position.ativo ? "Ativo" : "Inativo"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className="font-medium border-muted">
                                        {position.colaboradoresCount}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(position)}
                                            className="h-8 w-8 cursor-pointer hover:bg-muted/50 hover:text-foreground"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(position.id)}
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
                        <DialogTitle className="text-xl">{isCreating ? "Novo Cargo" : "Editar Cargo"}</DialogTitle>
                        <DialogDescription>
                            {isCreating ? "Crie um novo cargo" : "Atualize as informações do cargo"}
                        </DialogDescription>
                    </DialogHeader>
                    {editingPosition && (
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="text-sm font-medium">
                                    Nome
                                </Label>
                                <Input
                                    id="nome"
                                    value={editingPosition.nome}
                                    onChange={(e) => setEditingPosition({ ...editingPosition, nome: e.target.value })}
                                    placeholder="Ex: Dentista"
                                    className="h-10 border-muted/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descricao" className="text-sm font-medium">
                                    Descrição
                                </Label>
                                <Textarea
                                    id="descricao"
                                    value={editingPosition.descricao || ""}
                                    onChange={(e) => setEditingPosition({ ...editingPosition, descricao: e.target.value })}
                                    placeholder="Descreva as responsabilidades do cargo"
                                    className="border-muted/50 min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nivel" className="text-sm font-medium">
                                    Nível
                                </Label>
                                <Input
                                    id="nivel"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={editingPosition.nivel}
                                    onChange={(e) => setEditingPosition({ ...editingPosition, nivel: Number.parseInt(e.target.value) })}
                                    placeholder="1-10"
                                    className="h-10 border-muted/50"
                                />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-muted/50 p-4">
                                <Label htmlFor="ativo" className="text-sm font-medium cursor-pointer">
                                    Ativo
                                </Label>
                                <Switch
                                    id="ativo"
                                    checked={editingPosition.ativo}
                                    onCheckedChange={(checked) => setEditingPosition({ ...editingPosition, ativo: checked })}
                                    className="cursor-pointer"
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
