"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { createOrUpdateColaborador } from "@/server/colaborador/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type FormData = {
    email: string
    telefone: string
    nome: string
    cargoId: string
    numeroCro: string
    endereco: string
}

const STEPS = [
    { id: 1, title: "Dados do Usuário", description: "Confirme ou ajuste seus dados principais" },
    { id: 2, title: "Cargo e Permissões", description: "Defina o papel dentro da clínica" },
    { id: 3, title: "Dados Profissionais", description: "Informações complementares do cargo" },
    { id: 4, title: "Revisão", description: "Confirme se os dados estão corretos" },
]

type ValidationErrors = {
    email?: string
    numeroCro?: string
}

type UsuarioSetupData = {
    nome: string | null
    email: string
}

type ColaboradorFormProps = {
    cargos: Array<{
        id: string
        nome: string
        requerCro: boolean
    }>
    usuario: UsuarioSetupData
}

export function ColaboradorForm({ cargos, usuario }: ColaboradorFormProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [formData, setFormData] = useState<FormData>({
        nome: usuario.nome ?? "",
        cargoId: "",
        numeroCro: "",
        telefone: "",
        email: usuario.email ?? "",
        endereco: "",
    })

    const selectedCargo = useMemo(() => {
        return cargos.find((cargo) => cargo.id === formData.cargoId)
    }, [cargos, formData.cargoId])

    const formatPhoneBrazil = (value: string) => {
        const numbers = value.replace(/\D/g, "")
        if (numbers.length <= 10) {
            return numbers.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
        }
        return numbers
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .slice(0, 15)
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const updateFormData = (field: keyof FormData, value: string) => {
        const nextValue = field === "telefone" ? formatPhoneBrazil(value) : value
        setFormData((prev) => ({ ...prev, [field]: nextValue }))
        if (errors[field as keyof ValidationErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1: {
                const isNameValid = formData.nome.trim() !== ""
                const isEmailValid = formData.email.trim() !== "" && validateEmail(formData.email)
                return isNameValid && isEmailValid
            }
            case 2:
                return formData.cargoId !== ""
            case 3:
                if (!selectedCargo?.requerCro) {
                    return true
                }
                return formData.numeroCro.trim() !== ""
            default:
                return true
        }
    }

    const handleNext = () => {
        if (!canProceed()) {
            if (currentStep === 1 && !validateEmail(formData.email)) {
                setErrors((prev) => ({ ...prev, email: "Email inválido" }))
            }
            if (currentStep === 3 && selectedCargo?.requerCro && formData.numeroCro.trim() === "") {
                setErrors((prev) => ({ ...prev, numeroCro: "Informe o número do CRO" }))
            }
            return
        }

        if (currentStep < STEPS.length) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const result = await createOrUpdateColaborador({
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                telefone: formData.telefone.trim() || null,
                endereco: formData.endereco.trim() || null,
                cargoId: formData.cargoId,
                numeroCro: selectedCargo?.requerCro ? formData.numeroCro.trim() : null,
            })

            if (result.success) {
                toast.success("Colaborador cadastrado com sucesso!")
                router.push("/dashboard")
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Erro ao cadastrar colaborador. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                                    currentStep > step.id
                                        ? "bg-success text-success-foreground"
                                        : currentStep === step.id
                                            ? "bg-primary text-primary-foreground"
                                            : "border border-border"
                                }`}
                            >
                                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                            </div>
                            <div className="mt-2 text-center hidden sm:block">
                                <p
                                    className={`text-sm font-medium ${
                                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                                    }`}
                                >
                                    {step.title}
                                </p>
                            </div>
                        </div>
                        {index < STEPS.length - 1 && (
                            <div
                                className={`h-0.5 flex-1 mx-2 transition-colors ${
                                    currentStep > step.id ? "bg-success" : "bg-border"
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            <Card className="border-border bg-background">
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                    <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    placeholder="Digite o nome completo"
                                    value={formData.nome}
                                    onChange={(e) => updateFormData("nome", e.target.value)}
                                    className="text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    value={formData.email}
                                    onChange={(e) => updateFormData("email", e.target.value)}
                                    className={`text-base ${errors.email ? "border-destructive" : ""}`}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={formData.telefone}
                                    onChange={(e) => updateFormData("telefone", e.target.value)}
                                    className="text-base"
                                    maxLength={15}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    placeholder="Rua, número, bairro, cidade"
                                    value={formData.endereco}
                                    onChange={(e) => updateFormData("endereco", e.target.value)}
                                    className="text-base"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cargo_id">Cargo *</Label>
                                <Select
                                    value={formData.cargoId}
                                    onValueChange={(value) => updateFormData("cargoId", value)}
                                >
                                    <SelectTrigger className="text-base">
                                        <SelectValue placeholder="Selecione o cargo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cargos.map((cargo) => (
                                            <SelectItem key={cargo.id} value={cargo.id}>
                                                {cargo.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedCargo && (
                                    <p className="text-sm text-muted-foreground">
                                        {selectedCargo.requerCro
                                            ? "Este cargo exige registro profissional (CRO)."
                                            : "Cargo administrativo: CRO não obrigatório."}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4">
                            {selectedCargo?.requerCro ? (
                                <div className="space-y-2">
                                    <Label htmlFor="numero_cro">Número CRO *</Label>
                                    <Input
                                        id="numero_cro"
                                        type="text"
                                        placeholder="Digite o número do CRO"
                                        value={formData.numeroCro}
                                        onChange={(e) => updateFormData("numeroCro", e.target.value)}
                                        className={`text-base ${errors.numeroCro ? "border-destructive" : ""}`}
                                    />
                                    {errors.numeroCro && (
                                        <p className="text-sm text-destructive">{errors.numeroCro}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Conselho Regional de Odontologia
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        O cargo selecionado não exige registro no CRO. Você pode avançar para a próxima etapa.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="bg-muted rounded-lg p-4 space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Cargo</p>
                                    <p className="font-medium">{selectedCargo?.nome ?? ""}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Nome</p>
                                    <p className="font-medium">{formData.nome}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{formData.email}</p>
                                </div>
                                {formData.telefone && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Telefone</p>
                                        <p className="font-medium">{formData.telefone}</p>
                                    </div>
                                )}
                                {formData.endereco && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Endereço</p>
                                        <p className="font-medium">{formData.endereco}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Número CRO</p>
                                    <p className="font-medium">
                                        {selectedCargo?.requerCro ? formData.numeroCro || "Não informado" : "Não se aplica"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Revise as informações antes de finalizar o cadastro.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between pt-6">
                        <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Anterior
                        </Button>

                        {currentStep < STEPS.length ? (
                            <Button type="button" onClick={handleNext}>
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
