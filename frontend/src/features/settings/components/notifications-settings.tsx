"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
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

  const [configuringChannelId, setConfiguringChannelId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<{ eventId: string; channelId: string } | null>(null);

  const handleToggleChannel = (eventId: string, channelId: string, checked: boolean) => {
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
    toast.success("Đã cập nhật cấu hình thông báo");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveChannelConfig = (channelId: string, config: any) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return { ...ch, config: { ...ch.config, ...config } };
      }
      return ch;
    }));
    setConfiguringChannelId(null);
    toast.success("Đã lưu cấu hình kênh thông báo");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveTemplate = (eventId: string, channelId: string, template: any) => {
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
    toast.success("Đã lưu mẫu tin nhắn");
  };

  const activeChannelConfig = channels.find(c => c.id === configuringChannelId);

  const activeTemplateEvent = editingTemplate
    ? events.find(e => e.id === editingTemplate.eventId)
    : null;
  const activeTemplate = activeTemplateEvent && editingTemplate
    ? activeTemplateEvent.templates[editingTemplate.channelId as keyof typeof activeTemplateEvent.templates]
    : undefined;

  return (
    <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
      {/* Channels Configuration */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Kênh thông báo</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các kênh gửi thông báo đến khách hàng và nhân viên.
          </p>
        </div>
        <NotificationChannels
          channels={channels}
          onConfigure={setConfiguringChannelId}
        />
      </div>

      <Separator />

      {/* Events Configuration */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Sự kiện & Mẫu tin</h3>
          <p className="text-sm text-muted-foreground">
            Cấu hình loại thông báo và nội dung tin nhắn cho từng sự kiện.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Danh sách sự kiện</CardTitle>
                <CardDescription>Bật/tắt các kênh thông báo cho từng loại sự kiện.</CardDescription>
            </CardHeader>
            <CardContent>
                <NotificationList
                events={events}
                onToggleChannel={handleToggleChannel}
                onEditTemplate={(eventId, channelId) => setEditingTemplate({ eventId, channelId })}
                />
            </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      {activeChannelConfig && (
        <ChannelConfigDialog
            isOpen={!!configuringChannelId}
            onOpenChange={(open) => !open && setConfiguringChannelId(null)}
            channel={activeChannelConfig}
            onSave={(channelId, config) => handleSaveChannelConfig(channelId, config)}
        />
      )}

      {editingTemplate && activeTemplate && activeTemplateEvent && (
        <TemplateEditor
            isOpen={!!editingTemplate}
            onOpenChange={(open) => !open && setEditingTemplate(null)}
            title={`${activeTemplateEvent.name} - ${editingTemplate.channelId.toUpperCase()}`}
            template={activeTemplate}
            onSave={(template) => handleSaveTemplate(activeTemplateEvent.id, editingTemplate.channelId, template)}
        />
      )}
    </div>
  );
}
