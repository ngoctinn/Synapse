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
      variant={isConnected ? "success" : "secondary"}
      className={cn("transition-colors duration-300", className)}
    >
      {isConnected ? (
        <>
          <CheckCircle className="size-3 mr-1" />
          Đã kết nối
        </>
      ) : (
        <>
          <XCircle className="size-3 mr-1" />
          Chưa kết nối
        </>
      )}
    </Badge>
  );
}
