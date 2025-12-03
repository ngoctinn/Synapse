"use client"

import { Button } from "@/shared/ui/button"
import { Calendar, List } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/shared/lib/utils"

export function AppointmentViewToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentView = searchParams.get("view") || "list"

  const setView = (view: "list" | "calendar") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("view", view)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center p-1 bg-slate-100 rounded-lg border relative">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 px-3 text-xs relative z-10 transition-colors duration-200",
          currentView === "list" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setView("list")}
      >
        {currentView === "list" && (
          <motion.div
            layoutId="active-view-bg"
            className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <List className="h-3.5 w-3.5 mr-1.5" />
        Danh sách
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 px-3 text-xs relative z-10 transition-colors duration-200",
          currentView === "calendar" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setView("calendar")}
      >
        {currentView === "calendar" && (
          <motion.div
            layoutId="active-view-bg"
            className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Calendar className="h-3.5 w-3.5 mr-1.5" />
        Lịch
      </Button>
    </div>
  )
}
