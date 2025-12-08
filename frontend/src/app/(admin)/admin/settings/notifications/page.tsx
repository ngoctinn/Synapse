"use client";

import { useState } from "react";
import {
  NotificationChannel,
  NotificationEvent,
  MOCK_CHANNELS,
  MOCK_EVENTS,
  NotificationChannels,
  NotificationList,
  TemplateEditor,
  ChannelConfigDialog,
  NotificationTemplate
} from "@/features/settings/notifications";
import { Separator } from "@/shared/ui/separator";

export default function NotificationSettingsPage() {
  const [channels, setChannels] = useState<NotificationChannel[]>(MOCK_CHANNELS);
  const [events, setEvents] = useState<NotificationEvent[]>(MOCK_EVENTS);
  
  // State for Channel Config Dialog
  const [configChannelId, setConfigChannelId] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // State for Template Editor
  const [editingTemplate, setEditingTemplate] = useState<{
    eventId: string;
    channelId: string;
    template: NotificationTemplate;
  } | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Handlers
  const handleConfigureChannel = (channelId: string) => {
    setConfigChannelId(channelId);
    setIsConfigOpen(true);
  };

  const handleSaveChannelConfig = (channelId: string, newConfig: any) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId ? { ...ch, config: newConfig, isConnected: true } : ch
      )
    );
  };

  const handleToggleChannel = (eventId: string, channelId: string, value: boolean) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          // Check if channel is connected? Maybe optional logic.
          return {
            ...evt,
            channels: { ...evt.channels, [channelId]: value },
          };
        }
        return evt;
      })
    );
  };

  const handleEditTemplate = (eventId: string, channelId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    // Type casting logic for channelId key
    const cId = channelId as keyof typeof event.templates;
    const existingTemplate = event.templates[cId];
    
    // Create default if not exists
    const templateToEdit: NotificationTemplate = existingTemplate || {
      content: "",
      variables: ["customer_name", "time"], // Default variables
    };

    setEditingTemplate({
      eventId,
      channelId,
      template: templateToEdit,
    });
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = (newTemplate: NotificationTemplate) => {
    if (!editingTemplate) return;

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === editingTemplate.eventId) {
          return {
            ...evt,
            templates: {
              ...evt.templates,
              [editingTemplate.channelId]: newTemplate,
            },
          };
        }
        return evt;
      })
    );
    setIsEditorOpen(false);
  };

  const activeChannelForConfig = channels.find(c => c.id === configChannelId);
  const editorTitle = editingTemplate 
    ? `${events.find(e => e.id === editingTemplate.eventId)?.name} - ${channels.find(c => c.id === editingTemplate.channelId)?.name}` 
    : "";

  return (
    <div className="space-y-6 container mx-auto py-6 md:py-10 max-w-5xl px-4 md:px-8">

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">1. Kênh Gửi Tin (Channels)</h3>
        <NotificationChannels 
          channels={channels} 
          onConfigure={handleConfigureChannel} 
        />
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">2. Sự kiện & Mẫu tin (Triggers)</h3>
        <NotificationList 
          events={events}
          onToggleChannel={handleToggleChannel}
          onEditTemplate={handleEditTemplate}
        />
      </section>

      {/* Dialogs */}
      <ChannelConfigDialog
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        channel={activeChannelForConfig}
        onSave={handleSaveChannelConfig}
      />

      <TemplateEditor
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        title={editorTitle}
        template={editingTemplate?.template}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}
