"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

interface StepNavigationProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function StepNavigation({
  steps,
  currentStep,
  onStepClick,
}: StepNavigationProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 flex-1"
            >
              <button
                type="button"
                onClick={() => onStepClick?.(stepNumber)}
                disabled={!onStepClick}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  isCompleted &&
                    "bg-gradient-to-br from-blue-500 to-green-500 border-transparent text-white shadow-lg shadow-blue-500/50",
                  isCurrent &&
                    "bg-white border-blue-500 text-blue-500 shadow-lg shadow-blue-500/30 scale-110",
                  isUpcoming &&
                    "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" fill="currentColor" />
                )}
              </button>
              <div className="mt-2 text-center max-w-[120px]">
                <p
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    isCurrent && "text-blue-600",
                    isCompleted && "text-gray-600",
                    isUpcoming && "text-gray-400"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-[10px] mt-0.5 transition-colors",
                    isCurrent && "text-blue-500",
                    isCompleted && "text-gray-500",
                    isUpcoming && "text-gray-400"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

