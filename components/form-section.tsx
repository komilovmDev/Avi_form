import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function FormSection({ title, icon: Icon, children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        "group mb-8 animate-fade-in rounded-2xl bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-lg shadow-blue-500/5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border border-gray-200/50 hover:border-blue-300/50",
        className
      )}
    >
      <div className="mb-6 md:mb-8 flex items-center gap-4 border-b border-gradient-to-r from-blue-500/20 to-emerald-500/20 pb-4 border-b-gray-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 text-blue-600 transition-all duration-300 group-hover:from-blue-500/20 group-hover:to-emerald-500/20 group-hover:scale-110 shadow-md">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      <div className="space-y-5 md:space-y-6">{children}</div>
    </section>
  )
}

