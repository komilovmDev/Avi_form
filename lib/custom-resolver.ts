import { zodResolver } from "@hookform/resolvers/zod"
import { createMedicalFormSchema } from "./validation"
import type { Language } from "./translations"

export const createCustomResolver = (language: Language) => {
  return zodResolver(createMedicalFormSchema(language))
}

