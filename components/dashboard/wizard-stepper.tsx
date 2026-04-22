"use client"

import { useEffect, useRef } from "react"
import { CheckCircle2 } from "lucide-react"
import { STEPS_CONFIG } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

interface WizardStepperProps {
  active: number
  setActive: (step: number) => void
  stepCounts?: number[]
}

export function WizardStepper({ active, setActive, stepCounts }: WizardStepperProps) {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const activeTab = tabRefs.current[active]
    if (!activeTab) return

    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }, [active])

  return (
    <div className="sticky top-14 z-30 border-b border-border bg-background md:top-[104px]">
      <div className="scrollbar-hide overflow-x-auto md:overflow-x-visible">
        <div className="flex items-stretch gap-1.5 px-4 py-2.5 md:w-full md:gap-2 md:px-6">
          {STEPS_CONFIG.map((step, i) => {
            const Icon = step.icon
            const isActive = active === step.id
            const isDone = active > step.id
            return (
              <div
                key={step.id}
                ref={(el) => {
                  tabRefs.current[step.id] = el
                }}
                className="flex shrink-0 items-center md:min-w-0 md:flex-1"
              >
                <button
                  onClick={() => setActive(step.id)}
                  className={cn(
                    "flex min-w-[100px] items-center gap-2 rounded-lg border px-3 py-2 text-left md:w-full md:min-w-0",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isDone
                        ? "border-green-200 bg-green-50/80 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
                        : "border-border bg-card text-foreground hover:border-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                    isActive 
                      ? "bg-primary-foreground/20" 
                      : isDone 
                        ? "bg-green-100 dark:bg-green-900/50" 
                        : "bg-muted"
                  )}>
                    {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-[9px] font-medium uppercase tracking-wider",
                      isActive 
                        ? "text-primary-foreground/70" 
                        : isDone 
                          ? "text-green-600/70 dark:text-green-400/70" 
                          : "text-muted-foreground"
                    )}>
                      Step {i + 1}
                    </p>
                    <p className="truncate text-[11px] font-semibold">{step.label}</p>
                  </div>
                  <span className={cn(
                    "ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold tabular-nums",
                    isActive 
                      ? "bg-primary-foreground/20 text-primary-foreground" 
                      : isDone 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" 
                        : "bg-muted text-muted-foreground"
                  )}>
                    {(stepCounts?.[i] ?? step.count).toLocaleString()}
                  </span>
                </button>
                {i < STEPS_CONFIG.length - 1 && (
                  <div className="hidden items-center lg:flex">
                    <div className={cn(
                      "ml-1.5 h-px w-3",
                      active > step.id ? "bg-green-400" : "bg-border"
                    )} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
