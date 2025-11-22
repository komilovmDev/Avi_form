"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useFormContext } from "react-hook-form"
import { FormSection } from "@/components/form-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
// Select component will be replaced with native select for now
import { Plus, Eye, Edit, Trash2, Download, X, Scan, Calendar, User, Building, ImageIcon, FileText } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { MedicalFormData } from "@/lib/validation"
import Image from "next/image"

interface ResearchItem {
  id?: string
  type: string
  date?: string
  performingDoctor?: string
  institution?: string
  images?: string[] // Array of images
  comment?: string
}

export function Step6InstrumentalResearch({
  form,
}: {
  form: ReturnType<typeof useFormContext<MedicalFormData>>
}) {
  const { t } = useI18n()
  const researches = form.watch("instrumental_research") || []
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [viewingIndex, setViewingIndex] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Get instrumentalResearch translations
  const ir = (t as any).instrumentalResearch || {}

  const researchTypes = [
    { value: "xray", label: ir.typeXray },
    { value: "fluoroscopy", label: ir.typeFluoroscopy },
    { value: "contrast", label: ir.typeContrast },
    { value: "ct", label: ir.typeCT },
    { value: "mri", label: ir.typeMRI },
    { value: "ultrasound", label: ir.typeUltrasound },
    { value: "echocardiography", label: ir.typeEchocardiography },
    { value: "ecg", label: ir.typeECG },
    { value: "eeg", label: ir.typeEEG },
    { value: "pft", label: ir.typePFT },
    { value: "other", label: ir.typeOther },
  ]

  const handleAddResearch = (data: ResearchItem) => {
    const current = form.getValues("instrumental_research") || []
    form.setValue("instrumental_research", [...current, { ...data, id: Date.now().toString() }])
    setShowAddForm(false)
    // Don't reset field, keep the data
  }

  const handleEditResearch = (index: number, data: ResearchItem) => {
    const current = form.getValues("instrumental_research") || []
    const updated = [...current]
    updated[index] = { ...data, id: current[index]?.id || Date.now().toString() }
    form.setValue("instrumental_research", updated)
    setEditingIndex(null)
  }

  const handleDeleteResearch = (index: number) => {
    if (confirm(ir.deleteConfirm)) {
      const current = form.getValues("instrumental_research") || []
      const updated = current.filter((_, i) => i !== index)
      form.setValue("instrumental_research", updated)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const validFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        alert(ir.fileTypeError)
        continue
      }

      // Validate file size (10 MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(ir.fileSizeError)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    // Read all files
    const readers = validFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((base64Strings) => {
      if (index !== undefined) {
        const current = form.getValues("instrumental_research") || []
        const updated = [...current]
        const existingImages = updated[index]?.images || []
        updated[index] = { 
          ...updated[index], 
          images: [...existingImages, ...base64Strings] 
        }
        form.setValue("instrumental_research", updated)
      } else {
        // For new research, return images to form component
        return base64Strings
      }
    })
  }

  const downloadImage = (image: string, type: string, imageIndex: number) => {
    const link = document.createElement("a")
    link.href = image
    link.download = `research-${type}-${Date.now()}-${imageIndex}.jpg`
    link.click()
  }

  const removeImage = (researchIndex: number, imageIndex: number) => {
    const current = form.getValues("instrumental_research") || []
    const updated = [...current]
    const images = updated[researchIndex]?.images || []
    images.splice(imageIndex, 1)
    updated[researchIndex] = { ...updated[researchIndex], images }
    form.setValue("instrumental_research", updated)
  }

  return (
    <FormSection title={ir.title} icon={Scan}>
      <div className="space-y-4">
        {!showAddForm && editingIndex === null && (
          <Button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {ir.addResearch}
          </Button>
        )}

        {showAddForm && (
          <ResearchForm
            form={form}
            researchTypes={researchTypes}
            onSubmit={handleAddResearch}
            onCancel={() => setShowAddForm(false)}
            onImageUpload={handleImageUpload}
            ir={ir || {}}
          />
        )}

        {editingIndex !== null && (
          <ResearchForm
            form={form}
            researchTypes={researchTypes}
            initialData={researches[editingIndex]}
            onSubmit={(data) => handleEditResearch(editingIndex, data)}
            onCancel={() => setEditingIndex(null)}
            onImageUpload={(e) => handleImageUpload(e, editingIndex)}
            ir={ir || {}}
          />
        )}

        {researches.length === 0 && !showAddForm && editingIndex === null && (
          <p className="text-gray-500 text-center py-8">{ir.noResearch}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researches.map((research, index) => (
            <ResearchCard
              key={research.id || index}
              research={research}
              researchTypes={researchTypes}
              onView={() => setViewingIndex(index)}
              onEdit={() => setEditingIndex(index)}
              onDelete={() => handleDeleteResearch(index)}
              onDownload={(imageIndex) => {
                const images = research.images || []
                if (images[imageIndex]) {
                  downloadImage(images[imageIndex], research.type, imageIndex)
                }
              }}
              ir={ir || {}}
              researchIndex={index}
              onRemoveImage={(imageIndex) => removeImage(index, imageIndex)}
            />
          ))}
        </div>

        {viewingIndex !== null && researches[viewingIndex] && (
          <ResearchModal
            research={researches[viewingIndex]}
            researchTypes={researchTypes}
            onClose={() => setViewingIndex(null)}
            onDownload={(imageIndex) => {
              const images = researches[viewingIndex].images || []
              if (images[imageIndex]) {
                downloadImage(images[imageIndex], researches[viewingIndex].type, imageIndex)
              }
            }}
            ir={ir || {}}
            researchIndex={viewingIndex}
            onRemoveImage={(imageIndex) => removeImage(viewingIndex, imageIndex)}
          />
        )}
      </div>
    </FormSection>
  )
}

function ResearchCard({
  research,
  researchTypes,
  onView,
  onEdit,
  onDelete,
  onDownload,
  ir,
  researchIndex,
  onRemoveImage,
}: {
  research: ResearchItem
  researchTypes: { value: string; label: string }[]
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onDownload: (imageIndex: number) => void
  ir: any
  researchIndex: number
  onRemoveImage: (imageIndex: number) => void
}) {
  const typeLabel = researchTypes.find((rt) => rt.value === research.type)?.label || research.type
  const images = research.images || []

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{typeLabel}</h4>
        {images.length > 0 && (
          <span className="text-xs text-gray-500">{images.length} {ir.image || "rasm"}</span>
        )}
      </div>

      {research.date && (
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">{ir.researchDate}:</span> {research.date}
        </p>
      )}

      {images.length > 0 && (
        <div className="mb-2 grid grid-cols-2 gap-2">
          {images.slice(0, 2).map((image, idx) => (
            <div key={idx} className="relative rounded overflow-hidden">
              <Image
                src={image}
                alt={`${typeLabel} ${idx + 1}`}
                width={100}
                height={75}
                className="w-full h-20 object-cover"
              />
            </div>
          ))}
          {images.length > 2 && (
            <div className="relative rounded overflow-hidden bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-600">+{images.length - 2}</span>
            </div>
          )}
        </div>
      )}

      {research.comment && (
        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{research.comment}</p>
      )}

      <div className="flex gap-2 mt-3">
        <Button type="button" variant="outline" size="sm" onClick={onView} className="flex-1">
          <Eye className="w-4 h-4 mr-1" />
          {ir.view}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="w-4 h-4 mr-1" />
          {ir.edit}
        </Button>
        <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function ResearchForm({
  form,
  researchTypes,
  initialData,
  onSubmit,
  onCancel,
  onImageUpload,
  ir,
}: {
  form: ReturnType<typeof useFormContext<MedicalFormData>>
  researchTypes: { value: string; label: string }[]
  initialData?: ResearchItem
  onSubmit: (data: ResearchItem) => void
  onCancel: () => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  ir: any
}) {
  const [formData, setFormData] = useState<ResearchItem>(
    initialData || {
      type: "",
      date: "",
      performingDoctor: "",
      institution: "",
      images: [],
      comment: "",
    }
  )
  const [otherType, setOtherType] = useState(initialData?.type === "other" ? initialData.type : "")
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!formData.type) {
      alert(ir.typeRequired)
      return
    }

    if ((!uploadedImages || uploadedImages.length === 0) && !formData.comment) {
      alert(ir.imageOrCommentRequired)
      return
    }

    onSubmit({
      ...formData,
      type: formData.type === "other" ? otherType : formData.type,
      images: uploadedImages,
    })
  }

  // Initialize uploadedImages when initialData changes
  useEffect(() => {
    if (initialData?.images) {
      setUploadedImages(initialData.images)
    } else {
      setUploadedImages([])
    }
  }, [initialData])

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 bg-gray-50 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {ir.researchType} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">{ir.researchType}</option>
            {researchTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {formData.type === "other" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {ir.typeOther}
            </label>
            <Input
              value={otherType}
              onChange={(e) => setOtherType(e.target.value)}
              placeholder={ir.typeOther}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {ir.researchDate}
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {ir.performingDoctor}
          </label>
          <Input
            value={formData.performingDoctor}
            onChange={(e) => setFormData({ ...formData, performingDoctor: e.target.value })}
            placeholder={ir.performingDoctor}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {ir.institution}
          </label>
          <Input
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            placeholder={ir.institution}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {ir.image} ({uploadedImages.length})
          </label>
          <Input
            id="research-image"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            multiple
            onChange={(e) => {
              const files = e.target.files
              if (!files || files.length === 0) return

              const validFiles: File[] = []
              for (let i = 0; i < files.length; i++) {
                const file = files[i]
                
                if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
                  alert(ir.fileTypeError)
                  continue
                }

                if (file.size > 10 * 1024 * 1024) {
                  alert(ir.fileSizeError)
                  continue
                }

                validFiles.push(file)
              }

              if (validFiles.length === 0) return

              const readers = validFiles.map((file) => {
                return new Promise<string>((resolve, reject) => {
                  const reader = new FileReader()
                  reader.onloadend = () => resolve(reader.result as string)
                  reader.onerror = reject
                  reader.readAsDataURL(file)
                })
              })

              Promise.all(readers).then((base64Strings) => {
                setUploadedImages([...uploadedImages, ...base64Strings])
              })
            }}
          />
          {uploadedImages.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {uploadedImages.map((image, idx) => (
                <div key={idx} className="relative group">
                  <Image
                    src={image}
                    alt={`Preview ${idx + 1}`}
                    width={100}
                    height={75}
                    className="rounded border w-full h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = uploadedImages.filter((_, i) => i !== idx)
                      setUploadedImages(newImages)
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {ir.comment}
          {(!uploadedImages || uploadedImages.length === 0) && <span className="text-red-500">*</span>}
        </label>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder={ir.commentPlaceholder}
          rows={4}
        />
        {(!uploadedImages || uploadedImages.length === 0) && (
          <p className="text-xs text-gray-500 mt-1">{ir.commentRequired}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onCancel()
          }}
        >
          {ir.cancel}
        </Button>
        <Button 
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit(e)
          }}
        >
          {ir.save}
        </Button>
      </div>
    </form>
  )
}

function ResearchModal({
  research,
  researchTypes,
  onClose,
  onDownload,
  ir,
  onRemoveImage,
  researchIndex,
}: {
  research: ResearchItem
  researchTypes: { value: string; label: string }[]
  onClose: () => void
  onDownload: (imageIndex: number) => void
  ir: any
  onRemoveImage: (imageIndex: number) => void
  researchIndex: number
}) {
  const typeLabel = researchTypes.find((rt) => rt.value === research.type)?.label || research.type
  const images = research.images || []
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        width: '100vw', 
        height: '100vh',
        margin: 0
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simple Header */}
        <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{typeLabel}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Info */}
          {(research.date || research.performingDoctor || research.institution) && (
            <div className="mb-6 space-y-3">
              {research.date && (
                <div>
                  <span className="text-sm text-gray-500">{ir.researchDate}:</span>
                  <span className="ml-2 text-gray-900 font-medium">{research.date}</span>
                </div>
              )}
              {research.performingDoctor && (
                <div>
                  <span className="text-sm text-gray-500">{ir.performingDoctor}:</span>
                  <span className="ml-2 text-gray-900 font-medium">{research.performingDoctor}</span>
                </div>
              )}
              {research.institution && (
                <div>
                  <span className="text-sm text-gray-500">{ir.institution}:</span>
                  <span className="ml-2 text-gray-900 font-medium">{research.institution}</span>
                </div>
              )}
            </div>
          )}

          {/* Images */}
          {images.length > 0 && (
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                {ir.image} ({images.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, idx) => (
                  <div key={idx} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <div className="aspect-video flex items-center justify-center">
                      <Image
                        src={image}
                        alt={`${typeLabel} ${idx + 1}`}
                        width={500}
                        height={350}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(idx)}
                        className="bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {ir.download}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          {research.comment && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">{ir.comment}</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{research.comment}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null

  return createPortal(modalContent, document.body)
}

