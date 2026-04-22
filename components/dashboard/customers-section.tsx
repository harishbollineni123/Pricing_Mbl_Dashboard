"use client"

import { FileText, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DATA } from "@/lib/dashboard-data"
import { type DashboardData, type InteractionSelection } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"

interface CustomerCardProps {
  title: string
  icon: React.ElementType
  rows: { name: string; count: number; initials: string }[]
  max: number
  tone: "enquiry" | "job"
  activeCustomer?: string
  onSelectCustomer?: (customerName: string) => void
}

const avatarColors = [
  "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
]

function getRandomPersonImage(seed: string, index: number) {
  const poolIndex = (seed.length + index * 7) % 70
  return `https://i.pravatar.cc/80?img=${poolIndex + 1}`
}

function CustomerCard({ title, icon: Icon, rows, max, tone, activeCustomer, onSelectCustomer }: CustomerCardProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-0">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            tone === "enquiry" 
              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" 
              : "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400"
          )}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 pt-0">
        {rows.map((c, i) => {
          const pct = (c.count / max) * 100
          return (
            <button
              key={c.name}
              onClick={() => onSelectCustomer?.(c.name)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-1 py-1 text-left transition",
                onSelectCustomer ? "cursor-pointer hover:bg-muted/60" : "",
                activeCustomer === c.name ? "bg-primary/10 ring-1 ring-primary/20" : "",
              )}
            >
              <span className="w-4 text-center text-[10px] font-bold text-muted-foreground">
                {i + 1}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={getRandomPersonImage(c.name, i)} alt={c.name} />
                <AvatarFallback className={cn("text-[10px] font-semibold", avatarColors[i % avatarColors.length])}>
                  {c.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Progress 
                    value={pct} 
                    className={cn("h-1.5 flex-1", tone === "enquiry" ? "[&>div]:bg-blue-500" : "[&>div]:bg-green-500")} 
                  />
                </div>
              </div>
              <span className="text-sm font-bold tabular-nums text-foreground">{c.count}</span>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function CustomersSection({
  data = DATA,
  activeSelections = [],
  onCustomerSelect,
}: {
  data?: DashboardData
  activeSelections?: InteractionSelection[]
  onCustomerSelect?: (customerName: string) => void
}) {
  const activeCustomer = activeSelections.find((selection) => selection.type === "customer")?.value

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CustomerCard
        title="By Enquiry"
        icon={FileText}
        rows={data.customersByEnquiry}
        max={data.customersByEnquiry[0]?.count ?? 1}
        tone="enquiry"
        activeCustomer={activeCustomer}
        onSelectCustomer={onCustomerSelect}
      />
      <CustomerCard
        title="By Job"
        icon={Briefcase}
        rows={data.customersByJob}
        max={data.customersByJob[0]?.count ?? 1}
        tone="job"
        activeCustomer={activeCustomer}
        onSelectCustomer={onCustomerSelect}
      />
    </div>
  )
}
