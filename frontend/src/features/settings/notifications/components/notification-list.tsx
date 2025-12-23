"use client";

import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { NotificationEvent } from "../model/types";
import { ChannelControl } from "./channel-control";

interface NotificationListProps {
  events: NotificationEvent[];
  onToggleChannel: (eventId: string, channelId: string, value: boolean) => void;
  onEditTemplate: (eventId: string, channelId: string) => void;
}

export function NotificationList({
  events,
  onToggleChannel,
  onEditTemplate,
}: NotificationListProps) {
  // Group events by group
  const groupedEvents = events.reduce(
    (acc, event) => {
      if (!acc[event.group]) {
        acc[event.group] = [];
      }
      acc[event.group].push(event);
      return acc;
    },
    {} as Record<string, NotificationEvent[]>
  );

  const groupLabels: Record<string, string> = {
    customer: "Khách hàng",
    staff: "Nhân viên & Hệ thống",
  };

  const channels = ["zalo", "sms", "email"] as const;

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([group, groupEvents]) => (
        <div key={group} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">
              {groupLabels[group] || group}
            </h3>
            <Badge preset="count">{groupEvents.length}</Badge>
          </div>

          {/* Mobile View (Cards) */}
          <div className="grid gap-4 md:hidden">
            {groupEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card hover:border-primary/50 rounded-lg border p-4 shadow-sm transition-colors"
              >
                <div className="mb-4 flex flex-col gap-2">
                  <span className="text-base font-medium">{event.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {event.description}
                  </span>
                </div>

                <div className="space-y-3">
                  {channels.map((channelId) => (
                    <div
                      key={channelId}
                      className="bg-muted/50 flex items-center justify-between rounded-md p-2"
                    >
                      <span className="text-sm font-medium capitalize">
                        {channelId}
                      </span>
                      <ChannelControl
                        variant="mobile"
                        checked={event.channels[channelId]}
                        onCheckedChange={(checked) =>
                          onToggleChannel(event.id, channelId, checked)
                        }
                        onEdit={() => onEditTemplate(event.id, channelId)}
                        ariaLabel={`${channelId} for ${event.name}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table) */}
          <div className="bg-card hidden overflow-hidden rounded-md border md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40%]">Sự kiện</TableHead>
                  <TableHead className="w-[20%] text-center">Zalo</TableHead>
                  <TableHead className="w-[20%] text-center">SMS</TableHead>
                  <TableHead className="w-[20%] text-center">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupEvents.map((event) => (
                  <TableRow
                    key={event.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-muted-foreground line-clamp-2 text-sm">
                          {event.description}
                        </span>
                      </div>
                    </TableCell>
                    {channels.map((channelId) => (
                      <TableCell key={channelId} className="text-center">
                        <ChannelControl
                          checked={event.channels[channelId]}
                          onCheckedChange={(checked) =>
                            onToggleChannel(event.id, channelId, checked)
                          }
                          onEdit={() => onEditTemplate(event.id, channelId)}
                          ariaLabel={`${channelId} for ${event.name}`}
                        />
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
