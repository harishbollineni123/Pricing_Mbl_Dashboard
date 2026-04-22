"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { FilterSheet } from "@/components/dashboard/filter-sheet"
import { OverviewSection } from "@/components/dashboard/overview-section"
import { WizardStepper } from "@/components/dashboard/wizard-stepper"
import { Step1Enquiry } from "@/components/dashboard/steps/step1-enquiry"
import { Step2SubEnquiry } from "@/components/dashboard/steps/step2-sub-enquiry"
import { Step3Jobs } from "@/components/dashboard/steps/step3-jobs"
import { Step4Operations } from "@/components/dashboard/steps/step4-operations"
import { Step5POD } from "@/components/dashboard/steps/step5-pod"
import { CustomersSection } from "@/components/dashboard/customers-section"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { STEPS_CONFIG } from "@/lib/dashboard-data"
import { buildFilteredData, buildStepCounts, type DateRange, type InteractionSelection, type ServiceRole } from "@/lib/dashboard-filters"

export default function OperationsDashboard() {
  const [activeStep, setActiveStep] = useState(0)
  const [filterOpen, setFilterOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>("Last 30 days")
  const [role, setRole] = useState<ServiceRole>("All Roles")
  const [drillDownMode, setDrillDownMode] = useState(false)
  const [interactionSelections, setInteractionSelections] = useState<InteractionSelection[]>([])

  const filterCount = useMemo(() => {
    let n = 0
    if (dateRange !== "Last 30 days") n++
    if (role !== "All Roles") n++
    return n
  }, [dateRange, role])

  const filteredData = useMemo(
    () => buildFilteredData(dateRange, role, interactionSelections),
    [dateRange, role, interactionSelections],
  )
  const stepCounts = useMemo(() => buildStepCounts(filteredData), [filteredData])

  const applyInteractionSelection = (selection: InteractionSelection) => {
    setInteractionSelections((prev) => {
      if (!drillDownMode) return [selection]
      const withoutSameType = prev.filter((item) => item.type !== selection.type)
      return [...withoutSameType, selection]
    })
  }

  const removeInteractionSelection = (type: InteractionSelection["type"]) => {
    setInteractionSelections((prev) => prev.filter((item) => item.type !== type))
  }

  const stepPanels = [
    <Step1Enquiry
      key="step1"
      data={filteredData}
      activeSelections={interactionSelections}
      onStatusSelect={(statusName) => applyInteractionSelection({ type: "status", value: statusName, label: statusName })}
      onModeSelect={(modeKey, modeLabel) => applyInteractionSelection({ type: "mode", value: modeKey, label: modeLabel })}
    />,
    <Step2SubEnquiry
      key="step2"
      data={filteredData}
      activeSelections={interactionSelections}
      onModeSelect={(modeKey, modeLabel) => applyInteractionSelection({ type: "mode", value: modeKey, label: modeLabel })}
    />,
    <Step3Jobs key="step3" data={filteredData} />,
    <Step4Operations key="step4" data={filteredData} />,
    <Step5POD key="step5" data={filteredData} />,
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader 
        onFilter={() => setFilterOpen(true)} 
        filterCount={filterCount}
        dateRange={dateRange}
        role={role}
        onResetFilters={() => {
          setDateRange("Last 30 days")
          setRole("All Roles")
          setInteractionSelections([])
        }}
      />

      <OverviewSection data={filteredData} />

      <WizardStepper active={activeStep} setActive={setActiveStep} stepCounts={stepCounts} />

      <main className="px-4 py-4 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {STEPS_CONFIG[activeStep].label}
            </h2>
            <p className="text-xs text-muted-foreground">
              {stepCounts[activeStep].toLocaleString()} records
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setActiveStep(Math.min(STEPS_CONFIG.length - 1, activeStep + 1))}
              disabled={activeStep === STEPS_CONFIG.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {stepPanels[activeStep]}
      </main>

      <section className="px-4 pb-4 md:px-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Top Customers</h2>
          {/* <button className="text-xs font-medium text-muted-foreground hover:text-foreground">View All</button> */}
        </div>
        <CustomersSection
          data={filteredData}
          activeSelections={interactionSelections}
          onCustomerSelect={(customerName) => applyInteractionSelection({ type: "customer", value: customerName, label: customerName })}
        />
      </section>

      <footer className="border-t border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" /> Updated 2 min ago
          </p>
          <p>{filteredData.overview.totalEnquiries.toLocaleString()} enquiries</p>
        </div>
      </footer>

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        role={role}
        setRole={setRole}
      />
    </div>
  )
}
