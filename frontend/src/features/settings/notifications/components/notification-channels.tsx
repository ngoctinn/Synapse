"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

import { Button } from "@/shared/ui/button";
import { Mail, MessageCircle, Settings2, Smartphone } from "lucide-react";
import { NotificationChannel } from "../model/types";
import { ChannelStatusBadge } from "./channel-status-badge";

interface NotificationChannelsProps {
  channels: NotificationChannel[];
  onConfigure: (channelId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  "message-circle": <MessageCircle className="h-6 w-6" />,
  smartphone: <Smartphone className="h-6 w-6" />,
  mail: <Mail className="h-6 w-6" />,
};

export function NotificationChannels({
  channels,
  onConfigure,
}: NotificationChannelsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {channels.map((channel) => (
        <Card
          key={channel.id}
          className="hover:border-primary/50 group relative overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <span className="bg-muted group-hover:bg-primary/10 group-hover:text-primary rounded-full p-2 transition-colors duration-300">
                {iconMap[channel.icon] || <Settings2 className="h-6 w-6" />}
              </span>
              {channel.name}
            </CardTitle>
            <ChannelStatusBadge isConnected={channel.isConnected} />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4 min-h-[40px] text-sm leading-relaxed">
              {channel.description}
            </CardDescription>
            <Button
              variant="outline"
              className="group-hover:border-primary/50 w-full transition-colors"
              onClick={() => onConfigure(channel.id)}
            >
              <Settings2 className="size-4" />
              Cấu hình
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
