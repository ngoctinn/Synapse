"use client";

import { SurfaceCard } from "@/shared/components/layout/page-layout";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleChannelAction, updateChannelConfigAction, updateTemplateAction } from "../notifications/actions";
import { ChannelConfigDialog } from "../notifications/components/channel-config-dialog";
import { NotificationChannels } from "../notifications/components/notification-channels";
import { NotificationList } from "../notifications/components/notification-list";
import { TemplateEditor } from "../notifications/components/template-editor";
import { NotificationChannel, NotificationEvent } from "../notifications/types";

interface NotificationsSettingsProps {
  initialChannels: NotificationChannel[];
  initialEvents: NotificationEvent[];
}

export function NotificationsSettings({ initialChannels, initialEvents }: NotificationsSettingsProps) {
  const [channels, setChannels] = useState(initialChannels);
  const [events, setEvents] = useState(initialEvents);
  const [isPending, startTransition] = useTransition();

  const [configuringChannelId, setConfiguringChannelId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<{ eventId: string; channelId: string } | null>(null);

  const handleToggleChannel = (eventId: string, channelId: string, checked: boolean) => {
    // Optimistic update
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          channels: {
            ...event.channels,
            [channelId]: checked
          }
        };
      }
      return event;
    }));

    startTransition(async () => {
      try {
        const result = await toggleChannelAction(eventId, channelId, checked);
        if (result.status !== "success") {
           throw new Error(result.message);
        }
      } catch {
        toast.error("Không thể cập nhật cấu hình");
        // Revert state on error
        setEvents(prev => prev.map(event => {
            if (event.id === eventId) {
              return {
                ...event,
                channels: {
                  ...event.channels,
                  [channelId]: !checked
                }
              };
            }
            return event;
          }));
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveChannelConfig = (channelId: string, config: any) => {
    startTransition(async () => {
      const result = await updateChannelConfigAction(channelId, config);
      if (result.status === "success") {
        setChannels(prev => prev.map(ch => {
            if (ch.id === channelId) {
              return { ...ch, config: { ...ch.config, ...config } };
            }
            return ch;
          }));
          setConfiguringChannelId(null);
          toast.success(result.message);
      } else {
        toast.error("Lỗi khi lưu cấu hình");
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveTemplate = (eventId: string, channelId: string, template: any) => {
    startTransition(async () => {
        const result = await updateTemplateAction(eventId, channelId, template);
        if (result.status === "success") {
            setEvents(prev => prev.map(event => {
                if (event.id === eventId) {
                  return {
                    ...event,
                    templates: {
                      ...event.templates,
                      [channelId]: template
                    }
                  };
                }
                return event;
              }));
              setEditingTemplate(null);
              toast.success(result.message);
        } else {
            toast.error("Lỗi khi lưu mẫu tin");
        }
    });
  };

  const activeChannelConfig = channels.find(c => c.id === configuringChannelId);

  const activeTemplateEvent = editingTemplate
    ? events.find(e => e.id === editingTemplate.eventId)
    : null;
  const activeTemplate = activeTemplateEvent && editingTemplate
    ? activeTemplateEvent.templates[editingTemplate.channelId as keyof typeof activeTemplateEvent.templates]
    : undefined;

  return (
    <div className="space-y-6">
      {/* Channels Configuration */}
      <SurfaceCard>
        <CardHeader>
          <CardTitle>Kênh thông báo</CardTitle>
          <CardDescription>
            Quản lý các kênh gửi thông báo đến khách hàng và nhân viên.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationChannels
            channels={channels}
            onConfigure={setConfiguringChannelId}
          />
        </CardContent>
      </SurfaceCard>

      {/* Events Configuration */}
      <SurfaceCard>
        <CardHeader>
          <CardTitle>Sự kiện & Mẫu tin</CardTitle>
          <CardDescription>
            Bật/tắt các kênh thông báo cho từng loại sự kiện.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationList
            events={events}
            onToggleChannel={handleToggleChannel}
            onEditTemplate={(eventId, channelId) => setEditingTemplate({ eventId, channelId })}
          />
        </CardContent>
      </SurfaceCard>

      {/* Dialogs */}
      {activeChannelConfig && (
        <ChannelConfigDialog
            isOpen={!!configuringChannelId}
            onOpenChange={(open) => !open && !isPending && setConfiguringChannelId(null)}
            channel={activeChannelConfig}
            onSave={(channelId, config) => handleSaveChannelConfig(channelId, config)}
            isSaving={isPending}
        />
      )}

      {editingTemplate && activeTemplate && activeTemplateEvent && (
        <TemplateEditor
            isOpen={!!editingTemplate}
            onOpenChange={(open) => !open && !isPending && setEditingTemplate(null)}
            title={`${activeTemplateEvent.name} - ${editingTemplate.channelId.toUpperCase()}`}
            template={activeTemplate}
            onSave={(template) => handleSaveTemplate(activeTemplateEvent.id, editingTemplate.channelId, template)}
            isSaving={isPending}
        />
      )}
    </div>
  );
}
