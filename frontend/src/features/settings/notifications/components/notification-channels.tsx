"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

import { Button } from "@/shared/ui/button";
import { MessageCircle, Smartphone, Mail, Settings2 } from "lucide-react";
import { NotificationChannel } from "../types";
import { cn } from "@/shared/lib/utils";
import { ChannelStatusBadge } from "./channel-status-badge";

interface NotificationChannelsProps {
  channels: NotificationChannel[];
  onConfigure: (channelId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  "message-circle": <MessageCircle className="h-6 w-6" />,
  "smartphone": <Smartphone className="h-6 w-6" />,
  "mail": <Mail className="h-6 w-6" />,
};

export function NotificationChannels({ channels, onConfigure }: NotificationChannelsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {channels.map((channel) => (
        <Card key={channel.id} className="relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md group">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <span className="p-2 bg-muted rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                {iconMap[channel.icon] || <Settings2 className="h-6 w-6" />}
              </span>
              {channel.name}
            </CardTitle>
            <ChannelStatusBadge isConnected={channel.isConnected} />
          </CardHeader>
          <CardContent>
            <CardDescription className="min-h-[40px] mb-4 text-sm leading-relaxed">
              {channel.description}
            </CardDescription>
            <Button 
              variant="outline" 
              className="w-full group-hover:border-primary/50 transition-colors" 
              onClick={() => onConfigure(channel.id)}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Cấu hình
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
