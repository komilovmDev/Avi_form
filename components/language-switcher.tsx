"use client"

import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  const languages = [
    { code: "ru" as const, name: "Русский", flag: "🇷🇺" },
    { code: "uz" as const, name: "O'zbek", flag: "🇺🇿" },
    { code: "en" as const, name: "English", flag: "🇬🇧" },
  ]

  return (
    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-1 shadow-sm">
      <Languages className="w-4 h-4 text-gray-600 ml-1" />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "gap-1.5 h-8 px-2 sm:px-3 text-xs sm:text-sm",
            language === lang.code
              ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
              : "hover:bg-gray-100"
          )}
        >
          <span>{lang.flag}</span>
          <span className="hidden sm:inline">{lang.name}</span>
        </Button>
      ))}
    </div>
  )
}

