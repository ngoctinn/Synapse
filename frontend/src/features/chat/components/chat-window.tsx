import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { ChevronLeft, MessageSquareDashed, MoreHorizontal, Phone, Video } from "lucide-react";
import { useEffect, useRef } from 'react';
import { Conversation, Message } from '../model/types';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';

interface ChatWindowProps {
  conversation?: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack?: () => void; // New prop for mobile navigation
  className?: string;
}

export function ChatWindow({ conversation, messages, currentUserId, onSendMessage, onBack, className }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom directly without complex checks
  useEffect(() => {
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full w-full bg-white/30 dark:bg-card/30 backdrop-blur-sm rounded-r-2xl glass-card text-center p-8", className)}>
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse-subtle">
           <MessageSquareDashed className="w-10 h-10 text-primary/50" />
        </div>
        <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">Synapse Chat</h3>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu tư vấn và chăm sóc khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col flex-1 h-full bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl md:rounded-l-none md:rounded-r-2xl glass-card overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-md z-10 h-[72px]">
        <div className="flex items-center gap-3">
            {/* Back Button for Mobile */}
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="md:hidden -ml-2 text-muted-foreground hover:text-primary"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            <Avatar className="h-10 w-10 border border-border shadow-sm">
              <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
              <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2">
                {conversation.user.name}
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  conversation.user.status === 'online' ? "indicator-online" : "indicator-offline"
                )} />
              </h3>
              <p className="text-xs text-muted-foreground">Khách hàng {conversation.user.role === 'customer' ? 'Thân thiết' : ''}</p>
            </div>
        </div>
        <div className="flex items-center gap-1">
           <Button variant="ghost" size="icon" aria-label="Gọi điện">
             <Phone className="w-4 h-4" />
           </Button>
           <Button variant="ghost" size="icon" aria-label="Video call">
             <Video className="w-4 h-4" />
           </Button>
           <Button variant="ghost" size="icon" aria-label="Xem thêm tùy chọn">
             <MoreHorizontal className="w-4 h-4" />
           </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-transparent to-white/20 dark:to-black/20">
         <ScrollArea ref={scrollRef} className="h-full w-full p-4">
            <div className="flex flex-col justify-end min-h-full pb-2">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isMe={message.senderId === currentUserId}
                  senderName={message.senderId === currentUserId ? 'Tôi' : conversation.user.name}
                  senderAvatar={message.senderId === currentUserId ? undefined : conversation.user.avatar}
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
