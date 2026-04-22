"use client"

import { Ship, Plane, Truck, FileText, ClipboardList, Container } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadialBarChart, RadialBar, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { DATA } from "@/lib/dashboard-data"
import { type DashboardData } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"

function SeaOpsPanel({ data }: { data: DashboardData }) {
  const mblValue = data.overview.seaMBL
  const hblValue = Math.round(mblValue * 0.6)
  const containerOpsValue = Math.round(data.overview.fclContainers * 0.186)
  const gauges = [
    { label: "MBL", value: mblValue, max: Math.max(100, Math.round(mblValue * 1.25)), color: "#0ea5e9", icon: FileText },
    { label: "HBL", value: hblValue, max: Math.max(100, Math.round(hblValue * 1.25)), color: "#06b6d4", icon: ClipboardList },
    { label: "Containers", value: containerOpsValue, max: Math.max(80, Math.round(containerOpsValue * 1.25)), color: "#0891b2", icon: Container },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {gauges.map((g) => {
          const Icon = g.icon
          const pct = (g.value / g.max) * 100
          return (
            <Card key={g.label} className="shadow-none">
              <CardContent className="px-3 py-0">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-sky-600" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{g.label}</span>
                </div>
                <div className="relative h-24">
                  <ResponsiveContainer>
                    <RadialBarChart 
                      innerRadius="84%" 
                      outerRadius="100%" 
                      data={[{ value: pct, fill: g.color }]} 
                      startAngle={90} 
                      endAngle={-270}
                    >
                      <RadialBar dataKey="value" cornerRadius={8} fill={g.color} background={{ fill: "hsl(var(--muted))" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="rounded-md bg-background/90 px-2 py-0.5 text-lg font-bold tabular-nums text-foreground">
                      {g.value}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-0">
          <CardTitle className="text-sm font-semibold">Container Equipment</CardTitle>
          <Badge variant="secondary" className="h-6 gap-1 text-[10px]">
            <Container className="h-3 w-3" /> FCL
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 pt-0">
          {data.containers.map((c) => {
            const max = Math.max(...data.containers.map((x) => x.count))
            const pct = (c.count / max) * 100
            return (
              <div key={c.type}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">{c.type}</span>
                  <span className="font-semibold tabular-nums text-foreground">{c.qty.toLocaleString()} qty</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="px-4 py-0">
          <CardTitle className="text-sm font-semibold">Count x Quantity</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="h-[200px]">
            <ResponsiveContainer>
              <ComposedChart data={data.containers}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="type" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={35} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 8, 
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                    fontSize: 11,
                    padding: "6px 10px"
                  }} 
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                <Bar yAxisId="left" dataKey="count" name="Count" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={16} />
                <Line yAxisId="right" type="monotone" dataKey="qty" name="Quantity" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AirOpsPanel({ data }: { data: DashboardData }) {
  const flights = Math.max(1, Math.round(data.overview.airHAWB * 0.43))
  const consign = Math.max(1, Math.round(data.overview.airHAWB * 0.97))
  const airPods = Math.max(0, Math.round(data.overview.podCompleted * 0.15))
  const stats = [
    { l: "HAWB", v: data.overview.airHAWB },
    { l: "Consign", v: consign },
    { l: "Flights", v: flights },
    { l: "PODs", v: airPods },
  ]

  const utilization = [
    { l: "HAWB Processing", v: data.overview.airHAWB, max: 100, c: "bg-amber-500" },
    { l: "Consignment Match", v: consign, max: Math.max(consign, data.overview.airHAWB), c: "bg-orange-500" },
    { l: "Package Logged", v: Math.max(1, Math.round(consign * 0.9)), max: Math.max(consign, data.overview.airHAWB), c: "bg-yellow-500" },
    { l: "POD Captured", v: airPods, max: Math.max(consign, data.overview.airHAWB), c: "bg-green-500" },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <Card key={s.l} className="shadow-none">
            <CardContent className="px-3 py-0 text-center">
              <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">{s.l}</p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none">
        <CardHeader className="px-4 py-0">
          <CardTitle className="text-sm font-semibold">Air Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-0 pt-0">
          {utilization.map((row) => (
            <div key={row.l}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{row.l}</span>
                <span className="tabular-nums text-muted-foreground">{row.v}/{row.max}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", row.c)} style={{ width: `${(row.v / row.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function RoadOpsPanel({ data }: { data: DashboardData }) {
  const vehicles = Math.max(1, Math.round(data.overview.roadJobs * 0.7))
  const drivers = Math.max(1, Math.round(data.overview.roadJobs * 0.85))
  const stats = [
    { l: "Transport", v: data.overview.roadJobs, bgIcon: Truck },
    { l: "Vehicles", v: vehicles, bgIcon: Container },
    { l: "Drivers", v: drivers, bgIcon: Truck },
  ]

  const roadBreakdownMap = Object.fromEntries(data.subEnquiryRoad.map((row) => [row.direction.toLowerCase(), row.count]))
  const breakdown = [
    { l: "Import", v: roadBreakdownMap.import ?? 0, c: "bg-emerald-500" },
    { l: "Export", v: roadBreakdownMap.export ?? 0, c: "bg-emerald-400" },
    { l: "Clearance", v: roadBreakdownMap.clearance ?? 0, c: "bg-emerald-300" },
  ]
  const maxBreakdown = Math.max(...breakdown.map((row) => row.v), 1)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => {
          const BgIcon = s.bgIcon
          return (
            <Card
              key={s.l}
              className="overflow-hidden border-emerald-100 bg-emerald-50/40 py-0 shadow-none dark:border-emerald-900 dark:bg-emerald-950/15"
            >
              <CardContent className="relative px-2.5 py-2.5">
                <BgIcon className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-emerald-600/5 dark:text-emerald-300/5" />
                <p className="relative z-10 truncate text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{s.l}</p>
                <p className="relative z-10 mt-1 text-2xl font-bold tabular-nums leading-none text-foreground">{s.v}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="shadow-none">
        <CardHeader className="px-4 py-0">
          <CardTitle className="text-sm font-semibold">Service Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pt-0">
          {breakdown.map((r) => (
            <div key={r.l}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{r.l}</span>
                <span className="font-semibold tabular-nums text-foreground">{r.v}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", r.c)} style={{ width: `${(r.v / maxBreakdown) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function Step4Operations({ data = DATA }: { data?: DashboardData }) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="sea" className="w-full">
        <TabsList className="mb-4 grid h-10 w-full grid-cols-3 rounded-xl bg-muted/70 p-1">
          <TabsTrigger
            value="sea"
            className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
          >
            <Ship className="h-3.5 w-3.5" /> Sea
          </TabsTrigger>
          <TabsTrigger
            value="air"
            className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
          >
            <Plane className="h-3.5 w-3.5" /> Air
          </TabsTrigger>
          <TabsTrigger
            value="road"
            className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
          >
            <Truck className="h-3.5 w-3.5" /> Road
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sea" className="mt-0">
          <SeaOpsPanel data={data} />
        </TabsContent>
        <TabsContent value="air" className="mt-0">
          <AirOpsPanel data={data} />
        </TabsContent>
        <TabsContent value="road" className="mt-0">
          <RoadOpsPanel data={data} />
        </TabsContent>
      </Tabs>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
          <CardTitle className="text-sm font-semibold">Receipts / Disbursements / Purchase Orders</CardTitle>
          <Badge variant="outline" className="text-[10px]">Finance Ops</Badge>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 pt-0">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card className="bg-muted/30 py-0 shadow-none">
              <CardContent className="px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Payment Receipts</p>
                <p className="text-xl font-bold tabular-nums">{data.paymentsDashboard.paymentReceipts.total}</p>
                <p className="text-[10px] text-muted-foreground">All {data.paymentsDashboard.paymentReceipts.status}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 py-0 shadow-none">
              <CardContent className="px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Disbursements</p>
                <p className="text-xl font-bold tabular-nums">{data.paymentsDashboard.paymentDisbursements.total}</p>
                <p className="text-[10px] text-muted-foreground">AED {data.paymentsDashboard.paymentDisbursements.totalAed.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 py-0 shadow-none">
              <CardContent className="px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Purchase Orders</p>
                <p className="text-xl font-bold tabular-nums">{data.paymentsDashboard.purchaseOrders.total}</p>
                <p className="text-[10px] text-muted-foreground">Mixed currency</p>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Unallocated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.paymentsDashboard.paymentReceipts.rows.map((row) => (
                  <TableRow key={row.currency}>
                    <TableCell>{row.currency}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.received.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.allocated.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.unallocated.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
