import { Switch } from "@/shared/ui/switch";
import { Button } from "@/shared/ui/button";
import { Edit2 } from "lucide-react";

interface ChannelControlProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onEdit: () => void;
  variant?: "mobile" | "desktop";
  ariaLabel?: string;
}

export function ChannelControl({
  checked,
  onCheckedChange,
  onEdit,
  variant = "desktop",
  ariaLabel,
}: ChannelControlProps) {
  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2">
        {checked && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-8 w-8"
            onClick={onEdit}
            aria-label={`Edit template for ${ariaLabel}`}
          >
            <Edit2 className="size-4" />
          </Button>
        )}
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={`Toggle ${ariaLabel}`}
        />
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="flex min-h-[60px] flex-col items-center justify-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={`Toggle ${ariaLabel}`}
      />
      <div className="h-6">
        {checked && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary animate-fade-zoom h-6 text-xs"
            onClick={onEdit}
          >
            <Edit2 className="h-3 w-3" />
            Mẫu tin
          </Button>
        )}
      </div>
    </div>
  );
}
