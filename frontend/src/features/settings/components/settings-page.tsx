"use client"

import { ActionResponse } from "@/shared/lib/action-response"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Bell, CalendarX, Clock, Loader2, RotateCcw, Save } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, use, useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { NotificationsSettings } from "../components/notifications-settings"
import { NotificationChannel, NotificationEvent } from "../notifications/types"
import { updateOperatingHours } from "../operating-hours/actions"
import { ExceptionsViewManager } from "../operating-hours/components/exceptions-view-manager"
import { ScheduleEditor } from "../operating-hours/components/schedule-editor"
import { ExceptionDate, OperatingHoursConfig } from "../operating-hours/model/types"

interface SettingsPageProps {
  operatingHoursPromise: Promise<ActionResponse<OperatingHoursConfig>>
  channelsPromise: Promise<NotificationChannel[]>
  eventsPromise: Promise<NotificationEvent[]>
}

// Wrapper để unwrap Promise với use()
// Component hiển thị và quản lý state logic
function SettingsForm({
  initialConfig,
  channels,
  events
}: {
  initialConfig: OperatingHoursConfig
  channels: NotificationChannel[]
  events: NotificationEvent[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Tab state
  const activeTab = searchParams.get("tab") || "schedule"

  // Shared operating hours state
  const [config, setConfig] = useState<OperatingHoursConfig>(initialConfig)
  const [isDirty, setIsDirty] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Handlers cho config changes
  const handleConfigChange = useCallback((newConfig: OperatingHoursConfig) => {
    setConfig(newConfig)
    setIsDirty(true)
  }, [])

  const handleAddExceptions = useCallback((newExceptions: ExceptionDate[]) => {
    setConfig(prev => ({ ...prev, exceptions: [...prev.exceptions, ...newExceptions] }))
    setIsDirty(true)
    toast.success(`Đã thêm ${newExceptions.length} ngoại lệ`)
  }, [])

  const handleRemoveException = useCallback((ids: string | string[]) => {
    const idsToRemove = Array.isArray(ids) ? ids : [ids]
    setConfig(prev => ({ ...prev, exceptions: prev.exceptions.filter(e => !idsToRemove.includes(e.id)) }))
    setIsDirty(true)
    toast.success(`Đã xóa ${idsToRemove.length} ngoại lệ`)
  }, [])

  // Save handler
  const handleSave = useCallback(() => {
    startTransition(async () => {
      const result = await updateOperatingHours(config)
      if (result.status === "success") {
        setIsDirty(false)
        toast.success(result.message)
      } else {
        toast.error(result.message || "Không thể lưu cấu hình")
      }
    })
  }, [config])

  // Reset handler
  const handleReset = useCallback(() => {
    setConfig(initialConfig)
    setIsDirty(false)
    toast.info("Đã khôi phục cấu hình gốc")
  }, [initialConfig])

  // Keyboard shortcut for Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty && !isPending) {
          handleSave()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDirty, isPending, handleSave])

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Check if we're on operating hours related tabs (schedule or exceptions)
  const showOperatingHoursActions = activeTab === "schedule" || activeTab === "exceptions"

  return (
    <Tabs
      value={activeTab}
      className="flex flex-col flex-1 w-full gap-0"
      onValueChange={handleTabChange}
    >
      {/* Sticky Header với Tabs + Actions */}
      <div className="sticky top-0 z-40 px-4 py-2 bg-card/95 backdrop-blur-sm border-b flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <TabsList variant="default" size="default">
            <TabsTrigger value="schedule" variant="default" stretch={false}>
              <Clock className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Lịch làm việc
              {isDirty && activeTab === "schedule" && (
                <Badge variant="warning" className="ml-2 h-5 w-5 p-0 justify-center text-[10px]">•</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="exceptions" variant="default" stretch={false}>
              <CalendarX className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Ngày ngoại lệ
              {isDirty && activeTab === "exceptions" && (
                <Badge variant="warning" className="ml-2 h-5 w-5 p-0 justify-center text-[10px]">•</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" variant="default" stretch={false}>
              <Bell className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Thông báo
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Save/Reset Actions - chỉ hiện khi ở tabs Operating Hours */}
        {showOperatingHoursActions && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
            {isDirty && (
              <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-warning" />
                </span>
                Có thay đổi chưa lưu
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!isDirty || isPending}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Khôi phục</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || isPending}
              className="gap-1.5 shadow-sm"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Lưu thay đổi</span>
              <span className="sm:hidden">Lưu</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TabsContent
          value="schedule"
          className="flex-1 flex flex-col mt-0 border-0 p-4 sm:p-6 overflow-y-auto data-[state=inactive]:hidden"
        >
          <ScheduleEditor config={config} onConfigChange={handleConfigChange} />
        </TabsContent>

        <TabsContent
          value="exceptions"
          className="flex-1 flex flex-col mt-0 border-0 p-0 overflow-hidden data-[state=inactive]:hidden"
        >
          <Card className="flex-1 flex flex-col overflow-hidden m-4 sm:m-6">
            <ExceptionsViewManager
              exceptions={config.exceptions}
              onAddExceptions={handleAddExceptions}
              onRemoveException={handleRemoveException}
            />
          </Card>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="flex-1 flex flex-col mt-0 border-0 p-4 sm:p-6 overflow-y-auto data-[state=inactive]:hidden"
        >
          <NotificationsSettings initialChannels={channels} initialEvents={events} />
        </TabsContent>
      </div>
    </Tabs>
  )
}

// Wrapper để unwrap Promise với use()
function SettingsContent({
  operatingHoursPromise,
  channelsPromise,
  eventsPromise
}: SettingsPageProps) {
  // Unwrap all promises at once
  const opHoursRes = use(operatingHoursPromise)
  const channels = use(channelsPromise)
  const events = use(eventsPromise)

  if (opHoursRes.status !== 'success' || !opHoursRes.data) {
     return <div className="p-4 text-destructive">Không tải được cấu hình thời gian làm việc</div>
  }

  const initialConfig = opHoursRes.data

  // Use JSON.stringify of config to force remount when data changes
  // This avoids setState in useEffect and ensures clean state reset
  const formKey = JSON.stringify(initialConfig)

  return (
    <SettingsForm
      key={formKey}
      initialConfig={initialConfig}
      channels={channels}
      events={events}
    />
  )
}

// Loading skeleton cho tabs
function SettingsTabSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded-md" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function SettingsPage(props: SettingsPageProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Suspense fallback={<SettingsTabSkeleton />}>
        <SettingsContent {...props} />
      </Suspense>
    </div>
  )
}
