import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input"; // Using standard Input for now, can upgrade to InputWithIcon if needed
import { ScrollArea } from "@/shared/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Search } from "lucide-react";
import { Conversation } from '../types';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function ChatSidebar({ conversations, selectedId, onSelect, className }: ChatSidebarProps) {
  return (
    <div className={cn("flex flex-col w-96 h-full border-r border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl md:rounded-r-none md:rounded-l-2xl glass-card", className)}>
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-serif font-semibold mb-4 text-primary">Tin nhắn</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            className="pl-9 bg-white dark:bg-card border-border/50 rounded-xl focus-visible:ring-primary/20 h-10"
          />
        </div>
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
                  "flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left w-full group relative",
                  isSelected
                    ? "bg-primary/5 border border-primary/20 shadow-sm"
                    : "hover:bg-accent/50 hover:border-accent border border-transparent"
                )}
               >
                 <div className="relative">
                   <Avatar className="h-10 w-10 border border-border">
                     <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                     <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                   </Avatar>
                   {conv.user.status === 'online' && (
                     <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-card" />
                   )}
                 </div>

                 <div className={cn("flex-1 min-w-0", conv.unreadCount > 0 ? "pr-8" : "pr-2")}>
                   <div className="flex justify-between items-start mb-1">
                     <span className={cn("font-medium text-sm truncate", isSelected ? "text-primary font-semibold" : "text-foreground")}>
                       {conv.user.name}
                     </span>
                     <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                       {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true, locale: vi })}
                     </span>
                   </div>

                   <p className={cn("text-xs line-clamp-2 break-words text-left", isSelected ? "text-foreground" : "text-muted-foreground")}>
                     {conv.lastMessage.senderId === 'me' ? 'Bạn: ' : ''}
                     {conv.lastMessage.content}
                   </p>

                   {conv.tags && conv.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {conv.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 h-5 font-normal bg-secondary/50 text-secondary-foreground border-transparent">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                   )}
                 </div>

                 {conv.unreadCount > 0 && (
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow-sm animate-scale-in">
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
