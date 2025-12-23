import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Message } from "../model/types";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export function MessageBubble({
  message,
  isMe,
  senderName,
  senderAvatar,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "animate-fade-in mb-4 flex w-full gap-3",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {!isMe && (
        <Avatar className="border-border mt-1 h-8 w-8 border shadow-sm">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback>{senderName?.[0]}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex max-w-[85%] flex-col",
          isMe ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "group relative rounded-2xl p-3 text-sm shadow-sm transition-all duration-200 hover:shadow-md",
            isMe
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "dark:bg-card border-border text-foreground glass-card rounded-tl-sm border bg-white"
          )}
        >
          {message.content}
        </div>

        <span className="text-muted-foreground mt-1 px-1 text-[10px]">
          {format(new Date(message.timestamp), "HH:mm", { locale: vi })}
          {isMe && (
            <span className="ml-1">
              {message.status === "read" ? "• Đã xem" : ""}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
