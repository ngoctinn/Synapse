"use client";

import { useMemo, useState } from "react";
import { ExceptionDate } from "../model/types";
import { Button } from "@/shared/ui/button";
import { List as ListIcon, Calendar as CalendarIcon, Plus } from "lucide-react";
import { ExceptionsCalendar } from "./exceptions-calendar";
// import { ExceptionsTable } from "./exceptions-table"; // DELETED
import { ExceptionsFilterBar } from "./exceptions-filter-bar";
import { useCalendarSelection } from "../hooks/use-calendar-selection";

import { ExceptionDialog } from "./exception-dialog";
import { YearViewGrid } from "./year-view-grid";
import { applyExceptionToDates } from "../utils/bulk-operations";
import { format, startOfYear, endOfYear, setYear } from "date-fns";
import { vi } from "date-fns/locale";
import { useExceptionViewLogic } from "../hooks/use-exception-view-logic";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"; // Added icons
import { DataTable, Column } from "@/shared/ui/custom/data-table"; // Added DataTable
import { Badge } from "@/shared/ui/badge"; // Added Badge
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"; // Added DropdownMenu
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/ui/resizable";
import { cn } from "@/shared/lib/utils";

interface ExceptionsViewManagerProps {
  exceptions: ExceptionDate[];
  onAddExceptions: (exceptions: ExceptionDate[]) => void;
  onRemoveException: (id: string | string[]) => void;
}

export function ExceptionsViewManager({ 
  exceptions, 
  onAddExceptions, 
  onRemoveException 
}: ExceptionsViewManagerProps) {
  
  // --- 1. Shared View Logic (Hook) ---
  const {
    filteredExceptions,
    viewMode,
    isYearView,
    dateRange,
    statusFilter,
    typeFilter,
    activeCount,
    filterUnit,
    searchQuery,
    setViewMode,
    setFilterUnit,
    setDateRange,
    setStatusFilter,
    setTypeFilter,
    setSearchQuery,
    clearFilters
  } = useExceptionViewLogic({ exceptions });

  // --- 2. Selection Logic ---
  const {
    selectedDateIds,
    toggleDate,
    clearSelection,
    getSelectedDates,
    setSelectedDates,
    addToSelection,
    mode,
    setMode,
  } = useCalendarSelection();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Convert selectedDateIds Set to sorted array of Dates for Calendar
  const selectedDates = useMemo(() => getSelectedDates(), [getSelectedDates, selectedDateIds]);
  
  // Convert selectedDateIds Set to Array of strings for Table
  const selectedIdsArray = useMemo(() => Array.from(selectedDateIds), [selectedDateIds]);

  // Calculate matched keys for styling (Highlighed vs Dimmed)
  const matchedDateKeys = useMemo(() => {
    return new Set(filteredExceptions.map(e => format(e.date, 'yyyy-MM-dd')));
  }, [filteredExceptions]);

  const handleManualAdd = () => {
    // Open Dialog with current selection (or empty if none)
    setIsDialogOpen(true);
  };


  // --- Render Components Helpers ---
  
  const renderCalendar = () => (
      isYearView ? (
        <YearViewGrid 
            year={dateRange?.from?.getFullYear() || new Date().getFullYear()} 
            exceptions={exceptions} // Pass ALL exceptions to show context
            matchedDateKeys={matchedDateKeys} // Pass keys to highlight
            selectedDates={selectedDates}
            activeDateRange={dateRange}
            onSelectDates={setSelectedDates}
            onYearChange={(year) => {
                const newStart = startOfYear(setYear(new Date(), year));
                const newEnd = endOfYear(newStart);
                setDateRange({ from: newStart, to: newEnd });
                setFilterUnit('year');
            }}
        />
    ) : (
        <ExceptionsCalendar 
            exceptions={filteredExceptions}
            selectedDates={selectedDates}
            displayDate={dateRange?.from || new Date()} 
            onSelectDates={setSelectedDates}
            onEdit={(ex) => {
                clearSelection();
                const peers = exceptions.filter(e => e.id === ex.id);
                setSelectedDates(peers.map(p => p.date));
                setIsDialogOpen(true);
            }}
        />
    )
  );

  const getColumns = (compact: boolean): Column<ExceptionDate>[] => {
      const baseColumns: Column<ExceptionDate>[] = [
        {
          header: "Ngày",
          accessorKey: "date",
          cell: (item) => (
            <div className="flex flex-col">
              <span className="font-medium">
                {format(item.date, "dd/MM/yyyy", { locale: vi })}
              </span>
              {!compact && (
                  <span className="text-xs text-muted-foreground capitalize">
                  {format(item.date, "EEEE", { locale: vi })}
                  </span>
              )}
            </div>
          ),
        },
        {
          header: "Lý do",
          accessorKey: "reason",
          cell: (item) => (
              <div className={cn("truncate", compact ? "max-w-[120px]" : "max-w-[200px]")} title={item.reason}>
                  {item.reason || "Không có lý do"}
              </div>
          )
        },
      ];
  
      if (!compact) {
          baseColumns.push({
              header: "Loại",
              accessorKey: "type",
              cell: (item) => {
                  const typeMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
                      holiday: { label: "Ngày lễ", variant: "destructive" },
                      maintenance: { label: "Bảo trì", variant: "secondary" },
                      custom: { label: "Tùy chỉnh", variant: "outline" },
                  };
                  const config = typeMap[item.type] || { label: item.type, variant: "outline" };
                  return <Badge variant={config.variant}>{config.label}</Badge>;
              }
          });
          
          baseColumns.push({
               header: "Trạng thái",
               cell: (item) => (
                   <Badge variant={item.isClosed ? "destructive" : "default"} className="bg-opacity-10 text-xs shadow-none hover:bg-opacity-20">
                       {item.isClosed ? "Đóng cửa" : "Mở cửa"}
                   </Badge>
               )
          });
      }
  
      // Action column
      baseColumns.push({
        header: "",
        className: "w-[50px]",
        cell: (item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                  clearSelection();
                  toggleDate(item.date);
                  setIsDialogOpen(true);
              }}>
                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => onRemoveException(item.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      });
  
      return baseColumns;
  };

  const renderTable = (compact: boolean = false) => {
      // Calculate selected UUIDs efficiently
      const selectedUUIDs = useMemo(() => {
          return new Set(
              filteredExceptions
                  .filter(e => selectedDateIds.has(format(e.date, 'yyyy-MM-dd')))
                  .map(e => e.id)
          );
      }, [filteredExceptions, selectedDateIds]);

      // Logic for selection
      const isAllSelected = filteredExceptions.length > 0 && selectedUUIDs.size === filteredExceptions.length;
      const isPartiallySelected = selectedUUIDs.size > 0 && selectedUUIDs.size < filteredExceptions.length;
      
      const handleToggleOne = (id: string | number) => {
          const strId = String(id);
          const ex = exceptions.find(e => e.id === strId);
          if (ex) {
             toggleDate(ex.date);
          }
      };

      const handleToggleAll = () => {
          if (isAllSelected) {
              clearSelection();
          } else {
              // Select all visible filtered exceptions
              const dates = filteredExceptions.map(e => e.date);
              setSelectedDates(dates);
          }
      };

      return (
          <DataTable
                data={filteredExceptions}
                columns={getColumns(compact)}
                keyExtractor={(item) => item.id}
                selectable={true}
                isSelected={(id) => selectedUUIDs.has(String(id))}
                onToggleOne={handleToggleOne}
                onToggleAll={handleToggleAll}
                isAllSelected={isAllSelected}
                isPartiallySelected={isPartiallySelected}
                className={cn(compact && "border-none shadow-none bg-transparent")}
                emptyState={
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground p-4">
                        <p className="text-sm">Không tìm thấy ngoại lệ nào khớp với bộ lọc.</p>
                    </div>
                }
          />
      );
  };

  // Calculate active filters count excluding Date Range (which is a View Context)
  const filtersActiveCount = 
      (statusFilter ? 1 : 0) + 
      (typeFilter.length > 0 ? 1 : 0) + 
      (searchQuery ? 1 : 0);

  return (
    <div className="h-full flex flex-col">
         <ExceptionsFilterBar 
             activeCount={filtersActiveCount}
             onClearFilters={clearFilters}
             searchQuery={searchQuery}
             setSearchQuery={setSearchQuery}
             statusFilter={statusFilter} 
             setStatusFilter={setStatusFilter}
             typeFilter={typeFilter}
             setTypeFilter={setTypeFilter}
             dateRange={dateRange}
             setDateRange={setDateRange}
             // Hide view toggle on large screens where we show split view
             startContent={
               <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg border lg:hidden">
                    <Button
                        variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('calendar')}
                        className="gap-2"
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Lịch
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="gap-2"
                    >
                        <ListIcon className="w-4 h-4" />
                        Danh sách
                    </Button>
               </div>
             }
             endContent={
               <div className="flex items-center gap-2">

                    
                    {/* Add Button */}
                    <Button onClick={handleManualAdd} className="bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Thêm ngoại lệ
                    </Button>
               </div>
             }
         />

       <div className="flex-1 min-h-0 relative p-6">
           {/* MOBILE VIEW (Tabs) */}
           <div className="lg:hidden h-full overflow-y-auto">
                {viewMode === 'list' ? renderTable() : renderCalendar()}
           </div>

           {/* DESKTOP VIEW (Split) */}
           <div className="hidden lg:block h-full border rounded-xl overflow-hidden bg-background shadow-sm">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={65} minSize={40}>
                        <div className="h-full p-4 overflow-y-auto custom-scrollbar">
                           {renderCalendar()}
                        </div>
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle />
                    
                    <ResizablePanel defaultSize={35} minSize={25}>
                        <div className="h-full flex flex-col bg-muted/10">
                            <div className="p-3 border-b bg-muted/20 font-medium text-xs text-muted-foreground uppercase tracking-wider flex justify-between items-center">
                                <span>Danh sách chi tiết</span>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                                {/* If selection exists, maybe filter table? For now show all filtered list, but auto-highlight selection */}
                                {renderTable(true)}
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
           </div>
       </div>

       <ExceptionDialog 
           isOpen={isDialogOpen} 
           onClose={() => setIsDialogOpen(false)}
           selectedDates={selectedDates}
           existingExceptions={exceptions}
           onDatesChange={setSelectedDates}
           onSubmit={(config) => {
               const updates = applyExceptionToDates(selectedDates, config, exceptions);
               onAddExceptions(updates);
           }}
           onDelete={() => {
                // Delete logic
                const idsToDelete = exceptions
                     .filter(e => selectedDateIds.has(format(e.date, 'yyyy-MM-dd')))
                     .map(e => e.id);
                 
                if (idsToDelete.length > 0) {
                    onRemoveException(idsToDelete);
                }
                setIsDialogOpen(false);
                clearSelection();
           }}
       />
    </div>
  );
}
