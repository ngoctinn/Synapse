"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import { MockService } from "../../mock-data";

interface MultiServiceSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  availableServices: MockService[];
  className?: string;
}

export function MultiServiceSelector({
  selectedIds,
  onChange,
  availableServices,
  className,
}: MultiServiceSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Derive selected services objects
  const selectedServices = React.useMemo(() => {
    return availableServices.filter((s) => selectedIds.includes(s.id));
  }, [availableServices, selectedIds]);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedIds.filter((item) => item !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-[2.5rem] h-auto px-3 py-2",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center overflow-x-hidden">
            {selectedServices.length > 0 ? (
              selectedServices.map((service) => (
                <Badge
                  key={service.id}
                  variant="secondary"
                  className="mr-1 last:mr-0 gap-1 pr-1 font-normal"
                >
                  {service.name}
                  <div
                    className="rounded-full hover:bg-muted p-0.5 cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(e as any, service.id);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => handleRemove(e, service.id)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </div>
                </Badge>
              ))
            ) : (
                <span className="text-muted-foreground font-normal">Chọn phương pháp trị liệu...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm dịch vụ..." />
          <CommandList>
              <CommandEmpty>Không tìm thấy dịch vụ.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {availableServices.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={service.name}
                    onSelect={() => handleSelect(service.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        selectedIds.includes(service.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                        <span>{service.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {service.duration} phút • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                        </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
