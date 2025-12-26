import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Paperclip, Send, Smile } from "lucide-react";
import React, { useRef, useState } from "react";

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
    <div className="border-border dark:bg-card/50 rounded-b-lg border-t bg-white/50 p-4 backdrop-blur-sm">
      <div className="focus-within:ring-primary/20 focus-within:bg-background/80 group flex items-end gap-2 rounded-lg p-1 transition-all duration-200 focus-within:ring-[1.5px]">
        <Button variant="ghost" size="icon" aria-label="Đính kèm file">
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Nhập tin nhắn tư vấn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "max-h-[120px] min-h-[44px] resize-none rounded-lg py-3 pr-10",
              "border-none bg-transparent px-0 shadow-none focus-visible:ring-0", // Clean style to merge with parent
              "placeholder:text-muted-foreground/50"
            )}
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1 h-7 w-7"
            aria-label="Chọn emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleSend}
          disabled={!content.trim()}
          aria-label="Gửi tin nhắn"
          className={cn(
            "mb-0.5 h-9 w-9 rounded-full shadow-md transition-all duration-200",
            content.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
          )}
        >
          <Send className="ml-0.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
