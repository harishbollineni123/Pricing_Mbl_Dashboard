"use client"

import Link from "next/link"
import { FileText, Target, Briefcase, Container } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DATA } from "@/lib/dashboard-data"
import { type DashboardData } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"

const metricIcons = {
  enquiries: FileText,
  won: Target,
  jobs: Briefcase,
  containers: Container,
}

type AccentType = "blue" | "green" | "purple" | "orange"
type IconType = keyof typeof metricIcons

interface OverviewCardProps {
  metricKey: OverviewMetricKey
  icon: IconType
  label: string
  value: string
  subtext: string
  accent: AccentType
  count: number
}

const accentBorder: Record<AccentType, string> = {
  blue: "border-blue-200",
  green: "border-green-200",
  purple: "border-purple-200",
  orange: "border-orange-200",
}

const iconBg: Record<AccentType, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
}

const cardBg: Record<AccentType, string> = {
  blue: "bg-blue-50/40 dark:bg-blue-950/10",
  green: "bg-green-50/40 dark:bg-green-950/10",
  purple: "bg-purple-50/40 dark:bg-purple-950/10",
  orange: "bg-orange-50/40 dark:bg-orange-950/10",
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
}

type OverviewMetricKey = "totalEnquiries" | "wonEnquiries" | "activeJobs" | "fclContainers"

function OverviewCard({ metricKey, icon, label, value, subtext, accent, count }: OverviewCardProps) {
  const Icon = metricIcons[icon]

  return (
    <Card className={cn("gap-0 border py-0 shadow-none transition", accentBorder[accent], cardBg[accent])}>
      <CardContent className="p-0">
        <Link
          href={`/overview/${metricKey}?count=${count}&label=${encodeURIComponent(label)}&subtext=${encodeURIComponent(subtext)}`}
          className="block w-full cursor-pointer px-3 py-2.5 text-left sm:px-4 sm:py-3"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">{label}</p>
            <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md sm:h-7 sm:w-7", iconBg[accent])}>
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
            </div>
          </div>
          <div className="mt-1 min-w-0 flex-1">
            <p className="text-2xl font-bold leading-none tabular-nums tracking-tight text-foreground sm:text-3xl">{value}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground sm:mt-2 sm:text-xs">{subtext}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

export function OverviewSection({ data = DATA }: { data?: DashboardData }) {
  const conversionRate = ((data.overview.wonEnquiries / data.overview.totalEnquiries) * 100).toFixed(1)
  const unitsPerContainer = (data.overview.totalUnits / data.overview.fclContainers).toFixed(1)

  return (
    <section className="px-4 py-4 md:px-8">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <OverviewCard
          metricKey="totalEnquiries"
          icon="enquiries"
          label="Total Enquiries"
          value={data.overview.totalEnquiries.toLocaleString("en-US")}
          subtext="Current fiscal year"
          accent="blue"
          count={data.overview.totalEnquiries}
        />
        <OverviewCard
          metricKey="wonEnquiries"
          icon="won"
          label="Won Enquiries"
          value={data.overview.wonEnquiries.toLocaleString("en-US")}
          subtext={`${conversionRate}% conversion rate`}
          accent="green"
          count={data.overview.wonEnquiries}
        />
        <OverviewCard
          metricKey="activeJobs"
          icon="jobs"
          label="Active Jobs"
          value={data.overview.activeJobs.toLocaleString("en-US")}
          subtext={`${formatCompact(data.overview.activeJobs)} running jobs`}
          accent="purple"
          count={data.overview.activeJobs}
        />
        <OverviewCard
          metricKey="fclContainers"
          icon="containers"
          label="FCL Containers"
          value={data.overview.fclContainers.toLocaleString("en-US")}
          subtext={`${unitsPerContainer} avg units / container`}
          accent="orange"
          count={data.overview.fclContainers}
        />
      </div>
    </section>
  )
}
