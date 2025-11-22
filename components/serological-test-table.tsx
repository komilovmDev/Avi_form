"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { type MedicalFormData } from "@/lib/validation"
import { useI18n } from "@/lib/i18n"

export function SerologicalTestTable() {
  const form = useFormContext<MedicalFormData>()
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {t.testResults.sero}
      </h3>
      
      {/* Таблица интерпретации результатов */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">
                {t.testResults.seroInterpretation}
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                IgG
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                IgM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 font-medium">
                {t.testResults.seroEarly}
              </td>
              <td className="px-4 py-3 text-center border-r border-gray-200">
                <FormField
                  control={form.control}
                  name="sero_early_igg"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="early-igg-plus" />
                            <label
                              htmlFor="early-igg-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="early-igg-minus" />
                            <label
                              htmlFor="early-igg-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
              <td className="px-4 py-3 text-center">
                <FormField
                  control={form.control}
                  name="sero_early_igm"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="early-igm-plus" />
                            <label
                              htmlFor="early-igm-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="early-igm-minus" />
                            <label
                              htmlFor="early-igm-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
            </tr>
            <tr className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 font-medium">
                {t.testResults.seroAcute}
              </td>
              <td className="px-4 py-3 text-center border-r border-gray-200">
                <FormField
                  control={form.control}
                  name="sero_acute_igg"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="acute-igg-plus" />
                            <label
                              htmlFor="acute-igg-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="acute-igg-minus" />
                            <label
                              htmlFor="acute-igg-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
              <td className="px-4 py-3 text-center">
                <FormField
                  control={form.control}
                  name="sero_acute_igm"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="acute-igm-plus" />
                            <label
                              htmlFor="acute-igm-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="acute-igm-minus" />
                            <label
                              htmlFor="acute-igm-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
            </tr>
            <tr className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 font-medium">
                {t.testResults.seroImmunity}
              </td>
              <td className="px-4 py-3 text-center border-r border-gray-200">
                <FormField
                  control={form.control}
                  name="sero_immunity_igg"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="immunity-igg-plus" />
                            <label
                              htmlFor="immunity-igg-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="immunity-igg-minus" />
                            <label
                              htmlFor="immunity-igg-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
              <td className="px-4 py-3 text-center">
                <FormField
                  control={form.control}
                  name="sero_immunity_igm"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="immunity-igm-plus" />
                            <label
                              htmlFor="immunity-igm-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="immunity-igm-minus" />
                            <label
                              htmlFor="immunity-igm-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
            </tr>
            <tr className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 font-medium">
                {t.testResults.seroRisk}
              </td>
              <td className="px-4 py-3 text-center border-r border-gray-200">
                <FormField
                  control={form.control}
                  name="sero_risk_igg"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="risk-igg-plus" />
                            <label
                              htmlFor="risk-igg-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="risk-igg-minus" />
                            <label
                              htmlFor="risk-igg-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
              <td className="px-4 py-3 text-center">
                <FormField
                  control={form.control}
                  name="sero_risk_igm"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (field.value === value) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(value || undefined)
                            }
                          }}
                          value={field.value || ""}
                          className="flex gap-4 justify-center"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="+" id="risk-igm-plus" />
                            <label
                              htmlFor="risk-igm-plus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              +
                            </label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="-" id="risk-igm-minus" />
                            <label
                              htmlFor="risk-igm-minus"
                              className="text-xs cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              –
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Заключение */}
      <div className="mt-4">
        <FormField
          control={form.control}
          name="sero_conclusion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">
                {t.testResults.conclusion}
              </FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-y"
                  placeholder={t.testResults.conclusionPlaceholder}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
