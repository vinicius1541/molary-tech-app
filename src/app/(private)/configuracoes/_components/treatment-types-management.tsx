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
import { Search, Plus, Pencil, Trash2, Stethoscope } from "lucide-react"
import { toast } from "sonner"

interface TipoTratamento {
    id: string
    nome: string
    descricao: string | null
    cor: string
    ativo: boolean
}

const mockTreatmentTypes: TipoTratamento[] = [
    {
        id: "1",
        nome: "Ortodontia",
        descricao: "Tratamentos ortodônticos e aparelhos",
        cor: "#3b82f6",
        ativo: true,
    },
    {
        id: "2",
        nome: "Implantes",
        descricao: "Implantes dentários",
        cor: "#10b981",
        ativo: true,
    },
    {
        id: "3",
        nome: "Canal",
        descricao: "Tratamento de canal",
        cor: "#f59e0b",
        ativo: true,
    },
    {
        id: "4",
        nome: "Limpeza",
        descricao: "Limpeza e profilaxia",
        cor: "#06b6d4",
        ativo: true,
    },
    {
        id: "5",
        nome: "Extração",
        descricao: "Extração dentária",
        cor: "#ef4444",
        ativo: false,
    },
]

export function TreatmentTypesManagement() {
    const [treatmentTypes, setTreatmentTypes] = useState<TipoTratamento[]>(mockTreatmentTypes)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingType, setEditingType] = useState<TipoTratamento | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const filteredTypes = treatmentTypes.filter(
        (type) =>
            type.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            type.descricao?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleEdit = (type: TipoTratamento) => {
        setEditingType(type)
        setIsCreating(false)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingType({
            id: "",
            nome: "",
            descricao: "",
            cor: "#3b82f6",
            ativo: true,
        })
        setIsCreating(true)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingType) {
            if (isCreating) {
                setTreatmentTypes([...treatmentTypes, { ...editingType, id: String(Date.now()) }])
                toast.success("Tipo de tratamento criado com sucesso!")
            } else {
                setTreatmentTypes(treatmentTypes.map((t) => (t.id === editingType.id ? editingType : t)))
                toast.success("Tipo de tratamento atualizado com sucesso!")
            }
            setIsDialogOpen(false)
            setEditingType(null)
        }
    }

    const handleDelete = (id: string) => {
        setTreatmentTypes(treatmentTypes.filter((t) => t.id !== id))
        toast.success("Tipo de tratamento removido com sucesso!")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar tipos de tratamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-muted/50 focus-visible:ring-lime-500/20"
                    />
                </div>
                <Button onClick={handleCreate} className="gap-2 bg-lime-500 hover:bg-lime-600 shadow-sm cursor-pointer h-10">
                    <Plus className="h-4 w-4" />
                    Novo Tipo
                </Button>
            </div>

            <div className="rounded-xl border border-muted/50 overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-muted/50">
                            <TableHead className="font-semibold text-foreground h-12">Nome</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Descrição</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Cor</TableHead>
                            <TableHead className="font-semibold text-foreground h-12">Status</TableHead>
                            <TableHead className="text-right font-semibold text-foreground h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTypes.map((type) => (
                            <TableRow key={type.id} className="border-b border-muted/30 hover:bg-muted/20 transition-colors">
                                <TableCell className="font-medium py-4">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="h-4 w-4" style={{ color: type.cor }} />
                                        {type.nome}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground py-4">{type.descricao || "-"}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-md border shadow-sm" style={{ backgroundColor: type.cor }} />
                                        <span className="font-mono text-xs text-muted-foreground">{type.cor}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant={type.ativo ? "default" : "secondary"} className={type.ativo ? "bg-green-500" : ""}>
                                        {type.ativo ? "Ativo" : "Inativo"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(type)}
                                            className="h-8 w-8 cursor-pointer hover:bg-muted/50 hover:text-foreground"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(type.id)}
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
                        <DialogTitle className="text-xl">
                            {isCreating ? "Novo Tipo de Tratamento" : "Editar Tipo de Tratamento"}
                        </DialogTitle>
                        <DialogDescription>
                            {isCreating ? "Crie um novo tipo de tratamento" : "Atualize as informações do tipo de tratamento"}
                        </DialogDescription>
                    </DialogHeader>
                    {editingType && (
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="text-sm font-medium">
                                    Nome
                                </Label>
                                <Input
                                    id="nome"
                                    value={editingType.nome}
                                    onChange={(e) => setEditingType({ ...editingType, nome: e.target.value })}
                                    placeholder="Ex: Ortodontia"
                                    className="h-10 border-muted/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descricao" className="text-sm font-medium">
                                    Descrição
                                </Label>
                                <Textarea
                                    id="descricao"
                                    value={editingType.descricao || ""}
                                    onChange={(e) => setEditingType({ ...editingType, descricao: e.target.value })}
                                    placeholder="Descreva o tipo de tratamento"
                                    className="border-muted/50 min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cor" className="text-sm font-medium">
                                    Cor
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="cor"
                                        type="color"
                                        value={editingType.cor}
                                        onChange={(e) => setEditingType({ ...editingType, cor: e.target.value })}
                                        className="h-10 w-20 cursor-pointer"
                                    />
                                    <Input
                                        value={editingType.cor}
                                        onChange={(e) => setEditingType({ ...editingType, cor: e.target.value })}
                                        placeholder="#3b82f6"
                                        className="flex-1 font-mono h-10 border-muted/50"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-muted/50 p-4">
                                <Label htmlFor="ativo" className="text-sm font-medium cursor-pointer">
                                    Ativo
                                </Label>
                                <Switch
                                    id="ativo"
                                    checked={editingType.ativo}
                                    onCheckedChange={(checked) => setEditingType({ ...editingType, ativo: checked })}
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
