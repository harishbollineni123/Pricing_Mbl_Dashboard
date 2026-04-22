"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"
import { DATA } from "@/lib/dashboard-data"
import { type DashboardData } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"
import { TrendingUp, BarChart3 } from "lucide-react"

const modeColor: Record<string, string> = { 
  sea: "#0ea5e9", 
  air: "#f59e0b", 
  road: "#10b981" 
}

function InsightTile({ value, label, tone }: { value: string; label: string; tone: "purple" | "green" | "blue" }) {
  const tones = {
    purple: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900",
    green: "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900",
    blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
  }
  return (
    <div className={cn("rounded-lg border p-2.5 text-center", tones[tone])}>
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[9px] font-medium uppercase tracking-wider opacity-80">{label}</p>
    </div>
  )
}

export function Step3Jobs({ data = DATA }: { data?: DashboardData }) {
  return (
    <Tabs defaultValue="funnel" className="w-full">
      <TabsList className="mb-4 grid h-10 w-full grid-cols-2 rounded-xl bg-muted/70 p-1">
        <TabsTrigger
          value="funnel"
          className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
        >
          <TrendingUp className="h-3.5 w-3.5" /> Funnel
        </TabsTrigger>
        <TabsTrigger
          value="breakdown"
          className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
        >
          <BarChart3 className="h-3.5 w-3.5" /> Breakdown
        </TabsTrigger>
      </TabsList>

      <TabsContent value="funnel" className="mt-0">
        <Card className="shadow-none">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm font-semibold">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="space-y-2.5">
              {data.funnel.map((stage) => {
                const widthPct = (stage.value / data.funnel[0].value) * 100
                return (
                  <div key={stage.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums text-foreground">{stage.value.toLocaleString()}</span>
                        <span className="text-[10px] tabular-nums text-muted-foreground">{widthPct.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="relative h-7 overflow-hidden rounded-md bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 flex items-center justify-end rounded-md pr-2"
                        style={{ width: `${widthPct}%`, backgroundColor: stage.fill }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
              <InsightTile value="9.5%" label="Enq to Won" tone="purple" />
              <InsightTile value="97%" label="Won to Job" tone="green" />
              <InsightTile value="46.8%" label="Enq to Job" tone="blue" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="breakdown" className="mt-0">
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
            <CardTitle className="text-sm font-semibold">Jobs by Mode</CardTitle>
            <Badge variant="secondary" className="h-6 text-[10px]">
              {data.jobBreakdown.reduce((s, x) => s + x.value, 0)} total
            </Badge>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer>
                <BarChart data={data.jobBreakdown} margin={{ top: 5, right: 5, left: -15, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} 
                    angle={-40} 
                    textAnchor="end" 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0} 
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      fontSize: 11,
                      padding: "6px 10px"
                    }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.jobBreakdown.map((d, i) => <Cell key={i} fill={modeColor[d.mode]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex justify-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" /> Sea</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Air</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Road</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
