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
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import { MockService } from "../../model/mocks";

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
            "h-auto min-h-[2.5rem] w-full justify-between px-3 py-2",
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-1 overflow-x-hidden">
            {selectedServices.length > 0 ? (
              selectedServices.map((service) => (
                <Badge
                  key={service.id}
                  variant="secondary"
                  className="mr-1 gap-1 pr-1 font-normal last:mr-0"
                >
                  {service.name}
                  <div
                    className="hover:bg-muted cursor-pointer rounded-full p-0.5"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSelect(service.id);
                        e.preventDefault(); // Prevent default action for Enter key
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => handleRemove(e, service.id)}
                  >
                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                  </div>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground font-normal">
                Chọn phương pháp trị liệu...
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
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
                    <span className="text-muted-foreground text-xs">
                      {service.duration} phút •{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(service.price)}
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
