"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { PartyPopper, Settings2, Wrench } from "lucide-react";

interface ExceptionsFilterBarProps {
  statusFilter: 'all' | 'closed' | 'open';
  setStatusFilter: (status: 'all' | 'closed' | 'open') => void;
  selectedTypes: string[];
  toggleTypeFilter: (type: string) => void;
}

export function ExceptionsFilterBar({
  statusFilter,
  setStatusFilter,
  selectedTypes,
  toggleTypeFilter,
}: ExceptionsFilterBarProps) {
  return (
    <motion.div 
      layout
      className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 scrollbar-hide mask-fade-right sm:mask-none"
    >
      {/* Status Group */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50 shrink-0">
        <button
          onClick={() => setStatusFilter('all')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 relative",
            statusFilter === 'all' 
              ? "bg-background shadow-sm text-foreground ring-1 ring-black/5" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          Tất cả
        </button>
        <button
          onClick={() => setStatusFilter('closed')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 relative",
            statusFilter === 'closed' 
              ? "bg-destructive/10 text-destructive shadow-sm ring-1 ring-destructive/20" 
              : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          )}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full bg-destructive transition-all duration-300", statusFilter === 'closed' && "scale-125")} />
          Đóng cửa
        </button>
        <button
          onClick={() => setStatusFilter('open')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 relative",
            statusFilter === 'open' 
              ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          )}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300", statusFilter === 'open' && "scale-125")} />
          Mở cửa
        </button>
      </div>

      <div className="h-6 w-px bg-border mx-1 shrink-0" />

      {/* Type Group */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => toggleTypeFilter('holiday')}
          className={cn(
            "flex items-center gap-1.5 px-3 h-8 rounded-full border transition-all duration-200",
            selectedTypes.includes('holiday')
              ? "bg-destructive/20 border-destructive ring-1 ring-destructive/30 shadow-sm" 
              : "bg-destructive/5 border-destructive/20 hover:bg-destructive/10",
             selectedTypes.length > 0 && !selectedTypes.includes('holiday') && "opacity-50 grayscale"
          )}
        >
          <PartyPopper className={cn("w-3.5 h-3.5", selectedTypes.includes('holiday') ? "text-destructive" : "text-destructive/70")} />
          <span className={cn("text-xs font-medium", selectedTypes.includes('holiday') ? "text-destructive" : "text-destructive/70")}>Ngày lễ</span>
        </button>

        <button
          onClick={() => toggleTypeFilter('custom')}
          className={cn(
            "flex items-center gap-1.5 px-3 h-8 rounded-full border transition-all duration-200",
            selectedTypes.includes('custom')
              ? "bg-primary/20 border-primary ring-1 ring-primary/30 shadow-sm" 
              : "bg-primary/5 border-primary/20 hover:bg-primary/10",
             selectedTypes.length > 0 && !selectedTypes.includes('custom') && "opacity-50 grayscale"
          )}
        >
          <Settings2 className={cn("w-3.5 h-3.5", selectedTypes.includes('custom') ? "text-primary" : "text-primary/70")} />
          <span className={cn("text-xs font-medium", selectedTypes.includes('custom') ? "text-primary" : "text-primary/70")}>Tùy chỉnh</span>
        </button>

        <button
          onClick={() => toggleTypeFilter('maintenance')}
          className={cn(
            "flex items-center gap-1.5 px-3 h-8 rounded-full border transition-all duration-200",
            selectedTypes.includes('maintenance')
              ? "bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/30 shadow-sm" 
              : "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10",
             selectedTypes.length > 0 && !selectedTypes.includes('maintenance') && "opacity-50 grayscale"
          )}
        >
          <Wrench className={cn("w-3.5 h-3.5", selectedTypes.includes('maintenance') ? "text-amber-600" : "text-amber-600/70")} />
          <span className={cn("text-xs font-medium", selectedTypes.includes('maintenance') ? "text-amber-600" : "text-amber-600/70")}>Bảo trì</span>
        </button>
      </div>
    </motion.div>
  );
}
