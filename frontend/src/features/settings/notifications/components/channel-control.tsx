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
            className="h-8 w-8 text-muted-foreground hover:text-primary"
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
    <div className="flex flex-col items-center gap-2 min-h-[60px] justify-center">
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
            className="h-6 text-xs text-muted-foreground hover:text-primary animate-fade-zoom"
            onClick={onEdit}
          >
            <Edit2 className="h-3 w-3 mr-1" />
            Mẫu tin
          </Button>
        )}
      </div>
    </div>
  );
}
