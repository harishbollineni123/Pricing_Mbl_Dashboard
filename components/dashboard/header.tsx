"use client"

import { Bell, Filter, Users, Calendar, RotateCcw, ChevronDown, Search, LayoutGrid, List, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { type DateRange, type ServiceRole } from "@/lib/dashboard-filters"

interface DashboardHeaderProps {
  onFilter: () => void
  filterCount: number
  dateRange: DateRange
  role: ServiceRole
  onResetFilters: () => void
}

export function DashboardHeader({ onFilter, filterCount, dateRange, role, onResetFilters }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between px-4 md:h-14 md:px-6">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Operations Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            className="relative h-8 gap-1.5 px-2.5 md:hidden"
          >
            <Filter className="h-3.5 w-3.5" />
            {filterCount > 0 && (
              <Badge className="h-4 min-w-4 px-1 text-[9px]">{filterCount}</Badge>
            )}
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px] font-semibold">RK</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop filter/toolbar bar */}
      <div className="hidden items-center justify-between gap-3 border-t border-border px-6 py-2 md:flex">
        <div className="flex items-center gap-2">
          <FilterPill icon={Calendar} label={dateRange} onClick={onFilter} active={dateRange !== "Last 30 days"} />
          <FilterPill icon={Users} label={role} onClick={onFilter} active={role !== "All Roles"} />
          <button onClick={onResetFilters} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="h-8 w-48 pl-8 text-xs"
            />
          </div>
          <div className="flex rounded-md border border-border">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-none border-r border-border">
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-none">
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button variant="outline" size="sm" className="relative h-8 gap-1.5 px-2.5" onClick={onFilter}>
            <Filter className="h-3.5 w-3.5" />
            Filters
            {filterCount > 0 && (
              <Badge className="h-4 min-w-4 px-1 text-[9px]">{filterCount}</Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

function FilterPill({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 items-center gap-2 rounded-md border px-3 text-xs font-medium transition ${
        active
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <span>{label}</span>
      <ChevronDown className={`h-3 w-3 ${active ? "text-primary" : "text-muted-foreground"}`} />
    </button>
  )
}
