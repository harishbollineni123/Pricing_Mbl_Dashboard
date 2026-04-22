"use client"

import { useState } from "react"
import { Home, FileText, Briefcase, Activity, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { k: "home", l: "Home", i: Home },
  { k: "enq", l: "Enquiries", i: FileText },
  { k: "jobs", l: "Jobs", i: Briefcase },
  { k: "ops", l: "Ops", i: Activity },
  { k: "more", l: "More", i: MoreHorizontal },
] as const

export function BottomNav() {
  const [active, setActive] = useState("home")

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.i
          const isActive = active === item.k
          return (
            <button
              key={item.k}
              onClick={() => setActive(item.k)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>{item.l}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
