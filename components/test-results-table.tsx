"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form"
import { type MedicalFormData } from "@/lib/validation"
import { useI18n } from "@/lib/i18n"

interface TestResultRow {
  name: string
  fieldName: keyof MedicalFormData
  unit: string
  reference: string
}

interface TestResultsTableProps {
  title: string
  rows: TestResultRow[]
  conclusionFieldName?: keyof MedicalFormData
}

export function TestResultsTable({ title, rows, conclusionFieldName }: TestResultsTableProps) {
  const form = useFormContext<MedicalFormData>()
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">
                {t.testResults.indicator}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">
                {t.testResults.result}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">
                {t.testResults.unit}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                {t.testResults.reference}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.fieldName}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 font-medium">
                  {row.name}
                </td>
                <td className="px-4 py-3 border-r border-gray-200">
                  <FormField
                    control={form.control}
                    name={row.fieldName}
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Input
                            {...field}
                            value={typeof field.value === 'string' ? field.value : String(field.value || '')}
                            className="h-8 text-sm border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            placeholder="—"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                  {row.unit}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {row.reference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Заключение */}
      {conclusionFieldName && (
        <div className="mt-4">
          <FormField
            control={form.control}
            name={conclusionFieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  {t.testResults.conclusion}
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    value={typeof field.value === 'string' ? field.value : String(field.value || '')}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-y"
                    placeholder={t.testResults.conclusionPlaceholder}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  )
}

