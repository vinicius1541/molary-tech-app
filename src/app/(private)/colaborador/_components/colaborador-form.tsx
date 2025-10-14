"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Check, ChevronLeft, ChevronRight} from "lucide-react"
import {createOrUpdateColaborador} from "@/server/colaborador/actions";
import {colaborador} from "@/generated/prisma";
import {useRouter} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {Cargo} from "@/server/cargo/actions";

type FormData = {
    email: string
    telefone: string | null
    external_user_id: string | null
    nome: string
    cargo_id: string
    numero_cro: string
    endereco: string
}

// const CARGO_OPTIONS = [
//     "Dentista",
//     "Ortodontista",
//     "Endodontista",
//     "Periodontista",
//     "Implantodontista",
//     "Cirurgião Bucomaxilofacial",
//     "Auxiliar de Saúde Bucal",
//     "Técnico em Saúde Bucal",
//     "Recepcionista",
//     "Gerente de Clínica",
// ]

const STEPS = [
    { id: 1, title: "Informações Pessoais", description: "Dados básicos do colaborador" },
    { id: 2, title: "Cargo/Permissão", description: "Defina o cargo do colaborador" },
    { id: 3, title: "Número CRO", description: "Registro profissional (Conselhor Regional de Odontologia)" },
    { id: 4, title: "Revisão", description: "Confirme se os dados estão corretos" },
]

type ValidationErrors = {
    email?: string
    telefone?: string
}

type ColaboradorFormProps = {
    CARGO_OPTIONS: Cargo[]
}

export function ColaboradorForm({CARGO_OPTIONS}: ColaboradorFormProps) {
    const {user} = useUser()
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [formData, setFormData] = useState<FormData>({
        external_user_id: null,
        nome: "",
        cargo_id: "",
        numero_cro: "",
        telefone: "",
        email: "",
        endereco: ""
    })

    const formatPhoneBrazil = (value: string) => {
        const numbers = value.replace(/\D/g, "")
        if (numbers.length <= 10) {
            // Formato: (XX) XXXX-XXXX
            return numbers.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
        } else {
            // Formato: (XX) XXXXX-XXXX
            return numbers
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .slice(0, 15)
        }
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const updateFormData = (field: keyof colaborador, value: any) => {
        if (field === "telefone") {
            value = formatPhoneBrazil(value)
        }
        if (field === "numero_cro") {
            value = value ? BigInt(value) : null
        }
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field as keyof ValidationErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.cargo_id !== null
            case 2:
                const isNameValid = formData.nome.trim() !== ""
                const isEmailValid = formData.email.trim() !== "" && validateEmail(formData.email)
                return isNameValid && isEmailValid
            case 3:
                return formData.numero_cro !== null
            default:
                return true
        }
    }

    const handleNext = () => {
        if (currentStep === 2) {
            const newErrors: ValidationErrors = {}

            if (!validateEmail(formData.email)) {
                newErrors.email = "Email inválido"
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors)
                return
            }
        }

        if (canProceed() && currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            if (!user) {
                alert("Usuário não autenticado")
                setIsSubmitting(false)
                return
            }
            // Monta objeto colaborador completo com conversões de tipos
            const colaboradorData: colaborador = {
                id: BigInt(0),
                email: formData.email,
                telefone: formData.telefone,
                external_user_id: user.id,
                nome: formData.nome,
                cargo_id: formData.cargo_id ? BigInt(formData.cargo_id) : null,
                numero_cro: formData.numero_cro ? BigInt(formData.numero_cro) : null,
                endereco: formData.endereco,
                dt_criacao: new Date(),
                dt_atualizacao: null
            }

            const result = await createOrUpdateColaborador(colaboradorData)

            if (result.success) {
                // O metadata do Clerk será definido automaticamente pela server action
                alert("Colaborador cadastrado com sucesso!")
                router.push("/dashboard")
            } else {
                alert(`Erro: ${result.error}`)
            }
        } catch (error) {
            alert("Erro ao cadastrar colaborador")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Stepper */}
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
                                            : ""
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
                                className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep > step.id ? "bg-success" : "bg-border"}`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <Card className="border-border bg-background">
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                    <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1: Cargo */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    placeholder="Digite o nome completo"
                                    value={formData.nome ?? ""}
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
                                    value={formData.email ?? ""}
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
                                    value={formData.telefone ?? ""}
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
                                    value={formData.endereco ?? ""}
                                    onChange={(e) => updateFormData("endereco", e.target.value)}
                                    className="text-base"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Informações Pessoais */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cargo_id">Cargo *</Label>
                                <Select
                                    value={formData.cargo_id}
                                    onValueChange={(value) => updateFormData("cargo_id", value)}
                                >
                                    <SelectTrigger className="text-base">
                                        <SelectValue placeholder="Selecione o cargo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CARGO_OPTIONS.map((cargo) => (
                                            <SelectItem key={cargo.id.toString()} value={cargo.id.toString()}>
                                                {cargo.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                    )}

                    {/* Step 3: Número CRO */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="numero_cro">Número CRO *</Label>
                                <Input
                                    id="numero_cro"
                                    type="number"
                                    placeholder="Digite o número do CRO"
                                    value={formData.numero_cro !== null && formData.numero_cro !== undefined ? formData.numero_cro.toString() : ""}
                                    onChange={(e) => updateFormData("numero_cro", e.target.value)}
                                    className="text-base"
                                />
                                <p className="text-sm text-muted-foreground">Conselho Regional de Odontologia</p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Revisão */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="bg-muted rounded-lg p-4 space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Cargo</p>
                                    <p className="font-medium">{formData.cargo_id ?? ""}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Nome</p>
                                    <p className="font-medium">{formData.nome ?? ""}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{formData.email ?? ""}</p>
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
                                    <p className="font-medium">{formData.numero_cro !== null && formData.numero_cro !== undefined ? formData.numero_cro.toString() : ""}</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">Revise as informações antes de finalizar o cadastro.</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Anterior
                        </Button>

                        {currentStep < STEPS.length ? (
                            <Button type="button" onClick={handleNext} disabled={!canProceed()}>
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
