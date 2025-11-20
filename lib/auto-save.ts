import { useEffect, useRef } from "react"
import { UseFormReturn } from "react-hook-form"
import { MedicalFormData } from "./validation"

const STORAGE_KEY = "medical_form_data"
const AUTO_SAVE_INTERVAL = 10000 // 10 seconds

export function useAutoSave(form: UseFormReturn<MedicalFormData>) {
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>("")

  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          Object.keys(data).forEach((key) => {
            if (data[key]) {
              form.setValue(key as keyof MedicalFormData, data[key])
            }
          })
        } catch (error) {
          console.error("Failed to load saved form data:", error)
        }
      }
    }
  }, [form])

  // Auto-save every 10 seconds
  useEffect(() => {
    const subscription = form.watch((value) => {
      const currentValue = JSON.stringify(value)
      
      // Only save if data changed
      if (currentValue !== lastSavedRef.current) {
        // Clear existing timer
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current)
        }

        // Set new timer
        autoSaveTimerRef.current = setTimeout(() => {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, currentValue)
            lastSavedRef.current = currentValue
            console.log("Auto-saved form data")
          }
        }, AUTO_SAVE_INTERVAL)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [form])

  // Manual save function
  const saveNow = () => {
    const value = form.getValues()
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      lastSavedRef.current = JSON.stringify(value)
    }
  }

  // Clear saved data
  const clearSaved = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
      lastSavedRef.current = ""
    }
  }

  return { saveNow, clearSaved }
}

