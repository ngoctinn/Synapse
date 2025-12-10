import { Badge } from "@/shared/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ChannelStatusBadgeProps {
  isConnected: boolean;
  className?: string;
}

export function ChannelStatusBadge({ isConnected, className }: ChannelStatusBadgeProps) {
  return (
    <Badge
      variant={isConnected ? "outline" : "secondary"}
      className={cn(
        "transition-colors duration-300",
        isConnected
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "text-muted-foreground",
        className
      )}
    >
      {isConnected ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã kết nối
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3 mr-1" />
          Chưa kết nối
        </>
      )}
    </Badge>
  );
}
