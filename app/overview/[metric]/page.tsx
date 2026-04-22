"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Columns3, Download, Grid2x2, LayoutGrid, RefreshCw, Search } from "lucide-react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type OverviewMetricKey = "totalEnquiries" | "wonEnquiries" | "activeJobs" | "fclContainers"
interface OverviewRecord {
  id: string
  name: string
  status: string
  owner: string
  amount: number
  updatedAt: string
}

const OWNER_POOL = ["Riyaz", "Ahmed", "Sana", "Nadia", "Imran", "Rakesh", "Vikram", "Maya"]
const STATUS_POOL = ["Open", "In Progress", "Reviewed", "Scheduled", "Completed", "Pending"]

function createMetricRecords(metricKey: OverviewMetricKey, count: number): OverviewRecord[] {
  const safeCount = Math.max(0, count)
  const metricPrefix: Record<OverviewMetricKey, string> = {
    totalEnquiries: "ENQ",
    wonEnquiries: "WON",
    activeJobs: "JOB",
    fclContainers: "FCL",
  }

  return Array.from({ length: safeCount }, (_, index) => {
    const seq = index + 1
    const owner = OWNER_POOL[index % OWNER_POOL.length]
    const status = STATUS_POOL[index % STATUS_POOL.length]
    const day = ((index % 28) + 1).toString().padStart(2, "0")
    return {
      id: `${metricPrefix[metricKey]}-${seq.toString().padStart(4, "0")}`,
      name: `${metricPrefix[metricKey]} Record ${seq}`,
      status,
      owner,
      amount: 450 + ((index * 73) % 5000),
      updatedAt: `2026-04-${day}`,
    }
  })
}

export default function OverviewMetricPage() {
  const params = useParams<{ metric: string }>()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [columnsPreset, setColumnsPreset] = useState("default")
  const [pageSize, setPageSize] = useState(10)

  const metricKey = (params.metric ?? "totalEnquiries") as OverviewMetricKey
  const fallbackLabel: Record<OverviewMetricKey, string> = {
    totalEnquiries: "Total Enquiries",
    wonEnquiries: "Won Enquiries",
    activeJobs: "Active Jobs",
    fclContainers: "FCL Containers",
  }
  const label = searchParams.get("label") || fallbackLabel[metricKey]
  const count = Number(searchParams.get("count") || 0)
  const subtext = searchParams.get("subtext") || "Detailed records"

  const allRecords = useMemo(() => createMetricRecords(metricKey, count), [metricKey, count])
  const filteredRecords = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return allRecords
    return allRecords.filter((row) =>
      row.id.toLowerCase().includes(term)
      || row.name.toLowerCase().includes(term)
      || row.status.toLowerCase().includes(term)
      || row.owner.toLowerCase().includes(term),
    )
  }, [allRecords, query])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * pageSize
  const paginated = filteredRecords.slice(pageStart, pageStart + pageSize)

  const handleExportCurrentPage = () => {
    const rows = paginated.map((row) => ({
      "Record ID": row.id,
      "Name": row.name,
      "Status": row.status,
      "Owner": row.owner,
      "Amount": row.amount,
      "Updated At": row.updatedAt,
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records")
    XLSX.writeFile(workbook, `${metricKey}-page-${safePage}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center gap-2">
        <Button variant="outline" size="sm" asChild className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
          <Link href="/">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">{label}</h1>
          <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>
      </div>

      <Card className="gap-0 rounded-lg border-primary/15 bg-card/95 shadow-none">
        <CardContent className="flex h-[calc(100vh-130px)] flex-col px-3 py-0">
          <div className="sticky top-0 z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/10 bg-gradient-to-r from-blue-50/80 via-purple-50/70 to-emerald-50/70 px-2.5 py-2 dark:from-blue-950/35 dark:via-purple-950/25 dark:to-emerald-950/30">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-8 w-[220px] border-primary/20 bg-background pl-7 text-xs"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 border-primary/20 bg-background text-xs" onClick={handleExportCurrentPage}>
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto rounded-md border border-border [scrollbar-width:thin] [scrollbar-color:hsl(var(--foreground)/0.22)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/30">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Record ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.owner}</TableCell>
                    <TableCell className="text-right">{row.amount.toLocaleString("en-US")}</TableCell>
                    <TableCell className="text-right">{row.updatedAt}</TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      No records found for this search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="sticky bottom-0 z-20 mt-3 rounded-md border border-border bg-card/95 px-2 py-2">
            <p className="mb-2 text-xs text-muted-foreground">
              Records: {filteredRecords.length === 0 ? 0 : pageStart + 1}-{Math.min(pageStart + pageSize, filteredRecords.length)} of {filteredRecords.length}
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setPage(1)
                  }}
                >
                  <SelectTrigger size="sm" className="h-8 w-[80px] border-primary/20 bg-background text-xs">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((prev) => Math.max(1, prev - 1))
                    }}
                    className={safePage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, safePage - 2), Math.max(0, safePage - 2) + 3).map((pageNo) => (
                  <PaginationItem key={pageNo}>
                    <PaginationLink
                      href="#"
                      isActive={pageNo === safePage}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(pageNo)
                      }}
                    >
                      {pageNo}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }}
                    className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
