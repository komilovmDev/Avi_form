"use client"

import { ReactNode } from "react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { MedicalFormData } from "@/lib/validation"
import { Info } from "lucide-react"

interface FormFieldWithDescriptionProps {
  form: UseFormReturn<MedicalFormData>
  name: keyof MedicalFormData
  label: string | ReactNode
  description?: string
  type?: "text" | "date" | "textarea"
  rows?: number
  required?: boolean
  placeholder?: string
}

export function FormFieldWithDescription({
  form,
  name,
  label,
  description,
  type = "text",
  rows = 3,
  required = false,
  placeholder,
}: FormFieldWithDescriptionProps) {
  const fieldTitle = description || placeholder || ""

  if (type === "textarea") {
    return (
      <FormField
        control={form.control}
        name={name as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
              {label}
              {required && <span className="text-red-500">*</span>}
              {description && (
                <Info
                  className="w-4 h-4 text-gray-400 cursor-help"
                  title={description}
                />
              )}
            </FormLabel>
            <FormControl>
              <Textarea
                title={fieldTitle}
                rows={rows}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            {description && (
              <FormDescription className="text-xs text-gray-500 italic">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  if (type === "date") {
    return (
      <FormField
        control={form.control}
        name={name as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
              {label}
              {required && <span className="text-red-500">*</span>}
              {description && (
                <Info
                  className="w-4 h-4 text-gray-400 cursor-help"
                  title={description}
                />
              )}
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                title={fieldTitle}
                className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
                {...field}
              />
            </FormControl>
            {description && (
              <FormDescription className="text-xs text-gray-500 italic">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
            {label}
            {required && <span className="text-red-500">*</span>}
            {description && (
              <Info
                className="w-4 h-4 text-gray-400 cursor-help"
                title={description}
              />
            )}
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              title={fieldTitle}
              className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20"
              {...field}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-gray-500 italic">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

