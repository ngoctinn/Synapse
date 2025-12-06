"use client";

import { useMemo, useState } from "react";
import { ExceptionDate } from "../model/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Checkbox } from "@/shared/ui/checkbox";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Pencil, Trash2, CalendarDays, AlertCircle, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { getStatusStyles } from "../utils/style-helpers";

interface ExceptionsTableProps {
  exceptions: ExceptionDate[];
  onRemove: (id: string | string[]) => void;
  onEdit: (exception: ExceptionDate) => void;
}

export function ExceptionsTable({ exceptions, onRemove, onEdit }: ExceptionsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Group exceptions by ID
  const groupedExceptions = useMemo(() => {
    const groups = new Map<string, ExceptionDate[]>();
    // Sort by date first
    const sorted = [...exceptions].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    sorted.forEach(ex => {
      const existing = groups.get(ex.id);
      if (existing) {
        existing.push(ex);
      } else {
        groups.set(ex.id, [ex]);
      }
    });
    
    return Array.from(groups.values());
  }, [exceptions]);

  const toggleSelectAll = () => {
    if (selectedIds.length === groupedExceptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(groupedExceptions.map(g => g[0].id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const handleBulkRemove = () => {
    onRemove(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
        {/* Bulk Actions Bar */}
        <AnimatePresence>
            {selectedIds.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-primary/20"
                >
                    <span className="text-sm font-medium px-2">Đã chọn {selectedIds.length} mục</span>
                    <div className="flex items-center gap-2">
                         <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8 gap-2"
                            onClick={handleBulkRemove}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa ({selectedIds.length})
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      <div className="rounded-xl border bg-card/50 overflow-hidden">
        <Table>
            <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">
                <Checkbox 
                    checked={groupedExceptions.length > 0 && selectedIds.length === groupedExceptions.length}
                    onCheckedChange={toggleSelectAll}
                />
                </TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Tên sự kiện</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {groupedExceptions.length === 0 ? (
                <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy dữ liệu
                </TableCell>
                </TableRow>
            ) : (
                groupedExceptions.map((group) => {
                const mainEx = group[0];
                const isSelected = selectedIds.includes(mainEx.id);
                
                return (
                    <TableRow key={mainEx.id} className={cn("group", isSelected && "bg-muted/40")}>
                    <TableCell>
                        <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(mainEx.id)}
                        />
                    </TableCell>
                    <TableCell>
                        <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                {group.length > 1 
                                    ? `${format(group[0].date, 'dd/MM/yyyy')} - ${format(group[group.length-1].date, 'dd/MM/yyyy')}`
                                    : format(mainEx.date, 'dd/MM/yyyy')
                                }
                            </div>
                            {group.length > 1 && (
                                <div className="text-xs text-muted-foreground pl-6">
                                    Tổng cộng {group.length} ngày
                                </div>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="font-medium text-base">{mainEx.reason}</span>
                    </TableCell>
                    <TableCell>
                       <Badge variant="secondary" className={cn(
                            "font-semibold border-0",
                            getStatusStyles(mainEx.type, mainEx.isClosed).badge
                       )}>
                            {mainEx.type === 'holiday' ? 'Ngày lễ' : mainEx.type === 'maintenance' ? 'Bảo trì' : 'Tùy chỉnh'}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       {mainEx.isClosed ? (
                           <div className="flex items-center gap-2 text-destructive">
                               <AlertCircle className="w-4 h-4" />
                               <span className="font-medium text-sm">Đóng cửa</span>
                           </div>
                       ) : (
                            <div className="flex items-center gap-2 text-primary">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium text-sm">Giờ đặc biệt</span>
                            </div>
                       )}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onEdit(mainEx)}
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Chỉnh sửa</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onRemove(mainEx.id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Xóa</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </TableCell>
                    </TableRow>
                );
                })
            )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
