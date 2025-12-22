import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Message } from '../model/types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export function MessageBubble({ message, isMe, senderName, senderAvatar }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full gap-3 mb-4 animate-fade-in", isMe ? "justify-end" : "justify-start")}>
      {!isMe && (
        <Avatar className="h-8 w-8 mt-1 border border-border shadow-sm">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback>{senderName?.[0]}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[85%]", isMe ? "items-end" : "items-start")}>
        <div
          className={cn(
            "p-3 rounded-2xl shadow-sm text-sm relative group transition-all duration-200 hover:shadow-md",
            isMe
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-white dark:bg-card border border-border text-foreground rounded-tl-sm glass-card"
          )}
        >
          {message.content}
        </div>

        <span className="text-[10px] text-muted-foreground mt-1 px-1">
          {format(new Date(message.timestamp), "HH:mm", { locale: vi })}
          {isMe && (
             <span className="ml-1">
               {message.status === 'read' ? '• Đã xem' : ''}
             </span>
          )}
        </span>
      </div>
    </div>
  );
}
