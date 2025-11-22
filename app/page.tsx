"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type MedicalFormData } from "@/lib/validation"
import { createCustomResolver } from "@/lib/custom-resolver"
import { useAutoSave } from "@/lib/auto-save"
import { FormSection } from "@/components/form-section"
import { StepNavigation } from "@/components/step-navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
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
  TestTube,
  Scan,
} from "lucide-react"
import { TestResultsTable } from "@/components/test-results-table"
import { SerologicalTestTable } from "@/components/serological-test-table"
import { Step6InstrumentalResearch } from "@/components/instrumental-research"
import { PDFDocument } from "@/components/pdf-document"
import { pdf } from "@react-pdf/renderer"
import { useState, useRef, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

export default function HomePage() {
  const { t, language } = useI18n()
  
  const STEPS = useMemo(() => [
    {
      id: 1,
      title: t.steps.step1.title,
      description: t.steps.step1.description,
      icon: User,
    },
    {
      id: 2,
      title: t.steps.step2.title,
      description: t.steps.step2.description,
      icon: Calendar,
    },
    {
      id: 3,
      title: t.steps.step3.title,
      description: t.steps.step3.description,
      icon: FileText,
    },
    {
      id: 4,
      title: t.steps.step4.title,
      description: t.steps.step4.description,
      icon: Stethoscope,
    },
    {
      id: 5,
      title: t.steps.step5.title,
      description: t.steps.step5.description,
      icon: TestTube,
    },
    {
      id: 6,
      title: t.steps.step6.title,
      description: t.steps.step6.description,
      icon: Scan,
    },
  ], [t])
  const [currentStep, setCurrentStep] = useState(1)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const defaultValues = useMemo(() => ({
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
      // Результаты анализов - все поля пустые по умолчанию
      oak_wbc: "",
      oak_rbc: "",
      oak_hgb: "",
      oak_hct: "",
      oak_mcv: "",
      oak_mch: "",
      oak_mchc: "",
      oak_rdw_cv: "",
      oak_rdw_sd: "",
      oak_plt: "",
      oak_pct: "",
      oak_mpv: "",
      oak_pdw: "",
      oam_color: "",
      oam_transparency: "",
      oam_sediment: "",
      oam_ph_reaction: "",
      oam_bilirubin: "",
      oam_urobilinogen: "",
      oam_ketones: "",
      oam_ascorbic_acid: "",
      oam_glucose: "",
      oam_protein: "",
      oam_blood: "",
      oam_ph: "",
      oam_nitrites: "",
      oam_leukocytes_digital: "",
      oam_specific_gravity: "",
      oam_epithelium: "",
      oam_leukocytes_microscopy: "",
      oam_erythrocytes_unchanged: "",
      oam_erythrocytes_changed: "",
      oam_bacteria: "",
      oam_mucus: "",
      bio_bilt: "",
      bio_bild: "",
      bio_ast: "",
      bio_alt: "",
      bio_urea: "",
      bio_crea: "",
      bio_tp: "",
      bio_alb: "",
      bio_alp: "",
      bio_amy: "",
      bio_glue: "",
      bio_ldh: "",
      bio_glob: "",
      bio_alb_glob: "",
      bio_ritis: "",
      imm_cd3: "",
      imm_cd3_hla_dr: "",
      imm_cd4_cd8_minus: "",
      imm_cd4_minus_cd8: "",
      imm_cd4_cd8_ratio: "",
      imm_cd3_minus_cd8: "",
      imm_cd4_minus_cd8_alt: "",
      imm_cd19: "",
      imm_cd16_cd56: "",
      imm_cd3_cd16_cd56: "",
      imm_cd3_cd25: "",
      imm_cd8_hla_dr: "",
      imm_cd19_cd27_igd: "",
      imm_leukocytes: "",
      imm_lymphocytes_percent: "",
      imm_igg: "",
      imm_igm: "",
      imm_iga: "",
      sero_early_igg: "",
      sero_early_igm: "",
      sero_acute_igg: "",
      sero_acute_igm: "",
      sero_immunity_igg: "",
      sero_immunity_igm: "",
      sero_risk_igg: "",
      sero_risk_igm: "",
      pcr_chlamydia: "",
      pcr_ureaplasma: "",
      pcr_mycoplasma_hominis: "",
      pcr_mycoplasma_genitalium: "",
      pcr_herpes: "",
      pcr_cmv: "",
      pcr_gonorrhea: "",
      pcr_trichomonas: "",
      pcr_gardnerella: "",
      pcr_candida: "",
      pcr_hpv_high: "",
      pcr_hpv_low: "",
      pcr_streptococcus: "",
      oak_conclusion: "",
      oam_conclusion: "",
      bio_conclusion: "",
      imm_conclusion: "",
      sero_conclusion: "",
      pcr_conclusion: "",
    }
  ), [])

  const form = useForm<MedicalFormData>({
    resolver: createCustomResolver(language),
    mode: "onChange",
    defaultValues,
  })

  // Update form resolver when language changes
  useEffect(() => {
    // Re-validate with new schema
    form.trigger()
  }, [language, form])

  const { saveNow } = useAutoSave(form)

  // Update resolver when language changes
  useEffect(() => {
    // Re-validate form with new schema when language changes
    form.trigger()
  }, [language, form])

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
      case 5:
        // Эти шаги опциональны, можно пропустить
        return true
      default:
        return true
    }
  }

  const handleNext = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()
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
    // Faqat oxirgi bo'limda submit qilish mumkin
    if (currentStep !== STEPS.length) {
      console.log("Submit blocked: not on last step. Current step:", currentStep, "Total steps:", STEPS.length)
      return
    }

    console.log("Submit allowed: on last step. Current step:", currentStep)
    
    const isValid = await validateStep(currentStep)
    if (!isValid) {
      console.log("Submit blocked: validation failed")
      return
    }

    console.log("Form submitted:", data)
    alert(t.messages.submitted)
  }

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent any form submission
    if (formRef.current) {
      const form = formRef.current
      form.onsubmit = (ev) => {
        ev?.preventDefault()
        ev?.stopPropagation()
        return false
      }
    }
    
    try {
      // Save form data to localStorage
      saveNow()
      
      // Show success message
      alert(t.messages.saved)
      
      // Don't navigate away, stay on current step
      // Prevent any page reload or navigation
    } catch (error) {
      console.error("Error saving form:", error)
    }
    
    // Return false to prevent any default behavior
    return false
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
      case 5:
        return <Step5TestResults form={form} />
      case 6:
        return <Step6InstrumentalResearch form={form} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/40">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        
        {/* Header */}
        <header className="mb-6 md:mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 mb-4 shadow-xl shadow-blue-500/30 transition-transform hover:scale-105">
            <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {t.subtitle}
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
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (currentStep === STEPS.length) {
                form.handleSubmit(onSubmit)(e)
              } else {
                console.log("Form submit prevented: not on last step. Current step:", currentStep)
              }
              return false
            }}
            onKeyDown={(e) => {
              // Prevent Enter key from submitting form unless on last step
              if (e.key === "Enter" && currentStep !== STEPS.length) {
                const target = e.target as HTMLElement
                if (target.tagName !== "TEXTAREA" && target.tagName !== "BUTTON") {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }
            }}
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
                    {t.buttons.back}
                  </Button>
                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleNext(e)
                      }}
                      className="flex-1 sm:flex-none min-w-[120px] bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {t.buttons.next}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 sm:flex-none min-w-[120px] bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {t.buttons.submit}
                    </Button>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSave(e)
                    }}
                    className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t.buttons.save}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingPDF ? t.buttons.generating : t.buttons.pdf}
                  </Button>
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
  const { t } = useI18n()
  return (
    <FormSection title={t.personalData.title} icon={User}>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              {t.personalData.fullName} <span className="text-red-500">{t.personalData.required}</span>
            </FormLabel>
            <FormControl>
              <Input
                title={t.personalData.fullName}
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
              {t.personalData.passport} <span className="text-red-500">{t.personalData.required}</span>
            </FormLabel>
            <FormControl>
              <Input
                title={t.personalData.passport}
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
                {t.personalData.birthDate} <span className="text-red-500">{t.personalData.required}</span>
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
                {t.personalData.gender} <span className="text-red-500">{t.personalData.required}</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={t.personalData.male} id="male" />
                    <label
                      htmlFor="male"
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {t.personalData.male}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={t.personalData.female} id="female" />
                    <label
                      htmlFor="female"
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {t.personalData.female}
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
              <b>{t.personalData.maritalStatus}</b> <span className="text-red-500">{t.personalData.required}</span>
            </FormLabel>
            <FormControl>
              <Input
                title={t.personalData.maritalStatusHint}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.personalData.maritalStatusHint}
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
              <b>{t.personalData.education}</b> <span className="text-red-500">{t.personalData.required}</span>
            </FormLabel>
            <FormControl>
              <Input
                title={t.personalData.educationHint}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.personalData.educationHint}
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
              <b>{t.personalData.job}</b>{" "}
              <span className="text-red-500">{t.personalData.required}</span>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.personalData.jobHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.personalData.jobHint}
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
              <b>{t.personalData.address}</b> <span className="text-red-500">{t.personalData.required}</span>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.personalData.addressHint}
                rows={2}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.personalData.addressHint}
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
  const { t } = useI18n()
  return (
    <FormSection title={t.clinicVisit.title} icon={Calendar}>
      <FormField
        control={form.control}
        name="admissionDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>{t.clinicVisit.admissionDate}</b> {t.clinicVisit.admissionDateOptional}
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                title={t.clinicVisit.admissionDateHint}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.admissionDateHint}
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
              <b>{t.clinicVisit.referralDiagnosis}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.referralDiagnosisHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.referralDiagnosisHint}
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
              <b>{t.clinicVisit.mainComplaints}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.mainComplaintsHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.mainComplaintsHint}
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
              <b>{t.clinicVisit.mainComplaintsDetail}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.mainComplaintsDetailHint}
                rows={6}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.mainComplaintsDetailHint}
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
              <b>{t.clinicVisit.generalComplaints}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.generalComplaintsHint}
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.generalComplaintsHint}
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
              <b>{t.clinicVisit.additionalComplaints}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.additionalComplaintsHint}
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.additionalComplaintsHint}
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
              <b>{t.clinicVisit.firstSymptomsDate}</b>
            </FormLabel>
            <FormControl>
              <Input
                title={t.clinicVisit.firstSymptomsDateHint}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.firstSymptomsDateHint}
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
              <b>{t.clinicVisit.firstSymptoms}</b>
            </FormLabel>
            <FormControl>
              <Input
                title={t.clinicVisit.firstSymptomsHint}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.firstSymptomsHint}
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
              <b>{t.clinicVisit.triggers}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.triggersHint}
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.triggersHint}
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
              <b>{t.clinicVisit.symptomsDynamic}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.symptomsDynamicHint}
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.symptomsDynamicHint}
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
              <b>{t.clinicVisit.previousDiagnosis}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.previousDiagnosisHint}
                rows={6}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.previousDiagnosisHint}
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
              <b>{t.clinicVisit.currentState}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.clinicVisit.currentStateHint}
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.clinicVisit.currentStateHint}
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
  const { t } = useI18n()
  return (
    <FormSection title={t.lifeHistory.title} icon={FileText}>
      <FormField
        control={form.control}
        name="badHabits"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>{t.lifeHistory.badHabits}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.lifeHistory.badHabitsHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.lifeHistory.badHabitsHint}
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
              <b>{t.lifeHistory.familyHistory}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.lifeHistory.familyHistoryHint}
                rows={4}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.lifeHistory.familyHistoryHint}
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
              <b>{t.lifeHistory.allergies}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.lifeHistory.allergiesHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.lifeHistory.allergiesHint}
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
              <b>{t.lifeHistory.pastDiseases}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.lifeHistory.pastDiseasesHint}
                rows={6}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.lifeHistory.pastDiseasesHint}
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
  const { t } = useI18n()
  return (
    <FormSection
      title={t.examination.title}
      icon={Stethoscope}
    >
      <FormField
        control={form.control}
        name="generalExamination"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              <b>{t.examination.generalExamination}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.generalExaminationHint}
                rows={5}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.generalExaminationHint}
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
              <b>{t.examination.headNeck}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.headNeckHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.headNeckHint}
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
              <b>{t.examination.skin}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.skinHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.skinHint}
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
              <b>{t.examination.respiratory}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.respiratoryHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.respiratoryHint}
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
              <b>{t.examination.cardiovascular}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.cardiovascularHint}
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
              <b>{t.examination.abdomen}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.abdomenHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.abdomenHint}
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
              <b>{t.examination.musculoskeletal}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.musculoskeletalHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.musculoskeletalHint}
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
              <b>{t.examination.lymphNodes}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.lymphNodesHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.lymphNodesHint}
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
              <b>{t.examination.abdomenPalpation}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.abdomenPalpationHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.abdomenPalpationHint}
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
              <b>{t.examination.percussion}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.percussionHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.percussionHint}
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
              <b>{t.examination.lungAuscultation}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.lungAuscultationHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.lungAuscultationHint}
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
              <b>{t.examination.heartAuscultation}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.heartAuscultationHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.heartAuscultationHint}
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
              <b>{t.examination.abdomenAuscultation}</b>
            </FormLabel>
            <FormControl>
              <Textarea
                title={t.examination.abdomenAuscultationHint}
                rows={3}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 italic">
              {t.examination.abdomenAuscultationHint}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  )
}

// Step 5: Результаты анализов
function Step5TestResults({
  form,
}: {
  form: ReturnType<typeof useForm<MedicalFormData>>
}) {
  const { t } = useI18n()
  return (
    <FormSection title={t.testResults.title} icon={TestTube}>
      {/* Общий Анализ Крови (ОАК) */}
      <TestResultsTable
        title={t.testResults.oak}
        conclusionFieldName="oak_conclusion"
        rows={[
          {
            name: t.testResults.oak_wbc,
            fieldName: "oak_wbc",
            unit: "×10⁹/л",
            reference: "3.89 – 9.23",
          },
          {
            name: t.testResults.oak_rbc,
            fieldName: "oak_rbc",
            unit: "×10¹²/л",
            reference: "3.66 – 4.76",
          },
          {
            name: t.testResults.oak_hgb,
            fieldName: "oak_hgb",
            unit: "г/л",
            reference: "115.5 – 142.0",
          },
          {
            name: t.testResults.oak_hct,
            fieldName: "oak_hct",
            unit: "%",
            reference: "34.26 – 43.45",
          },
          {
            name: t.testResults.oak_mcv,
            fieldName: "oak_mcv",
            unit: "фл",
            reference: "86.5 – 101.79",
          },
          {
            name: t.testResults.oak_mch,
            fieldName: "oak_mch",
            unit: "пг",
            reference: "27.23 – 33.76",
          },
          {
            name: t.testResults.oak_mchc,
            fieldName: "oak_mchc",
            unit: "г/л",
            reference: "30.59 – 33.76",
          },
          {
            name: t.testResults.oak_rdw_cv,
            fieldName: "oak_rdw_cv",
            unit: "%",
            reference: "11.63 – 14.87",
          },
          {
            name: t.testResults.oak_rdw_sd,
            fieldName: "oak_rdw_sd",
            unit: "фл",
            reference: "38.3 – 51.62",
          },
          {
            name: t.testResults.oak_plt,
            fieldName: "oak_plt",
            unit: "×10⁹/л",
            reference: "131.0 – 362.0",
          },
          {
            name: t.testResults.oak_pct,
            fieldName: "oak_pct",
            unit: "%",
            reference: "0.17 – 0.39",
          },
          {
            name: t.testResults.oak_mpv,
            fieldName: "oak_mpv",
            unit: "фл",
            reference: "9.0 – 13.0",
          },
          {
            name: t.testResults.oak_pdw,
            fieldName: "oak_pdw",
            unit: "%",
            reference: "9.3 – 16.7",
          },
        ]}
      />

      {/* Общий анализ мочи (ОАМ) */}
      <TestResultsTable
        title={t.testResults.oam}
        conclusionFieldName="oam_conclusion"
        rows={[
          {
            name: t.testResults.oam_color,
            fieldName: "oam_color",
            unit: "—",
            reference: "жёлтый",
          },
          {
            name: t.testResults.oam_transparency,
            fieldName: "oam_transparency",
            unit: "—",
            reference: "прозрачная",
          },
          {
            name: t.testResults.oam_sediment,
            fieldName: "oam_sediment",
            unit: "—",
            reference: "незначит. количество",
          },
          {
            name: t.testResults.oam_ph_reaction,
            fieldName: "oam_ph_reaction",
            unit: "—",
            reference: "слабокислая",
          },
          {
            name: t.testResults.oam_bilirubin,
            fieldName: "oam_bilirubin",
            unit: "мкмоль/л",
            reference: "0 – 3.4",
          },
          {
            name: t.testResults.oam_urobilinogen,
            fieldName: "oam_urobilinogen",
            unit: "мкмоль/л",
            reference: "0 – 17",
          },
          {
            name: t.testResults.oam_ketones,
            fieldName: "oam_ketones",
            unit: "ммоль/л",
            reference: "0 – 0.5",
          },
          {
            name: t.testResults.oam_ascorbic_acid,
            fieldName: "oam_ascorbic_acid",
            unit: "мг/л",
            reference: "отсутствует",
          },
          {
            name: t.testResults.oam_glucose,
            fieldName: "oam_glucose",
            unit: "ммоль/л",
            reference: "0 – 1.7",
          },
          {
            name: t.testResults.oam_protein,
            fieldName: "oam_protein",
            unit: "г/л",
            reference: "0 – 0.1",
          },
          {
            name: t.testResults.oam_blood,
            fieldName: "oam_blood",
            unit: "эр/мкл",
            reference: "0 – 5",
          },
          {
            name: t.testResults.oam_ph,
            fieldName: "oam_ph",
            unit: "—",
            reference: "4.8 – 7.4",
          },
          {
            name: t.testResults.oam_nitrites,
            fieldName: "oam_nitrites",
            unit: "—",
            reference: "отрицательные",
          },
          {
            name: t.testResults.oam_leukocytes_digital,
            fieldName: "oam_leukocytes_digital",
            unit: "лейк/мкл",
            reference: "0 – 10",
          },
          {
            name: t.testResults.oam_specific_gravity,
            fieldName: "oam_specific_gravity",
            unit: "—",
            reference: "1016 – 1022",
          },
          {
            name: t.testResults.oam_epithelium,
            fieldName: "oam_epithelium",
            unit: "в п. зр.",
            reference: "< 5",
          },
          {
            name: t.testResults.oam_leukocytes_microscopy,
            fieldName: "oam_leukocytes_microscopy",
            unit: "в п. зр.",
            reference: "0 – 5",
          },
          {
            name: t.testResults.oam_erythrocytes_unchanged,
            fieldName: "oam_erythrocytes_unchanged",
            unit: "в п. зр.",
            reference: "отсутствуют",
          },
          {
            name: t.testResults.oam_erythrocytes_changed,
            fieldName: "oam_erythrocytes_changed",
            unit: "в п. зр.",
            reference: "0 – 2",
          },
          {
            name: t.testResults.oam_bacteria,
            fieldName: "oam_bacteria",
            unit: "в п. зр.",
            reference: "отсутствуют",
          },
          {
            name: t.testResults.oam_mucus,
            fieldName: "oam_mucus",
            unit: "в п. зр.",
            reference: "незначит. количество",
          },
        ]}
      />

      {/* Биохимия крови */}
      <TestResultsTable
        title={t.testResults.bio}
        conclusionFieldName="bio_conclusion"
        rows={[
          {
            name: t.testResults.bio_bilt,
            fieldName: "bio_bilt",
            unit: "мкмоль/л",
            reference: "2.00 – 13.50",
          },
          {
            name: t.testResults.bio_bild,
            fieldName: "bio_bild",
            unit: "мкмоль/л",
            reference: "0.00 – 5.50",
          },
          {
            name: t.testResults.bio_ast,
            fieldName: "bio_ast",
            unit: "ед./л",
            reference: "8.0 – 42.0",
          },
          {
            name: t.testResults.bio_alt,
            fieldName: "bio_alt",
            unit: "ед./л",
            reference: "10.0 – 58.0",
          },
          {
            name: t.testResults.bio_urea,
            fieldName: "bio_urea",
            unit: "ммоль/л",
            reference: "3.50 – 9.20",
          },
          {
            name: t.testResults.bio_crea,
            fieldName: "bio_crea",
            unit: "мкмоль/л",
            reference: "26.0 – 130.0",
          },
          {
            name: t.testResults.bio_tp,
            fieldName: "bio_tp",
            unit: "г/л",
            reference: "55.0 – 75.0",
          },
          {
            name: t.testResults.bio_alb,
            fieldName: "bio_alb",
            unit: "г/л",
            reference: "25.0 – 39.0",
          },
          {
            name: t.testResults.bio_alp,
            fieldName: "bio_alp",
            unit: "ед./л",
            reference: "10 – 70",
          },
          {
            name: t.testResults.bio_amy,
            fieldName: "bio_amy",
            unit: "ед./л",
            reference: "300 – 1500",
          },
          {
            name: t.testResults.bio_glue,
            fieldName: "bio_glue",
            unit: "ммоль/л",
            reference: "4.30 – 7.30",
          },
          {
            name: t.testResults.bio_ldh,
            fieldName: "bio_ldh",
            unit: "ед./л",
            reference: "23 – 220",
          },
          {
            name: t.testResults.bio_glob,
            fieldName: "bio_glob",
            unit: "г/л",
            reference: "30.00 – 36.00",
          },
          {
            name: t.testResults.bio_alb_glob,
            fieldName: "bio_alb_glob",
            unit: "—",
            reference: "0.600 – 1.300",
          },
          {
            name: t.testResults.bio_ritis,
            fieldName: "bio_ritis",
            unit: "—",
            reference: "—",
          },
        ]}
      />

      {/* Иммунологического исследования */}
      <TestResultsTable
        title={t.testResults.imm}
        conclusionFieldName="imm_conclusion"
        rows={[
          {
            name: t.testResults.imm_cd3,
            fieldName: "imm_cd3",
            unit: "",
            reference: "58–85",
          },
          {
            name: t.testResults.imm_cd3_hla_dr,
            fieldName: "imm_cd3_hla_dr",
            unit: "",
            reference: "3–15",
          },
          {
            name: t.testResults.imm_cd4_cd8_minus,
            fieldName: "imm_cd4_cd8_minus",
            unit: "",
            reference: "30–56",
          },
          {
            name: t.testResults.imm_cd4_minus_cd8,
            fieldName: "imm_cd4_minus_cd8",
            unit: "",
            reference: "18–45",
          },
          {
            name: t.testResults.imm_cd4_cd8_ratio,
            fieldName: "imm_cd4_cd8_ratio",
            unit: "",
            reference: "0,6–2,3",
          },
          {
            name: t.testResults.imm_cd3_minus_cd8,
            fieldName: "imm_cd3_minus_cd8",
            unit: "",
            reference: "0–1",
          },
          {
            name: t.testResults.imm_cd4_minus_cd8_alt,
            fieldName: "imm_cd4_minus_cd8_alt",
            unit: "",
            reference: "0–1",
          },
          {
            name: t.testResults.imm_cd19,
            fieldName: "imm_cd19",
            unit: "",
            reference: "7–20",
          },
          {
            name: t.testResults.imm_cd16_cd56,
            fieldName: "imm_cd16_cd56",
            unit: "",
            reference: "5–25",
          },
          {
            name: t.testResults.imm_cd3_cd16_cd56,
            fieldName: "imm_cd3_cd16_cd56",
            unit: "",
            reference: "0–5",
          },
          {
            name: t.testResults.imm_cd3_cd25,
            fieldName: "imm_cd3_cd25",
            unit: "",
            reference: "—",
          },
          {
            name: t.testResults.imm_cd8_hla_dr,
            fieldName: "imm_cd8_hla_dr",
            unit: "",
            reference: "—",
          },
          {
            name: t.testResults.imm_cd19_cd27_igd,
            fieldName: "imm_cd19_cd27_igd",
            unit: "",
            reference: "—",
          },
          {
            name: t.testResults.imm_leukocytes,
            fieldName: "imm_leukocytes",
            unit: "",
            reference: "4–9",
          },
          {
            name: t.testResults.imm_lymphocytes_percent,
            fieldName: "imm_lymphocytes_percent",
            unit: "",
            reference: "19–37",
          },
          {
            name: t.testResults.imm_igg,
            fieldName: "imm_igg",
            unit: "",
            reference: "7,2–16,3",
          },
          {
            name: t.testResults.imm_igm,
            fieldName: "imm_igm",
            unit: "",
            reference: "1,9–5,3",
          },
          {
            name: t.testResults.imm_iga,
            fieldName: "imm_iga",
            unit: "",
            reference: "0,6–2,0",
          },
        ]}
      />

      {/* Серологического исследования */}
      <SerologicalTestTable />

      {/* Детекция микроорганизмов методом ПЦР */}
      <TestResultsTable
        title={t.testResults.pcr}
        conclusionFieldName="pcr_conclusion"
        rows={[
          {
            name: t.testResults.pcr_chlamydia,
            fieldName: "pcr_chlamydia",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_ureaplasma,
            fieldName: "pcr_ureaplasma",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_mycoplasma_hominis,
            fieldName: "pcr_mycoplasma_hominis",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_mycoplasma_genitalium,
            fieldName: "pcr_mycoplasma_genitalium",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_herpes,
            fieldName: "pcr_herpes",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_cmv,
            fieldName: "pcr_cmv",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_gonorrhea,
            fieldName: "pcr_gonorrhea",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_trichomonas,
            fieldName: "pcr_trichomonas",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_gardnerella,
            fieldName: "pcr_gardnerella",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_candida,
            fieldName: "pcr_candida",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_hpv_high,
            fieldName: "pcr_hpv_high",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_hpv_low,
            fieldName: "pcr_hpv_low",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
          {
            name: t.testResults.pcr_streptococcus,
            fieldName: "pcr_streptococcus",
            unit: "",
            reference: t.testResults.referenceNormal,
          },
        ]}
      />
    </FormSection>
  )
}
