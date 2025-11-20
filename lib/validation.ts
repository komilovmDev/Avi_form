import { z } from "zod"

export const medicalFormSchema = z.object({
  // Личные данные
  fullName: z.string().min(2, "ФИО должно содержать минимум 2 символа"),
  passport: z.string().min(5, "Серия и номер паспорта обязательны"),
  birthDate: z.string().min(1, "Дата рождения обязательна"),
  gender: z.enum(["Мужской", "Женский"], {
    required_error: "Выберите пол",
  }),
  maritalStatus: z.string().min(1, "Семейное положение обязательно"),
  education: z.string().min(1, "Образование обязательно"),
  job: z.string().min(1, "Место работы обязательно"),
  address: z.string().min(1, "Адрес обязателен"),

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
})

export type MedicalFormData = z.infer<typeof medicalFormSchema>

