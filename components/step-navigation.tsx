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
  const currentStepData = steps.find((_, index) => index + 1 === currentStep)

  return (
    <div className="w-full mb-8">
      {/* Mobile: Show current step title above */}
      <div className="sm:hidden mb-3 text-center">
        <p className="text-sm font-semibold text-blue-600">
          {currentStepData?.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {currentStepData?.description}
        </p>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 sm:top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
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
              className="flex flex-col items-center relative z-10 flex-1 min-w-0"
            >
              <button
                type="button"
                onClick={() => onStepClick?.(stepNumber)}
                disabled={!onStepClick}
                className={cn(
                  "flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 transition-all duration-300 flex-shrink-0",
                  isCompleted &&
                    "bg-gradient-to-br from-blue-500 to-green-500 border-transparent text-white shadow-lg shadow-blue-500/50",
                  isCurrent &&
                    "bg-white border-blue-500 text-blue-500 shadow-lg shadow-blue-500/30 scale-110",
                  isUpcoming &&
                    "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                ) : (
                  <Circle className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" />
                )}
              </button>
              {/* Step titles - hidden on mobile, shown on larger screens */}
              <div className="hidden sm:block mt-1.5 md:mt-2 text-center w-full px-1">
                <div className="w-full overflow-hidden">
                  <p
                    className={cn(
                      "text-xs md:text-sm font-semibold transition-colors leading-tight truncate",
                      isCurrent && "text-blue-600",
                      isCompleted && "text-gray-600",
                      isUpcoming && "text-gray-400"
                    )}
                    title={step.title}
                  >
                    {step.title}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] md:text-xs mt-0.5 transition-colors leading-tight hidden md:block truncate",
                      isCurrent && "text-blue-500",
                      isCompleted && "text-gray-500",
                      isUpcoming && "text-gray-400"
                    )}
                    title={step.description}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

