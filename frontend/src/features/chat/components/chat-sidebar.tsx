import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Search } from "lucide-react";
import { Conversation } from "../model/types";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function ChatSidebar({
  conversations,
  selectedId,
  onSelect,
  className,
}: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "border-border/50 dark:bg-card/50 glass-card flex h-full w-96 flex-col rounded-lg border-r bg-white/50 backdrop-blur-sm md:rounded-l-lg md:rounded-r-none",
        className
      )}
    >
      <div className="border-border/50 border-b p-4">
        <h2 className="text-primary mb-4 font-serif text-lg font-semibold">
          Tin nhắn
        </h2>
        <Input
          startContent={<Search className="text-muted-foreground h-4 w-4" />}
          placeholder="Tìm kiếm khách hàng..."
        />
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="flex flex-col gap-2">
          {conversations.map((conv) => {
            const isSelected = conv.id === selectedId;
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "group relative flex w-full cursor-pointer items-start gap-3 rounded-lg p-3 text-left transition-all duration-200",
                  isSelected
                    ? "bg-primary/5 border-primary/20 border shadow-sm"
                    : "hover:bg-accent/50 hover:border-accent border border-transparent"
                )}
              >
                <div className="relative">
                  <Avatar className="border-border h-9 w-9 border">
                    <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                    <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {conv.user.status === "online" && (
                    <span className="dark:border-card absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>

                <div
                  className={cn(
                    "min-w-0 flex-1",
                    conv.unreadCount > 0 ? "pr-8" : "pr-2"
                  )}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        isSelected
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      )}
                    >
                      {conv.user.name}
                    </span>
                    <span className="text-muted-foreground ml-2 shrink-0 text-[10px]">
                      {formatDistanceToNow(new Date(conv.updatedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>

                  <p
                    className={cn(
                      "line-clamp-2 break-words text-left text-xs",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {conv.lastMessage.senderId === "me" ? "Bạn: " : ""}
                    {conv.lastMessage.content}
                  </p>

                  {conv.tags && conv.tags.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {conv.tags.map((tag) => (
                        <Badge key={tag} variant="indigo" size="xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {conv.unreadCount > 0 && (
                  <div className="bg-primary text-primary-foreground animate-scale-in absolute right-3 top-1/2 flex h-5 min-w-[20px] -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-[10px] font-bold shadow-sm">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
