"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { medicalFormSchema, type MedicalFormData } from "@/lib/validation"
import { useAutoSave } from "@/lib/auto-save"
import { FormSection } from "@/components/form-section"
import { StepNavigation } from "@/components/step-navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  User,
  Calendar,
  Stethoscope,
  FileText,
  Download,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { PDFDocument } from "@/components/pdf-document"
import { pdf } from "@react-pdf/renderer"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    id: 1,
    title: "Личные данные",
    description: "Основная информация",
    icon: User,
  },
  {
    id: 2,
    title: "Обращение в клинику",
    description: "Жалобы и симптомы",
    icon: Calendar,
  },
  {
    id: 3,
    title: "Анамнез жизни",
    description: "История жизни",
    icon: FileText,
  },
  {
    id: 4,
    title: "Объективное обследование",
    description: "Заполняет врач",
    icon: Stethoscope,
  },
]

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<MedicalFormData>({
    resolver: zodResolver(medicalFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      passport: "",
      birthDate: "",
      gender: undefined,
      maritalStatus: "",
      education: "",
      job: "",
      address: "",
      admissionDate: "",
      referralDiagnosis: "",
      mainComplaints: "",
      mainComplaintsDetail: "",
      generalComplaints: "",
      additionalComplaints: "",
      firstSymptomsDate: "",
      firstSymptoms: "",
      triggers: "",
      symptomsDynamic: "",
      previousDiagnosis: "",
      currentState: "",
      badHabits: "",
      familyHistory: "",
      allergies: "",
      pastDiseases: "",
      generalExamination: "",
      headNeck: "",
      skin: "",
      respiratory: "",
      cardiovascular: "",
      abdomen: "",
      musculoskeletal: "",
      lymphNodes: "",
      abdomenPalpation: "",
      percussion: "",
      lungAuscultation: "",
      heartAuscultation: "",
      abdomenAuscultation: "",
    },
  })

  const { saveNow } = useAutoSave(form)

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof MedicalFormData)[] = []

    switch (step) {
      case 1:
        // Первый шаг - все поля обязательны
        fieldsToValidate = [
          "fullName",
          "passport",
          "birthDate",
          "gender",
          "maritalStatus",
          "education",
          "job",
          "address",
        ]
        const result = await form.trigger(fieldsToValidate)
        if (!result) {
          // Прокрутить к первой ошибке
          const firstError = Object.keys(form.formState.errors)[0]
          if (firstError) {
            const element = document.querySelector(`[name="${firstError}"]`)
            element?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }
        return result
      case 2:
      case 3:
      case 4:
        // Эти шаги опциональны, можно пропустить
        return true
      default:
        return true
    }
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleStepClick = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Если переходим на следующий шаг, нужно валидировать текущий
    if (step > currentStep) {
      const isValid = await validateStep(currentStep)
      if (isValid) {
        setCurrentStep(step)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  const onSubmit = async (data: MedicalFormData) => {
    const isValid = await validateStep(currentStep)
    if (!isValid) {
      return
    }

    console.log("Form submitted:", data)
    alert("Анкета успешно отправлена!")
  }

  const handleSave = () => {
    saveNow()
    alert("Анкета сохранена!")
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const data = form.getValues()
      const doc = <PDFDocument data={data} />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `медицинская_анкета_${data.fullName || "пациент"}_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Ошибка при создании PDF файла")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalData form={form} />
      case 2:
        return <Step2ClinicVisit form={form} />
      case 3:
        return <Step3LifeHistory form={form} />
      case 4:
        return <Step4Examination form={form} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/40">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Header */}
        <header className="mb-6 md:mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 mb-4 shadow-xl shadow-blue-500/30 transition-transform hover:scale-105">
            <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Медицинская анкета пациента
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Заполните анкету последовательно, шаг за шагом
          </p>
        </header>

        {/* Step Navigation */}
        <div className="mb-8">
          <StepNavigation
            steps={STEPS.map((step) => ({
              id: step.id,
              title: step.title,
              description: step.description,
              icon: <step.icon className="w-4 h-4" />,
            }))}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Step Content */}
            <div className="min-h-[500px] animate-fade-in">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl rounded-t-2xl p-4 md:p-6 mt-8 -mx-4 md:mx-0 md:rounded-xl">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex-1 sm:flex-none min-w-[120px] transition-all duration-200 hover:shadow-md"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                  {currentStep < STEPS.length && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 sm:flex-none min-w-[120px] bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Далее
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingPDF ? "Создание..." : "PDF"}
                  </Button>
                  {currentStep === STEPS.length && (
                    <Button
                      type="submit"
                      className="flex-1 sm:flex-none min-w-[140px] bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Отправить
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

// Step 1: Личные данные
function Step1PersonalData({
  form,
}: {
  form: ReturnType<typeof useForm<MedicalFormData>>
}) {
  return (
    <FormSection title="Личные данные" icon={User}>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              Ф.И.О <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                title="Введите полное имя, отчество и фамилию пациента"
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="passport"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              Серия и номер паспорта <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                title="Введите серию и номер паспорта (например: AA1234567)"
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Дата рождения <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Пол <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Мужской" id="male" />
                    <label
                      htmlFor="male"
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      Мужской
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Женский" id="female" />
                    <label
                      htmlFor="female"
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      Женский
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="maritalStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Семейное положение</b> <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                title="Указать семейный статус и кратко — кто в семье (если важно). Пример: «Женат, двое детей»."
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Указать семейный статус и кратко — кто в семье (если важно). Пример: «Женат, двое детей».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Образование</b> <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                title="Указать максимальный уровень образования и профиль. Пример: «Высшее медицинское (интернатура по хирургии)»."
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Указать максимальный уровень образования и профиль. Пример: «Высшее медицинское (интернатура по хирургии)».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="job"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Место работы, специальность, должность</b>{" "}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Название учреждения/организации и должность; указать условия труда при наличии риска. Пример: «Городская поликлиника №3, медсестра, контакт с хим. веществами»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Название учреждения/организации и должность; указать условия труда при наличии риска. Пример: «Городская поликлиника №3, медсестра, контакт с хим. веществами».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Домашний адрес</b> <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Полный адрес проживания, контактный телефон. Пример: «г. Ургенч, ул. Ленина, 12, кв. 5; тел. +998...»."
                rows={2}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Полный адрес проживания, контактный телефон. Пример: «г. Ургенч, ул. Ленина, 12, кв. 5; тел. +998...».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  )
}

// Step 2: Обращение в клинику
function Step2ClinicVisit({
  form,
}: {
  form: ReturnType<typeof useForm<MedicalFormData>>
}) {
  return (
    <FormSection title="Обращение в клинику" icon={Calendar}>
      <FormField
        control={form.control}
        name="admissionDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Дата поступления в клинику</b> (необязательно)
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                title="Записать дату обращения/госпитализации. Пример: «02.11.2025»."
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Записать дату обращения/госпитализации. Пример: «02.11.2025».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="referralDiagnosis"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Диагноз направившего учреждения</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Кратко указать предварительный диагноз, поставленный направившей организацией. Пример: «Подозрение на пневмонию, направлен терапевтом»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Кратко указать предварительный диагноз, поставленный направившей организацией. Пример: «Подозрение на пневмонию, направлен терапевтом».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mainComplaints"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Основные жалобы</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Перечислить 1–3 ключевые жалобы в порядке важности. Пример: «Одышка при нагрузке; кашель с мокротой; температура»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Перечислить 1–3 ключевые жалобы в порядке важности. Пример: «Одышка при нагрузке; кашель с мокротой; температура».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mainComplaintsDetail"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Детализация основных жалоб</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Для каждой основной жалобы дать подробности — начало, характер, локализация, интенсивность, длительность, связь с факторами, облегчение/усиление. Пример: «Кашель: влажный, умеренно-редкий, начался 5 дней назад, мокрота желтоватая, усиливается при физической нагрузке»."
                rows={6}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Для каждой основной жалобы дать подробности — начало, характер, локализация, интенсивность, длительность, связь с факторами, облегчение/усиление. Пример: «Кашель: влажный, умеренно-редкий, начался 5 дней назад, мокрота желтоватая, усиливается при физической нагрузке».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="generalComplaints"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Общие жалобы и их детализация</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Перечислить неспецифические симптомы (слабость, потеря веса, потливость), с указанием времени и динамики. Пример: «Слабость, снижение аппетита 2 недели»."
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Перечислить неспецифические симптомы (слабость, потеря веса, потливость), с указанием времени и динамики. Пример: «Слабость, снижение аппетита 2 недели».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalComplaints"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Жалобы с уточнениями</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Записать дополнительные пояснения от пациента (аллергии, связь с приемом препаратов). Пример: «Появление сыпи после приема амоксициллина»."
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Записать дополнительные пояснения от пациента (аллергии, связь с приемом препаратов). Пример: «Появление сыпи после приема амоксициллина».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="firstSymptomsDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Когда впервые появились жалобы</b>
            </FormLabel>
            <FormControl>
              <Input
                title="Точная дата или ориентировочный срок и обстоятельства начала. Пример: «Началось остро 29.10.2025 после переохлаждения»."
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Точная дата или ориентировочный срок и обстоятельства начала. Пример: «Началось остро 29.10.2025 после переохлаждения».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="firstSymptoms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Какие жалобы появились первыми</b>
            </FormLabel>
            <FormControl>
              <Input
                title="Указать ведущий симптом при начале. Пример: «Першение в горле, затем подскочила температура»."
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Указать ведущий симптом при начале. Пример: «Першение в горле, затем подскочила температура».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="triggers"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Что способствовало появлению симптомов</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Возможные пусковые факторы (инфекции, травмы, лекарства, нагрузка). Пример: «Контакт с больным в семье; переохлаждение»."
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Возможные пусковые факторы (инфекции, травмы, лекарства, нагрузка). Пример: «Контакт с больным в семье; переохлаждение».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="symptomsDynamic"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Динамика симптомов</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Как менялись симптомы с момента начала: прогресс/ремиссия, появление новых признаков. Пример: «Температура сначала 37.8, на 3-й день — до 39.0; кашель усилился»."
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Как менялись симптомы с момента начала: прогресс/ремиссия, появление новых признаков. Пример: «Температура сначала 37.8, на 3-й день — до 39.0; кашель усилился».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="previousDiagnosis"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Диагнозы, предыдущие обследования и лечение</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Перечислить поставленные диагнозы, госпитализации, выполненные исследования и проведённое лечение с реакцией. Пример: «Ранее обследование: рентген грудной клетки — инфильтрат НЕ выявлен; амбулаторно принимал амоксициллин — без эффекта»."
                rows={6}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Перечислить поставленные диагнозы, госпитализации, выполненные исследования и проведённое лечение с реакцией. Пример: «Ранее обследование: рентген грудной клетки — инфильтрат НЕ выявлен; амбулаторно принимал амоксициллин — без эффекта».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentState"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Клинические проявления в момент обращения</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Кратко описать текущее состояние и симптомы. Пример: «Лихорадка 38.5, одышка при ходьбе, сатурация 94%»."
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Кратко описать текущее состояние и симптомы. Пример: «Лихорадка 38.5, одышка при ходьбе, сатурация 94%».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  )
}

// Step 3: Анамнез жизни
function Step3LifeHistory({
  form,
}: {
  form: ReturnType<typeof useForm<MedicalFormData>>
}) {
  return (
    <FormSection title="Анамнез жизни" icon={FileText}>
      <FormField
        control={form.control}
        name="badHabits"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Хронические интоксикации (вредные привычки)</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Курение, алкоголь, наркотики — длительность и количество. Пример: «Курит 5 лет, 5–10 сигар/день»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Курение, алкоголь, наркотики — длительность и количество. Пример: «Курит 5 лет, 5–10 сигар/день».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="familyHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Наследственный анамнез</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Болезни ближайших родственников (сердце, диабет, онкология). Пример: «Мать — СД2; отец — ишемическая болезнь сердца»."
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Болезни ближайших родственников (сердце, диабет, онкология). Пример: «Мать — СД2; отец — ишемическая болезнь сердца».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Аллергологический анамнез</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Лекарственные и пищевые аллергии, анафилаксии. Пример: «Аллергия на пенициллин — сыпь»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Лекарственные и пищевые аллергии, анафилаксии. Пример: «Аллергия на пенициллин — сыпь».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pastDiseases"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Перенесённые заболевания / операции / прививки</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Значимые заболевания в прошлом, операции, вакцинации. Пример: «Перенес пневмонию в 2019, аппендэктомия в 2015. Привит от COVID-19 (2 дозы)»."
                rows={6}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Значимые заболевания в прошлом, операции, вакцинации. Пример: «Перенес пневмонию в 2019, аппендэктомия в 2015. Привит от COVID-19 (2 дозы)».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  )
}

// Step 4: Объективное обследование
function Step4Examination({
  form,
}: {
  form: ReturnType<typeof useForm<MedicalFormData>>
}) {
  return (
    <FormSection
      title="Объективное обследование (заполняется врачом)"
      icon={Stethoscope}
    >
      <FormField
        control={form.control}
        name="generalExamination"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Общий осмотр</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Записать сознание (ясное/заторможенное), положение, телосложение, походку, цвет кожи, видимые отёки, температуру, ЧСС, АД, SpO₂. Пример: «Сознание ясное, телосложение нормостеническое, t=38.3°C, Пульс 96/мин, АД 125/80 ммHg, SpO₂ 95%»."
                rows={5}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Записать сознание (ясное/заторможенное), положение, телосложение, походку, цвет кожи, видимые отёки, температуру, ЧСС, АД, SpO₂. Пример: «Сознание ясное, телосложение нормостеническое, t=38.3°C, Пульс 96/мин, АД 125/80 ммHg, SpO₂ 95%».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="headNeck"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Осмотр по областям. Голова и шея (лицо, рот, шея, щитовидка)</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Обратить внимание на асимметрию, желтушность, ангину, увеличение щитовидки, венозный рисунок. Пример: «Щитовидка не увеличена; небные миндалины без налётов»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Обратить внимание на асимметрию, желтушность, ангину, увеличение щитовидки, венозный рисунок. Пример: «Щитовидка не увеличена; небные миндалины без налётов».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="skin"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Осмотр по областям. Кожа и подкожная клетчатка</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Цвет, высыпания, язвы, язвочки, трофические изменения, тургор, отёки (локальные/генерализованные). Пример: «Кожные покровы бледные, отёков нет»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Цвет, высыпания, язвы, язвочки, трофические изменения, тургор, отёки (локальные/генерализованные). Пример: «Кожные покровы бледные, отёков нет».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="respiratory"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Осмотр по областям. Органы дыхания (осмотр грудной клетки)</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Форма грудной клетки, участие вспомогательной мускулатуры, симметрия дыхательных движений. Пример: «Грудная клетка без деформаций, дыхание равномерно двухстороннее»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Форма грудной клетки, участие вспомогательной мускулатуры, симметрия дыхательных движений. Пример: «Грудная клетка без деформаций, дыхание равномерно двухстороннее».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cardiovascular"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Осмотр по областям. Сердечно-сосудистая система (осмотр)</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Осмотр сердечно-сосудистой системы"
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="abdomen"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Осмотр по областям. ЖКТ (живот — осмотр)</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Форма живота, рубцы, видимые перистальтические волны, высыпания. Пример: «Живот ровный, без видимых вздутий»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Форма живота, рубцы, видимые перистальтические волны, высыпания. Пример: «Живот ровный, без видимых вздутий».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="musculoskeletal"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Осмотр по областям. Опорно-двигательная система</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Осмотреть конечности на деформации, контрактуры, язвы. Пример: «Деформаций суставов нет»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Осмотреть конечности на деформации, контрактуры, язвы. Пример: «Деформаций суставов нет».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lymphNodes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Пальпация лимфоузлов</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Указать расположение увеличенных ЛУ, размер, консистенцию, подвижность, болезненность. Пример: «Шейные лимфоузлы 1.5 см, эластичные, слегка болезненны»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Указать расположение увеличенных ЛУ, размер, консистенцию, подвижность, болезненность. Пример: «Шейные лимфоузлы 1.5 см, эластичные, слегка болезненны».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="abdomenPalpation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Пальпация живота</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Поверхностная и глубокая пальпация, болезненность, напряжение мышц, определения размеров печени/селезёнки. Пример: «Печень +2 см от края правой реберной дуги, болезненна»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Поверхностная и глубокая пальпация, болезненность, напряжение мышц, определения размеров печени/селезёнки. Пример: «Печень +2 см от края правой реберной дуги, болезненна».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="percussion"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Перкуссия. Границы и звуковые изменения</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Отметить границы сердца, печени, выявить притупление/тимпанит. Пример: «Тупой перкуторный звук над правой нижней долей легкого»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Отметить границы сердца, печени, выявить притупление/тимпанит. Пример: «Тупой перкуторный звук над правой нижней долей легкого».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lungAuscultation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Аускультация. Лёгкие</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Записать тип дыхания, наличие и тип хрипов, их локализацию, изменение при кашле. Пример: «Влажные мелкопузырчатые хрипы в правой нижней доле»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Записать тип дыхания, наличие и тип хрипов, их локализацию, изменение при кашле. Пример: «Влажные мелкопузырчатые хрипы в правой нижней доле».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="heartAuscultation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Аускультация. Сердце</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Тоны (жёсткие/громкие), наличие шумов (систолический/диастолический), их выслушивание. Пример: «Тоны сердца слуховые, S1, S2 не изменены, систолического шума нет»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Тоны (жёсткие/громкие), наличие шумов (систолический/диастолический), их выслушивание. Пример: «Тоны сердца слуховые, S1, S2 не изменены, систолического шума нет».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="abdomenAuscultation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>Аускультация. Живот (кишка)</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title="Перистальтика (усиленная/ослабленная/отсутствует). Пример: «Перистальтика выслушивается, умеренная»."
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              Перистальтика (усиленная/ослабленная/отсутствует). Пример: «Перистальтика выслушивается, умеренная».
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  )
}
