import { z } from "zod"
import { translations, type Language } from "./translations"

export const createMedicalFormSchema = (language: Language = "ru") => {
  const t = translations[language]
  
  // Get gender values for current language
  const genderValues = [
    translations.ru.personalData.male,
    translations.ru.personalData.female,
    translations.uz.personalData.male,
    translations.uz.personalData.female,
    translations.en.personalData.male,
    translations.en.personalData.female,
  ]
  
  return z.object({
    // Личные данные
    fullName: z.string().min(2, t.validation.fullNameMin),
    passport: z.string().min(5, t.validation.passportRequired),
    birthDate: z.string().min(1, t.validation.birthDateRequired),
    gender: z.string().refine(
      (val) => val && genderValues.includes(val),
      {
        message: t.validation.genderRequired,
      }
    ),
    maritalStatus: z.string().min(1, t.validation.maritalStatusRequired),
    education: z.string().min(1, t.validation.educationRequired),
    job: z.string().min(1, t.validation.jobRequired),
    address: z.string().min(1, t.validation.addressRequired),

    // Обращение в клинику (все поля необязательны)
    admissionDate: z.string().optional(),
    referralDiagnosis: z.string().optional(),
    mainComplaints: z.string().optional(),
    mainComplaintsDetail: z.string().optional(),
    generalComplaints: z.string().optional(),
    additionalComplaints: z.string().optional(),
    firstSymptomsDate: z.string().optional(),
    firstSymptoms: z.string().optional(),
    triggers: z.string().optional(),
    symptomsDynamic: z.string().optional(),
    previousDiagnosis: z.string().optional(),
    currentState: z.string().optional(),

    // Анамнез жизни
    badHabits: z.string().optional(),
    familyHistory: z.string().optional(),
    allergies: z.string().optional(),
    pastDiseases: z.string().optional(),

    // Объективное обследование
    generalExamination: z.string().optional(),
    headNeck: z.string().optional(),
    skin: z.string().optional(),
    respiratory: z.string().optional(),
    cardiovascular: z.string().optional(),
    abdomen: z.string().optional(),
    musculoskeletal: z.string().optional(),
    lymphNodes: z.string().optional(),
    abdomenPalpation: z.string().optional(),
    percussion: z.string().optional(),
    lungAuscultation: z.string().optional(),
    heartAuscultation: z.string().optional(),
    abdomenAuscultation: z.string().optional(),

    // Результаты анализов - Общий Анализ Крови (ОАК)
    oak_wbc: z.string().optional(),
    oak_rbc: z.string().optional(),
    oak_hgb: z.string().optional(),
    oak_hct: z.string().optional(),
    oak_mcv: z.string().optional(),
    oak_mch: z.string().optional(),
    oak_mchc: z.string().optional(),
    oak_rdw_cv: z.string().optional(),
    oak_rdw_sd: z.string().optional(),
    oak_plt: z.string().optional(),
    oak_pct: z.string().optional(),
    oak_mpv: z.string().optional(),
    oak_pdw: z.string().optional(),

    // Общий анализ мочи (ОАМ)
    oam_color: z.string().optional(),
    oam_transparency: z.string().optional(),
    oam_sediment: z.string().optional(),
    oam_ph_reaction: z.string().optional(),
    oam_bilirubin: z.string().optional(),
    oam_urobilinogen: z.string().optional(),
    oam_ketones: z.string().optional(),
    oam_ascorbic_acid: z.string().optional(),
    oam_glucose: z.string().optional(),
    oam_protein: z.string().optional(),
    oam_blood: z.string().optional(),
    oam_ph: z.string().optional(),
    oam_nitrites: z.string().optional(),
    oam_leukocytes_digital: z.string().optional(),
    oam_specific_gravity: z.string().optional(),
    oam_epithelium: z.string().optional(),
    oam_leukocytes_microscopy: z.string().optional(),
    oam_erythrocytes_unchanged: z.string().optional(),
    oam_erythrocytes_changed: z.string().optional(),
    oam_bacteria: z.string().optional(),
    oam_mucus: z.string().optional(),

    // Биохимия крови
    bio_bilt: z.string().optional(),
    bio_bild: z.string().optional(),
    bio_ast: z.string().optional(),
    bio_alt: z.string().optional(),
    bio_urea: z.string().optional(),
    bio_crea: z.string().optional(),
    bio_tp: z.string().optional(),
    bio_alb: z.string().optional(),
    bio_alp: z.string().optional(),
    bio_amy: z.string().optional(),
    bio_glue: z.string().optional(),
    bio_ldh: z.string().optional(),
    bio_glob: z.string().optional(),
    bio_alb_glob: z.string().optional(),
    bio_ritis: z.string().optional(),

    // Иммунологического исследования
    imm_cd3: z.string().optional(),
    imm_cd3_hla_dr: z.string().optional(),
    imm_cd4_cd8_minus: z.string().optional(),
    imm_cd4_minus_cd8: z.string().optional(),
    imm_cd4_cd8_ratio: z.string().optional(),
    imm_cd3_minus_cd8: z.string().optional(),
    imm_cd4_minus_cd8_alt: z.string().optional(),
    imm_cd19: z.string().optional(),
    imm_cd16_cd56: z.string().optional(),
    imm_cd3_cd16_cd56: z.string().optional(),
    imm_cd3_cd25: z.string().optional(),
    imm_cd8_hla_dr: z.string().optional(),
    imm_cd19_cd27_igd: z.string().optional(),
    imm_leukocytes: z.string().optional(),
    imm_lymphocytes_percent: z.string().optional(),
    imm_igg: z.string().optional(),
    imm_igm: z.string().optional(),
    imm_iga: z.string().optional(),

    // Серологического исследования - Интерпретация результатов
    sero_early_igg: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),
    sero_early_igm: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),
    sero_acute_igg: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),
    sero_acute_igm: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),
    sero_immunity_igg: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),
    sero_immunity_igm: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),
    sero_risk_igg: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),
    sero_risk_igm: z
      .string()
      .refine((val) => !val || val === "+" || val === "-", {
        message: t.validation.selectPlusOrMinus,
      })
      .optional(),

    // Детекция микроорганизмов методом ПЦР
    pcr_chlamydia: z.string().optional(),
    pcr_ureaplasma: z.string().optional(),
    pcr_mycoplasma_hominis: z.string().optional(),
    pcr_mycoplasma_genitalium: z.string().optional(),
    pcr_herpes: z.string().optional(),
    pcr_cmv: z.string().optional(),
    pcr_gonorrhea: z.string().optional(),
    pcr_trichomonas: z.string().optional(),
    pcr_gardnerella: z.string().optional(),
    pcr_candida: z.string().optional(),
    pcr_hpv_high: z.string().optional(),
    pcr_hpv_low: z.string().optional(),
    pcr_streptococcus: z.string().optional(),

    // Заключения для анализов
    oak_conclusion: z.string().optional(),
    oam_conclusion: z.string().optional(),
    bio_conclusion: z.string().optional(),
    imm_conclusion: z.string().optional(),
    sero_conclusion: z.string().optional(),
    pcr_conclusion: z.string().optional(),
  })
}

// Default schema for backward compatibility
export const medicalFormSchema = createMedicalFormSchema("ru")

export type MedicalFormData = z.infer<ReturnType<typeof createMedicalFormSchema>>

