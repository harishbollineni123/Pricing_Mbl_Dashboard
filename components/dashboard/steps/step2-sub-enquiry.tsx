"use client"

import { Ship, Plane, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { DATA } from "@/lib/dashboard-data"
import { type DashboardData, type InteractionSelection, type InteractiveModeKey } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"

const TABS = [
  { k: "sea", l: "Sea", n: 1110, i: Ship, color: "#0ea5e9" },
  { k: "air", l: "Air", n: 306, i: Plane, color: "#f59e0b" },
  { k: "road", l: "Road", n: 104, i: Truck, color: "#10b981" },
] as const

type TabKey = typeof TABS[number]["k"]

function DirectionTable({ data, color }: { data: { direction: string; count: number }[]; color: string }) {
  const total = data.reduce((s, x) => s + x.count, 0)
  
  return (
    <div className="divide-y divide-border">
      {data.map((r) => {
        const pct = ((r.count / total) * 100).toFixed(1)
        return (
          <div key={r.direction} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="min-w-[80px] text-sm font-medium text-foreground">{r.direction}</span>
            <div className="flex flex-1 items-center gap-2">
              <Progress value={parseFloat(pct)} className="h-2 flex-1" style={{ ["--progress-color" as string]: color }} />
              <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{pct}%</span>
            </div>
            <span className="w-12 text-right text-sm font-semibold tabular-nums text-foreground">{r.count}</span>
          </div>
        )
      })}
    </div>
  )
}

export function Step2SubEnquiry({
  data = DATA,
  activeSelections = [],
  onModeSelect,
}: {
  data?: DashboardData
  activeSelections?: InteractionSelection[]
  onModeSelect?: (modeKey: InteractiveModeKey, modeLabel: string) => void
}) {
  const activeMode = activeSelections.find((selection) => selection.type === "mode")?.value
  const enquiryByMode = data.modeBreakdown.reduce<Record<string, number>>((acc, row) => {
    acc[row.mode.toLowerCase()] = row.enquiries
    return acc
  }, {})
  const dataMap = {
    sea: data.subEnquirySea,
    air: data.subEnquiryAir,
    road: data.subEnquiryRoad,
  }

  return (
    <Tabs defaultValue="sea" className="w-full">
      <TabsList className="mb-4 grid h-10 w-full grid-cols-3 rounded-xl bg-muted/70 p-1">
        {TABS.map((t) => {
          const Icon = t.i
          return (
            <TabsTrigger
              key={t.k}
              value={t.k}
              onClick={() => onModeSelect?.(t.k, t.l)}
              className={cn(
                "gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary",
                activeMode === t.k ? "bg-primary/10 text-primary" : "",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.l}</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[9px]">{(enquiryByMode[t.k] ?? t.n).toLocaleString()}</Badge>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {TABS.map((t) => {
        const Icon = t.i
        const data = dataMap[t.k]
        return (
          <TabsContent key={t.k} value={t.k} className="mt-0 space-y-4">
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Icon className="h-4 w-4" style={{ color: t.color }} />
                  Directional Split
                </CardTitle>
                <Badge variant="secondary" className="h-6 text-[10px]">{data.length} directions</Badge>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="h-[180px]">
                  <ResponsiveContainer>
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis 
                        type="category" 
                        dataKey="direction" 
                        tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} 
                        axisLine={false} 
                        tickLine={false} 
                        width={70} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: 8, 
                          border: "1px solid hsl(var(--border))",
                          backgroundColor: "hsl(var(--card))",
                          fontSize: 11,
                          padding: "6px 10px"
                        }} 
                      />
                      <Bar dataKey="count" fill={t.color} radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
                <CardTitle className="text-sm font-semibold">Summary Table</CardTitle>
                <button className="text-xs font-medium text-primary hover:underline">Export</button>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <DirectionTable data={data} color={t.color} />
              </CardContent>
            </Card>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
