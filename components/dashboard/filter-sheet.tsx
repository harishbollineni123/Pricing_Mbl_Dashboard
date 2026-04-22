"use client"

import { X, Calendar, Users, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DATE_OPTIONS, ROLE_OPTIONS, type DateRange, type ServiceRole } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  dateRange: DateRange
  setDateRange: (value: DateRange) => void
  role: ServiceRole
  setRole: (value: ServiceRole) => void
}

export function FilterSheet({ open, onClose, dateRange, setDateRange, role, setRole }: FilterSheetProps) {
  const activeCount = Number(dateRange !== "Last 30 days") + Number(role !== "All Roles")
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border bg-background transition-transform duration-300 md:hidden",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Smart Filters</h3>
            <p className="text-xs text-muted-foreground">Refine your dashboard view</p>
          </div>
          {activeCount > 0 && <Badge variant="secondary">{activeCount} active</Badge>}
          <button 
            onClick={onClose} 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {/* Date Range */}
          <div className="mb-6 rounded-xl border border-border bg-card/60 p-3">
            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DATE_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDateRange(d)}
                  className={cn(
                    "h-10 rounded-lg border text-xs font-semibold transition",
                    dateRange === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Service Role */}
          <div className="mb-6 rounded-xl border border-border bg-card/60 p-3">
            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Service Role
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "h-9 rounded-full border px-3 text-[11px] font-semibold transition",
                    role === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border bg-muted/30 px-5 py-4">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => { setDateRange("Last 30 days"); setRole("All Roles") }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button className="flex-1" onClick={onClose}>Apply Filters</Button>
        </div>
        <div className="h-safe pb-2" />
      </div>
    </>
  )
}
