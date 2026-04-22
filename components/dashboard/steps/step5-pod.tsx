"use client"

import { Ship, Plane, Truck, MapPin, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DATA } from "@/lib/dashboard-data"
import { type DashboardData } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"

const modeIcons = { sea: Ship, air: Plane, road: Truck }
const toneBg = {
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
}
const modeToTone = { sea: "sky", air: "amber", road: "emerald" } as const

export function Step5POD({ data = DATA }: { data?: DashboardData }) {
  const successRate = ((data.overview.podCompleted / data.overview.activeJobs) * 100).toFixed(1)
  const totalModeJobs = data.modeBreakdown.reduce((sum, row) => sum + row.jobs, 0) || 1
  const seaPods = Math.round((data.modeBreakdown.find((row) => row.mode === "Sea")?.jobs ?? 0) / totalModeJobs * data.overview.podCompleted)
  const airPods = Math.round((data.modeBreakdown.find((row) => row.mode === "Air")?.jobs ?? 0) / totalModeJobs * data.overview.podCompleted)
  const roadPods = Math.max(0, data.overview.podCompleted - seaPods - airPods)

  return (
    <div className="space-y-4">
      {/* Success Rate Card */}
      <Card className="border-l-[3px] border-l-green-500 shadow-none">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Delivery Success Rate</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums text-foreground">{successRate}%</span>
            <span className="text-sm text-muted-foreground">
              ({data.overview.podCompleted}/{data.overview.activeJobs})
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-md bg-muted p-2">
              <Ship className="h-3.5 w-3.5 text-sky-600" />
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{seaPods}</p>
              <p className="text-[9px] text-muted-foreground">Sea POD</p>
            </div>
            <div className="rounded-md bg-muted p-2">
              <Plane className="h-3.5 w-3.5 text-amber-600" />
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{airPods}</p>
              <p className="text-[9px] text-muted-foreground">Air POD</p>
            </div>
            <div className="rounded-md bg-muted p-2">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{roadPods}</p>
              <p className="text-[9px] text-muted-foreground">Road POD</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
          <CardTitle className="text-sm font-semibold">Recent Deliveries</CardTitle>
          <button className="text-xs font-medium text-primary hover:underline">View all</button>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-3">
            {data.recentPODs.map((p) => {
              const ModeIcon = modeIcons[p.mode as keyof typeof modeIcons]
              const tone = modeToTone[p.mode as keyof typeof modeToTone]
              return (
                <div key={p.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", toneBg[tone])}>
                    <ModeIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{p.customer}</p>
                      <Badge variant="secondary" className="h-5 gap-1 bg-green-50 text-[9px] text-green-700 dark:bg-green-950/50 dark:text-green-400">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {p.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="font-mono">{p.id}</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {p.location}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {p.time}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
