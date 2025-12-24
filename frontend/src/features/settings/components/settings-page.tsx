"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  use,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { NotificationsSettings } from "../components/notifications-settings";
import { NotificationChannel, NotificationEvent } from "../notifications";
import {
  ExceptionDate,
  ExceptionsPanel,
  OperatingHoursConfig,
  WeeklySchedule,
  updateOperatingHours,
} from "../operating-hours";

interface SettingsPageProps {
  operatingHoursPromise: Promise<ActionResponse<OperatingHoursConfig>>;
  channelsPromise: Promise<NotificationChannel[]>;
  eventsPromise: Promise<NotificationEvent[]>;
}

// Component hiển thị và quản lý state logic
function SettingsForm({
  initialConfig,
  channels,
  events,
}: {
  initialConfig: OperatingHoursConfig;
  channels: NotificationChannel[];
  events: NotificationEvent[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Tab state từ URL
  const activeTab = searchParams.get("tab") || "schedule";

  // Operating hours state
  const [config, setConfig] = useState<OperatingHoursConfig>(initialConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Handlers cho config changes
  const handleConfigChange = useCallback((newConfig: OperatingHoursConfig) => {
    setConfig(newConfig);
    setIsDirty(true);
  }, []);

  const handleAddExceptions = useCallback((newExceptions: ExceptionDate[]) => {
    setConfig((prev) => {
      const updatedConfig = {
        ...prev,
        exceptions: [...prev.exceptions, ...newExceptions],
      };

      // Auto-save exceptions
      startTransition(async () => {
        const result = await updateOperatingHours(updatedConfig);
        if (result.status === "success") {
          setIsDirty(false);
          toast.success(`Đã thêm ${newExceptions.length} ngoại lệ`);
        } else {
          toast.error(result.message || "Lỗi khi lưu ngoại lệ");
          // Revert on error? For now, keep dirty state true
          setIsDirty(true);
        }
      });

      return updatedConfig;
    });
  }, []);

  const handleRemoveException = useCallback((ids: string | string[]) => {
    setConfig((prev) => {
      const idsToRemove = Array.isArray(ids) ? ids : [ids];
      const updatedConfig = {
        ...prev,
        exceptions: prev.exceptions.filter((e) => !idsToRemove.includes(e.id)),
      };

      // Auto-save exceptions
      startTransition(async () => {
        const result = await updateOperatingHours(updatedConfig);
        if (result.status === "success") {
          setIsDirty(false);
          toast.success(`Đã xóa ${idsToRemove.length} ngoại lệ`);
        } else {
          toast.error(result.message || "Lỗi khi xóa ngoại lệ");
          setIsDirty(true);
        }
      });

      return updatedConfig;
    });
  }, []);

  // Save handler (Manual for Schedule)
  const handleSaveSchedule = useCallback(() => {
    startTransition(async () => {
      const result = await updateOperatingHours(config);
      if (result.status === "success") {
        setIsDirty(false);
        toast.success(result.message);
      } else {
        toast.error(result.message || "Không thể lưu cấu hình");
      }
    });
  }, [config]);

  // Reset handler
  const handleReset = useCallback(() => {
    setConfig(initialConfig);
    setIsDirty(false);
    toast.info("Đã khôi phục cấu hình gốc");
  }, [initialConfig]);

  // Keyboard shortcut for Save (Ctrl+S) - Only for Schedule tab now?
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (activeTab === "schedule" && isDirty && !isPending) {
          handleSaveSchedule();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, isPending, handleSaveSchedule, activeTab]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <PageShell>
      <Tabs
        value={activeTab}
        className="flex w-full flex-1 flex-col gap-0"
        onValueChange={handleTabChange}
      >
        <PageHeader>
          <TabsList variant="default" size="default">
            <TabsTrigger value="schedule" variant="default" stretch={false}>
              Lịch làm việc
            </TabsTrigger>
            <TabsTrigger value="exceptions" variant="default" stretch={false}>
              Ngày ngoại lệ
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              variant="default"
              stretch={false}
            >
              Thông báo
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {/* Action Buttons based on Tab */}
            {activeTab === "schedule" && (
              <>
                {isDirty && (
                  <span className="text-muted-foreground mr-2 hidden items-center gap-1.5 text-xs sm:inline-flex">
                    <span className="relative flex h-2 w-2">
                      <span className="bg-warning absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                      <span className="bg-warning relative inline-flex h-2 w-2 rounded-full" />
                    </span>
                    Chưa lưu
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={!isDirty || isPending}
                >
                  <RotateCcw className="mr-1.5 size-4" />
                  <span className="hidden sm:inline">Khôi phục</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveSchedule}
                  disabled={!isDirty || isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-1.5 size-4" />
                  )}
                  Lưu thay đổi
                </Button>
              </>
            )}

            {/* Added: Specific save for exceptions if needed, but handled inside panel mostly?
                Actually, previously we didnt have specific save buttons for exceptions in header,
                it was handled inside or via auto-save.
                Since we are reverting, we revert to no header buttons for exceptions.
            */}
          </div>
        </PageHeader>

        {/* Tab Contents */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TabsContent
            value="schedule"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <WeeklySchedule
                config={config}
                onConfigChange={handleConfigChange}
              />
            </PageContent>
          </TabsContent>

          <TabsContent
            value="exceptions"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ExceptionsPanel
                exceptions={config.exceptions}
                onAddExceptions={handleAddExceptions}
                onRemoveException={handleRemoveException}
              />
            </PageContent>
          </TabsContent>

          <TabsContent
            value="notifications"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <NotificationsSettings
                initialChannels={channels}
                initialEvents={events}
              />
            </PageContent>
          </TabsContent>
        </div>
      </Tabs>
    </PageShell>
  );
}

// Wrapper để unwrap Promise với use()
function SettingsContent({
  operatingHoursPromise,
  channelsPromise,
  eventsPromise,
}: SettingsPageProps) {
  const opHoursRes = use(operatingHoursPromise);
  const channels = use(channelsPromise);
  const events = use(eventsPromise);

  if (opHoursRes.status !== "success" || !opHoursRes.data) {
    return (
      <div className="text-destructive p-4">
        Không tải được cấu hình thời gian làm việc
      </div>
    );
  }

  const initialConfig = opHoursRes.data;
  const formKey = JSON.stringify(initialConfig);

  return (
    <SettingsForm
      key={formKey}
      initialConfig={initialConfig}
      channels={channels}
      events={events}
    />
  );
}

// Loading skeleton
function SettingsTabSkeleton() {
  return (
    <div className="animate-pulse space-y-6 px-0 py-6">
      <div className="bg-muted h-10 w-64 rounded-md" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="bg-muted h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SettingsPage(props: SettingsPageProps) {
  return (
    <Suspense fallback={<SettingsTabSkeleton />}>
      <SettingsContent {...props} />
    </Suspense>
  );
}
