"use client"

import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/ui/input"
import { Search, X } from "lucide-react"
import * as React from "react"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onSearch, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "")
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      onChange?.(e)
      onSearch?.(e.target.value)
    }

    const handleClear = () => {
      setInternalValue("")
      if (inputRef.current) {
        // Trigger a native change event for compatibility with react-hook-form etc.
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set
        nativeInputValueSetter?.call(inputRef.current, "")

        const event = new Event("input", { bubbles: true })
        inputRef.current.dispatchEvent(event)
      }
      // Also manually call handlers if needed
      onSearch?.("")
      inputRef.current?.focus()
    }

    return (
      <div className="relative flex items-center w-full max-w-sm group">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
        <Input
          ref={inputRef}
          type="text"
          className={cn(
            "pl-9 pr-9 transition-all duration-200 shadow-sm hover:shadow-md focus-visible:shadow-md",
            "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
            className
          )}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          {...props}
        />
        {internalValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
        {!internalValue && (
           <div className="absolute right-3 pointer-events-none hidden sm:flex items-center gap-1">
             <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
               <span className="text-xs">⌘</span>K
             </kbd>
           </div>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"
