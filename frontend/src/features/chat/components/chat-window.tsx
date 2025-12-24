import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  ChevronLeft,
  MessageSquareDashed,
  MoreHorizontal,
  Phone,
  Video,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Conversation, Message } from "../model/types";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";

interface ChatWindowProps {
  conversation?: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack?: () => void; // New prop for mobile navigation
  className?: string;
}

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  className,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom directly without complex checks
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div
        className={cn(
          "dark:bg-card/30 glass-card flex h-full w-full flex-col items-center justify-center rounded-r-lg bg-white/30 p-8 text-center backdrop-blur-sm",
          className
        )}
      >
        <div className="bg-primary/5 animate-pulse-subtle mb-6 flex h-24 w-24 items-center justify-center rounded-full">
          <MessageSquareDashed className="text-primary/50 h-10 w-10" />
        </div>
        <h3 className="text-foreground mb-3 font-serif text-2xl font-semibold">
          Synapse Chat
        </h3>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu tư vấn và
          chăm sóc khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "dark:bg-card/50 glass-card flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-white/50 backdrop-blur-sm md:rounded-l-none md:rounded-r-lg",
        className
      )}
    >
      {/* Header */}
      <div className="border-border/50 dark:bg-card/50 z-10 flex h-[72px] items-center justify-between border-b bg-white/50 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Back Button for Mobile */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-primary -ml-2 md:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <Avatar className="border-border h-9 w-9 border shadow-sm">
            <AvatarImage
              src={conversation.user.avatar}
              alt={conversation.user.name}
            />
            <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              {conversation.user.name}
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  conversation.user.status === "online"
                    ? "indicator-online"
                    : "indicator-offline"
                )}
              />
            </h3>
            <p className="text-muted-foreground text-xs">
              Khách hàng{" "}
              {conversation.user.role === "customer" ? "Thân thiết" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Gọi điện">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Video call">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Xem thêm tùy chọn">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-transparent to-white/20 dark:to-black/20">
        <ScrollArea ref={scrollRef} className="h-full w-full p-4">
          <div className="flex min-h-full flex-col justify-end pb-2">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isMe={message.senderId === currentUserId}
                senderName={
                  message.senderId === currentUserId
                    ? "Tôi"
                    : conversation.user.name
                }
                senderAvatar={
                  message.senderId === currentUserId
                    ? undefined
                    : conversation.user.avatar
                }
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
