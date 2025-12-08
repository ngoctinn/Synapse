"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Switch } from "@/shared/ui/switch";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Edit2 } from "lucide-react";
import { NotificationEvent } from "../types";
import { cn } from "@/shared/lib/utils";

interface NotificationListProps {
  events: NotificationEvent[];
  onToggleChannel: (eventId: string, channelId: string, value: boolean) => void;
  onEditTemplate: (eventId: string, channelId: string) => void;
}

export function NotificationList({ events, onToggleChannel, onEditTemplate }: NotificationListProps) {
  // Group events by group
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.group]) {
      acc[event.group] = [];
    }
    acc[event.group].push(event);
    return acc;
  }, {} as Record<string, NotificationEvent[]>);

  const groupLabels: Record<string, string> = {
    customer: "Khách hàng",
    staff: "Nhân viên & Hệ thống",
  };

  const channels = (['zalo', 'sms', 'email'] as const);

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([group, groupEvents]) => (
        <div key={group} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">
              {groupLabels[group] || group}
            </h3>
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {groupEvents.length}
            </Badge>
          </div>
          
          {/* Mobile View (Cards) */}
          <div className="grid gap-4 md:hidden">
            {groupEvents.map((event) => (
              <div key={event.id} className="rounded-lg border bg-card p-4 shadow-sm hover:border-primary/50 transition-colors">
                <div className="flex flex-col gap-2 mb-4">
                  <span className="font-medium text-base">{event.name}</span>
                  <span className="text-sm text-muted-foreground">{event.description}</span>
                </div>
                
                <div className="space-y-3">
                  {channels.map((channelId) => (
                    <div key={channelId} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <span className="text-sm font-medium capitalize">{channelId}</span>
                      <div className="flex items-center gap-2">
                         {event.channels[channelId] && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => onEditTemplate(event.id, channelId)}
                              aria-label={`Edit ${channelId} template for ${event.name}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                        <Switch
                          checked={event.channels[channelId]}
                          onCheckedChange={(checked) =>
                            onToggleChannel(event.id, channelId, checked)
                          }
                          aria-label={`Toggle ${channelId} for ${event.name}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table) */}
          <div className="hidden md:block rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40%]">Sự kiện</TableHead>
                  <TableHead className="text-center w-[20%]">Zalo</TableHead>
                  <TableHead className="text-center w-[20%]">SMS</TableHead>
                  <TableHead className="text-center w-[20%]">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </span>
                      </div>
                    </TableCell>
                    {channels.map((channelId) => (
                      <TableCell key={channelId} className="text-center">
                        <div className="flex flex-col items-center gap-2 min-h-[60px] justify-center">
                          <Switch
                            checked={event.channels[channelId]}
                            onCheckedChange={(checked) =>
                              onToggleChannel(event.id, channelId, checked)
                            }
                            aria-label={`Toggle ${channelId} for ${event.name}`}
                          />
                          <div className="h-6">
                          {event.channels[channelId] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-muted-foreground hover:text-primary animate-in fade-in zoom-in duration-200"
                              onClick={() => onEditTemplate(event.id, channelId)}
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Mẫu tin
                            </Button>
                          )}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}
