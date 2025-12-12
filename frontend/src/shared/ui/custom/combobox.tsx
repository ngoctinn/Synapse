"use client"

import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  onSearch?: (term: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  isLoading?: boolean
  className?: string
  modal?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  onSearch,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  disabled = false,
  isLoading = false,
  className,
  modal = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    if (open && onSearch) {
      // Allow parent to handle debouncing if needed, or implement debounce here
      onSearch(searchQuery)
    }
  }, [searchQuery, open, onSearch])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background font-normal", className)}
          disabled={disabled}
        >
          {selectedOption ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={!onSearch}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
               <div className="py-6 text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Đang tải...
               </div>
            ) : (
                <>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                    {options.map((option) => (
                        <CommandItem
                        key={option.value}
                        value={option.label} // Use label for command value to filter correctly by label if local filter
                        onSelect={() => {
                            onChange(option.value === value ? "" : option.value) // Toggle selection? Or usually just select. Let's just select.
                            // If we want toggle behavior: onChange(currentValue === value ? "" : currentValue)
                            // But for standard combobox, usually just select new value.
                            // Actually shadcn example does: currentValue === value ? "" : currentValue
                            // Let's assume simple select for now for forms.
                            onChange(option.value)
                            setOpen(false)
                        }}
                        disabled={option.disabled}
                        >
                        <Check
                            className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                        <div className="flex flex-col">
                             <span>{option.label}</span>
                             {option.description && (
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                             )}
                        </div>
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
