"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { DATA } from "@/lib/dashboard-data"
import { type DashboardData, type InteractionSelection, type InteractiveModeKey } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, PieChartIcon, BarChart3 } from "lucide-react"

function KpiCard({ label, value, delta, invert }: { label: string; value: string; delta: number; invert?: boolean }) {
  const isPositive = invert ? delta < 0 : delta > 0
  return (
    <Card className="shadow-none">
      <CardContent className="px-3 py-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="mt-1">
          <span className="text-xl font-bold tabular-nums text-foreground">{value}</span>
          <span className={cn(
            "mt-1 flex items-center gap-0.5 text-[10px] font-semibold",
            isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function Step1Enquiry({
  data = DATA,
  activeSelections = [],
  onStatusSelect,
  onModeSelect,
}: {
  data?: DashboardData
  activeSelections?: InteractionSelection[]
  onStatusSelect?: (statusName: string) => void
  onModeSelect?: (modeKey: InteractiveModeKey, modeLabel: string) => void
}) {
  const total = data.enquiryStatus.reduce((s, x) => s + x.value, 0)
  const activeStatus = activeSelections.find((selection) => selection.type === "status")?.value.toLowerCase()
  const activeMode = activeSelections.find((selection) => selection.type === "mode")?.value

  const handleModeClick = (payload: { mode?: string; payload?: { mode?: string } }) => {
    const modeLabel = payload?.mode ?? payload?.payload?.mode
    if (!modeLabel) return
    const modeKey = modeLabel.toLowerCase() as InteractiveModeKey
    onModeSelect?.(modeKey, modeLabel)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="mb-4 grid h-10 w-full grid-cols-2 rounded-xl bg-muted/70 p-1">
          <TabsTrigger
            value="status"
            className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
          >
            <PieChartIcon className="h-3.5 w-3.5" /> Status
          </TabsTrigger>
          <TabsTrigger
            value="mode"
            className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
          >
            <BarChart3 className="h-3.5 w-3.5" /> Mode Split
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-0">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
              <CardTitle className="text-sm font-semibold">Enquiry Status</CardTitle>
              <Badge variant="secondary" className="h-6 text-[10px]">Total {total.toLocaleString()}</Badge>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="relative h-[200px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      data={data.enquiryStatus}
                      dataKey="value" 
                      innerRadius={55} 
                      outerRadius={85} 
                      paddingAngle={2} 
                      stroke="none"
                    >
                      {data.enquiryStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: "1px solid hsl(var(--border))", 
                        backgroundColor: "hsl(var(--card))",
                        fontSize: 11,
                        padding: "6px 10px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">New</span>
                  <span className="text-xl font-bold tabular-nums text-foreground">{data.enquiryStatus[0]?.value.toLocaleString() ?? "0"}</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {data.enquiryStatus.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => onStatusSelect?.(s.name)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border border-border px-2.5 py-2 text-left transition",
                      onStatusSelect ? "cursor-pointer hover:bg-muted/50" : "",
                      activeStatus === s.name.toLowerCase() ? "border-primary/50 bg-primary/10" : "",
                    )}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="truncate text-[11px] text-muted-foreground">{s.name}</span>
                    <span className="ml-auto text-[11px] font-semibold tabular-nums text-foreground">{s.value.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mode" className="mt-0">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
              <CardTitle className="text-sm font-semibold">Mode Split</CardTitle>
              <Badge variant="secondary" className="h-6 text-[10px]">Enquiries vs Jobs</Badge>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="h-[200px]">
                <ResponsiveContainer>
                  <BarChart data={data.modeBreakdown} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="mode" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: "1px solid hsl(var(--border))", 
                        backgroundColor: "hsl(var(--card))",
                        fontSize: 11,
                        padding: "6px 10px"
                      }} 
                    />
                    <Legend 
                      iconType="circle" 
                      iconSize={8} 
                      wrapperStyle={{ fontSize: 11, paddingTop: 8 }} 
                    />
                    <Bar
                      dataKey="enquiries"
                      name="Enquiries"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      onClick={(barData) => handleModeClick(barData as { mode?: string; payload?: { mode?: string } })}
                      className={onModeSelect ? "cursor-pointer" : ""}
                    />
                    <Bar
                      dataKey="jobs"
                      name="Jobs"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      onClick={(barData) => handleModeClick(barData as { mode?: string; payload?: { mode?: string } })}
                      className={onModeSelect ? "cursor-pointer" : ""}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {activeMode && (
                <p className="mt-2 text-[10px] font-semibold text-primary">Mode filter: {activeMode.toUpperCase()}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-3 gap-2">
        <KpiCard label="Conversion" value="9.5%" delta={1.2} />
        <KpiCard label="Avg Response" value="4.2h" delta={-8.5} invert />
        <KpiCard label="Win Rate" value="60.2%" delta={3.1} />
      </div>
    </div>
  )
}
