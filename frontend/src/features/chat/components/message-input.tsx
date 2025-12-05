import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Paperclip, Send, Smile } from "lucide-react";
import React, { useRef, useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (content.trim()) {
      onSendMessage(content);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-b-xl">
      <div className="flex items-end gap-2 group p-1 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-background/80 transition-all duration-200">
        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors mb-0.5" aria-label="Đính kèm file">
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Nhập tin nhắn tư vấn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
               "min-h-[44px] max-h-[120px] py-3 pr-10 resize-none rounded-xl",
               "bg-transparent border-none focus-visible:ring-0 shadow-none px-0", // Clean style to merge with parent
               "placeholder:text-muted-foreground/50"
            )}
            rows={1}
          />
           <Button variant="ghost" size="icon" className="absolute right-0 top-1 h-8 w-8 text-muted-foreground hover:text-primary rounded-full" aria-label="Chọn emoji">
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleSend}
          disabled={!content.trim()}
          aria-label="Gửi tin nhắn"
          className={cn(
            "h-10 w-10 rounded-full shadow-md transition-all duration-200 mb-0.5",
            content.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
              : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
