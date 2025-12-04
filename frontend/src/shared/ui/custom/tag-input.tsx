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
    CommandList
} from "@/shared/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

export interface TagOption {
  id: string;
  label: string;
}

interface TagInputProps {
  options: TagOption[];
  selectedIds: string[];
  newTags: string[];
  onSelectedChange: (ids: string[]) => void;
  onNewTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

import { AnimatePresence, motion } from "framer-motion";

export function TagInput({
  options,
  selectedIds,
  newTags,
  onSelectedChange,
  onNewTagsChange,
  placeholder = "Chọn thẻ...",
  className,
}: TagInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectedChange([...selectedIds, id]);
    }
    setInputValue(""); // Clear input after selection
  };

  const handleCreateNew = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !newTags.includes(trimmed)) {
      // Check if it matches an existing option case-insensitively
      const existing = options.find(
        (opt) => opt.label.toLowerCase() === trimmed.toLowerCase()
      );

      if (existing) {
        handleSelect(existing.id);
      } else {
        onNewTagsChange([...newTags, trimmed]);
      }
    }
    setInputValue("");
  };

  const removeNewTag = (tag: string) => {
    onNewTagsChange(newTags.filter((t) => t !== tag));
  };

  const removeSelectedId = (id: string) => {
    onSelectedChange(selectedIds.filter((i) => i !== id));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 max-h-32 overflow-y-auto py-2 px-3 text-left font-normal hover:bg-background transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1.5">
              {selectedOptions.length === 0 && newTags.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <AnimatePresence mode="popLayout">
                {selectedOptions.map((opt) => (
                  <motion.div
                    key={opt.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Badge variant="secondary" className="mr-0 mb-0 gap-1 pr-1 pl-2.5 py-1 rounded-full bg-secondary/50 hover:bg-secondary/70 transition-colors border-transparent">
                      {opt.label}
                      <div
                        className="rounded-full hover:bg-black/10 dark:hover:bg-white/20 p-0.5 cursor-pointer ml-1 transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeSelectedId(opt.id);
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </div>
                    </Badge>
                  </motion.div>
                ))}
                {newTags.map((tag) => (
                  <motion.div
                    key={tag}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Badge variant="outline" className="mr-0 mb-0 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 gap-1 pr-1 pl-2.5 py-1 rounded-full">
                      + {tag}
                      <div
                        className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 p-0.5 cursor-pointer ml-1 transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeNewTag(tag);
                        }}
                      >
                        <X className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
                placeholder="Tìm kiếm hoặc thêm mới..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateNew();
                    }
                }}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue.trim() ? (
                    <div className="p-2 cursor-pointer hover:bg-slate-100" onClick={handleCreateNew}>
                        <span className="text-sm text-muted-foreground">Tạo mới:</span> <span className="font-medium text-blue-600">"{inputValue}"</span>
                    </div>
                ) : "Không tìm thấy kết quả."}
              </CommandEmpty>
              <CommandGroup heading="Có sẵn">
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => handleSelect(option.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(option.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags Display (Optional: if we want to show them outside the input too, but inside is better for space) */}
    </div>
  );
}
