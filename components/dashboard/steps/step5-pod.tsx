"use client"

import { Ship, Plane, Truck, MapPin, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"
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

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function Step5POD({ data = DATA }: { data?: DashboardData }) {
  const successRate = ((data.overview.podCompleted / data.overview.activeJobs) * 100).toFixed(1)
  const totalModeJobs = data.modeBreakdown.reduce((sum, row) => sum + row.jobs, 0) || 1
  const seaPods = Math.round((data.modeBreakdown.find((row) => row.mode === "Sea")?.jobs ?? 0) / totalModeJobs * data.overview.podCompleted)
  const airPods = Math.round((data.modeBreakdown.find((row) => row.mode === "Air")?.jobs ?? 0) / totalModeJobs * data.overview.podCompleted)
  const roadPods = Math.max(0, data.overview.podCompleted - seaPods - airPods)
  const kpiChartData = data.kpiPerformance.comparisonRows.map((row) => ({
    name: row.kpi,
    shortName: row.kpi.length > 14 ? `${row.kpi.slice(0, 14)}...` : row.kpi,
    target: row.target,
    actual: row.actual,
    achievement: row.achievement,
  }))
  const totalTarget = data.kpiPerformance.comparisonRows.reduce((sum, row) => sum + row.target, 0)
  const totalActual = data.kpiPerformance.comparisonRows.reduce((sum, row) => sum + row.actual, 0)
  const overallAchievement = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0
  const outstandingChartData = data.paymentsDashboard.topOutstandingInvoices.map((row) => ({
    customer: row.customer.length > 18 ? `${row.customer.slice(0, 18)}...` : row.customer,
    outstanding: row.outstandingAed,
    openInvoices: row.openInvoices,
  }))

  return (
    <div className="space-y-4">
      {/* Success Rate Card */}
      <Card className="gap-0 border border-emerald-200 bg-emerald-50/35 py-0 shadow-none dark:border-emerald-900 dark:bg-emerald-950/15">
        <CardContent className="px-3 py-3 sm:p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">Delivery Success Rate</p>
            <div className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              POD
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-end gap-x-2 gap-y-1">
            <span className="text-2xl font-bold leading-none tabular-nums tracking-tight text-foreground sm:text-3xl">{successRate}%</span>
            <span className="rounded-full bg-background/90 px-2 py-0.5 text-[10px] text-muted-foreground sm:text-xs">
              ({data.overview.podCompleted}/{data.overview.activeJobs})
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-md border border-sky-200 bg-background/70 p-2 dark:border-sky-900 dark:bg-background/40">
              <div className="flex items-center gap-1.5">
                <Ship className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                <p className="text-[9px] font-semibold text-muted-foreground">Sea POD</p>
              </div>
              <p className="mt-1 text-lg font-bold leading-none tabular-nums tracking-tight text-foreground">{seaPods}</p>
            </div>
            <div className="rounded-md border border-amber-200 bg-background/70 p-2 dark:border-amber-900 dark:bg-background/40">
              <div className="flex items-center gap-1.5">
                <Plane className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <p className="text-[9px] font-semibold text-muted-foreground">Air POD</p>
              </div>
              <p className="mt-1 text-lg font-bold leading-none tabular-nums tracking-tight text-foreground">{airPods}</p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-background/70 p-2 dark:border-emerald-900 dark:bg-background/40">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[9px] font-semibold text-muted-foreground">Road POD</p>
              </div>
              <p className="mt-1 text-lg font-bold leading-none tabular-nums tracking-tight text-foreground">{roadPods}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-0">
          <CardTitle className="text-sm font-semibold">Recent Deliveries</CardTitle>
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

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
          <CardTitle className="text-sm font-semibold">KPI Target vs Actual ({data.kpiPerformance.periodLabel})</CardTitle>
          <Badge variant="outline" className="text-[10px]">Target / Actual View</Badge>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 pt-0">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="rounded-md border border-violet-200 bg-violet-50/60 px-2 py-2 dark:border-violet-900 dark:bg-violet-950/25 sm:p-2.5">
              <p className="text-[8px] font-medium uppercase tracking-wide text-violet-700/80 dark:text-violet-300/80 sm:text-[9px]">Total KPIs</p>
              <p className="mt-1 text-base font-bold leading-none tabular-nums text-violet-700 dark:text-violet-300 sm:text-xl" title={data.kpiPerformance.comparisonRows.length.toLocaleString("en-US")}>
                {formatCompactNumber(data.kpiPerformance.comparisonRows.length)}
              </p>
            </div>
            <div className="rounded-md border border-sky-200 bg-sky-50/60 px-2 py-2 dark:border-sky-900 dark:bg-sky-950/25 sm:p-2.5">
              <p className="text-[8px] font-medium uppercase tracking-wide text-sky-700/80 dark:text-sky-300/80 sm:text-[9px]">Total Target</p>
              <p className="mt-1 text-base font-bold leading-none tabular-nums text-sky-700 dark:text-sky-300 sm:text-xl" title={totalTarget.toLocaleString("en-US")}>
                {formatCompactNumber(totalTarget)}
              </p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-2 dark:border-emerald-900 dark:bg-emerald-950/25 sm:p-2.5">
              <p className="text-[8px] font-medium uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80 sm:text-[9px]">Total Actual</p>
              <p className="mt-1 text-base font-bold leading-none tabular-nums text-emerald-700 dark:text-emerald-300 sm:text-xl" title={totalActual.toLocaleString("en-US")}>
                {formatCompactNumber(totalActual)}
              </p>
              <p className="mt-1 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 sm:text-[10px]">{overallAchievement.toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-md border border-border p-2 lg:col-span-2">
              <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground">Target vs Actual by KPI</p>
              <div className="overflow-x-auto pb-1 [scrollbar-width:thin] [scrollbar-color:hsl(var(--foreground)/0.2)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20">
                <div style={{ minWidth: `${Math.max(900, kpiChartData.length * 90)}px` }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={kpiChartData} margin={{ left: 8, right: 20, top: 8, bottom: 36 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="shortName"
                      tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      angle={-12}
                      textAnchor="end"
                      interval={0}
                      height={50}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      width={52}
                    />
                    <Tooltip
                      formatter={(v: number) => v.toLocaleString()}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--card))",
                        fontSize: 11,
                        padding: "6px 10px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={{ r: 2, fill: "#94a3b8" }}
                      activeDot={{ r: 4, fill: "#94a3b8" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#0ea5e9"
                      strokeWidth={2.5}
                      dot={{ r: 2.5, fill: "#0ea5e9" }}
                      activeDot={{ r: 4.5, fill: "#0ea5e9" }}
                    />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border p-2">
              <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground">Achievement Trend (%)</p>
              <div className="overflow-x-auto pb-1 [scrollbar-width:thin] [scrollbar-color:hsl(var(--foreground)/0.2)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20">
                <div style={{ minWidth: `${Math.max(700, kpiChartData.length * 72)}px` }}>
                  <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={kpiChartData} margin={{ left: 4, right: 8, top: 6, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="shortName" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} interval={0} axisLine={false} tickLine={false} height={26} />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        formatter={(v: number) => `${v.toFixed(1)}%`}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
                        contentStyle={{
                          borderRadius: 8,
                          backgroundColor: "#ffffff",
                          fontSize: 11,
                          padding: "6px 10px",
                        }}
                      />
                      <Bar dataKey="achievement" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 px-2 pt-1 text-[11px]">
                <span className="text-muted-foreground">Overall achievement:</span>
                <span className="font-semibold tabular-nums text-foreground">{overallAchievement.toFixed(1)}%</span>
                <span className="text-muted-foreground">Actual / Target:</span>
                <span className="font-semibold tabular-nums text-foreground">{totalActual.toLocaleString()} / {totalTarget.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm font-semibold">Top Outstanding Invoices by Customer</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="rounded-md border border-border p-2">
            <div className="h-[280px]">
              <ResponsiveContainer>
                <BarChart data={outstandingChartData} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="customer" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval={0} angle={-30} textAnchor="end" height={72} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip
                    formatter={(value: number, key: string) =>
                      key === "outstanding"
                        ? `AED ${value.toLocaleString()}`
                        : value
                    }
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      fontSize: 11,
                      padding: "6px 10px",
                    }}
                  />
                  <Bar dataKey="outstanding" name="Outstanding (AED)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
