import { Badge } from "@/shared/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ChannelStatusBadgeProps {
  isConnected: boolean;
}

export function ChannelStatusBadge({ isConnected }: ChannelStatusBadgeProps) {
  return (
    <Badge preset={isConnected ? "channel-connected" : "channel-disconnected"}>
      {isConnected ? (
        <CheckCircle className="size-3" />
      ) : (
        <XCircle className="size-3" />
      )}
    </Badge>
  );
}
