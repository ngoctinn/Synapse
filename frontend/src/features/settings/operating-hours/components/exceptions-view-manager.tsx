"use client";

import { useMemo, useState } from "react";
import { ExceptionDate } from "../model/types";
import { Button } from "@/shared/ui/button";
import { List as ListIcon, Calendar as CalendarIcon, Plus, Search } from "lucide-react";
import { ExceptionsCalendar } from "./exceptions-calendar";
import { ExceptionsFilterBar } from "./exceptions-filter-bar";
import { useCalendarSelection } from "../hooks/use-calendar-selection";

import { ExceptionDialog } from "./exception-dialog";
import { YearViewGrid } from "./year-view-grid";
import { applyExceptionToDates } from "../utils/bulk-operations";
import { format, startOfYear, endOfYear, setYear } from "date-fns";
import { vi } from "date-fns/locale";
import { useExceptionViewLogic } from "../hooks/use-exception-view-logic";
import { ExceptionListItem } from "./exception-list-item";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/ui/resizable";
import { groupExceptions } from "../utils/grouping";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

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
  } = useCalendarSelection();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
      isOpen: boolean;
      ids: string[];
  }>({ isOpen: false, ids: [] });
  
  // Convert selectedDateIds Set to sorted array of Dates for Calendar
  const selectedDates = useMemo(() => getSelectedDates(), [getSelectedDates, selectedDateIds]);
  
  // Calculate matched keys for styling (Highlighed vs Dimmed)
  const matchedDateKeys = useMemo(() => {
    return new Set(filteredExceptions.map(e => format(e.date, 'yyyy-MM-dd')));
  }, [filteredExceptions]);

  const groupedItems = useMemo(() => groupExceptions(filteredExceptions), [filteredExceptions]);


  const handleManualAdd = () => {
    setIsDialogOpen(true);
  };

  // --- Render Components Helpers ---
  
  const renderListHeader = () => (
      <div className="p-3 border-b bg-muted/10 font-bold text-xs text-muted-foreground uppercase tracking-wider flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
          <span className="flex items-center gap-2">
              <ListIcon className="w-3 h-3" />
              Danh sách chi tiết ({filteredExceptions.length})
          </span>
      </div>
  );

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

  const renderList = () => {



      if (groupedItems.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground p-4 bg-muted/5 rounded-xl border border-dashed m-4">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                      <Search className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Không tìm thấy ngoại lệ nào</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
                  <Button variant="link" size="sm" onClick={clearFilters} className="mt-2 text-primary">Xóa bộ lọc</Button>
              </div>
          );
      }

      return (
          <div className="space-y-4 p-1 pb-10">
              {groupedItems.map((group, index) => {
                  const showYearHeader = index === 0 || group.year !== groupedItems[index - 1].year;
                  
                  return (
                      <ExceptionListItem
                          key={group.id}
                          group={group}
                          showYearHeader={showYearHeader}
                          selectedDateIds={selectedDateIds}
                          onSelectGroup={(dates, isFullySelected) => {
                              const groupDateStrings = dates.map(d => format(d, 'yyyy-MM-dd'));
                              const allDates = getSelectedDates();
                              
                              if (isFullySelected) {
                                  const newDates = allDates.filter(d => !groupDateStrings.includes(format(d, 'yyyy-MM-dd')));
                                  setSelectedDates(newDates);
                              } else {
                                  // Merge unique
                                  const allUnique = [...allDates, ...dates].filter((d, i, self) => 
                                      i === self.findIndex(t => t.getTime() === d.getTime())
                                  );
                                  setSelectedDates(allUnique);
                              }
                          }}
                          onEdit={(dates) => {
                              clearSelection();
                              setSelectedDates(dates);
                              setIsDialogOpen(true);
                          }}
                          onRemove={(ids) => setDeleteConfirmation({ isOpen: true, ids })}
                          onToggleDate={toggleDate}
                      />
                  );
              })}
          </div>
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
             startContent={
               <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg border lg:hidden">
                    <Button
                        variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                        onClick={() => setViewMode('calendar')}
                        className="gap-2 h-9"
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Lịch
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        onClick={() => setViewMode('list')}
                        className="gap-2 h-9"
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

       <div className="flex-1 min-h-0 relative p-4 sm:p-6">
           {/* MOBILE VIEW (Tabs) */}
           <div className="lg:hidden h-full overflow-y-auto bg-muted/5 rounded-lg border">
                {viewMode === 'list' ? (
                    <div className="h-full flex flex-col">
                       {renderListHeader()}
                       <div className="p-4 flex-1">
                            {renderList()}
                       </div>
                    </div>
                ) : (
                   <div className="bg-background h-full p-2 sm:p-4">
                       {renderCalendar()}
                   </div>
                )}
           </div>

           {/* DESKTOP VIEW (Split) */}
           <div className="hidden lg:block h-full border rounded-xl overflow-hidden bg-background shadow-sm">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={65} minSize={40}>
                        <div className="h-full p-4 overflow-y-auto custom-scrollbar">
                           {renderCalendar()}
                        </div>
                    </ResizablePanel>
                    
                    <ResizableHandle />
                    
                    <ResizablePanel defaultSize={35} minSize={25}>
                        <div className="h-full flex flex-col bg-muted/5">
                            {renderListHeader()}
                            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                                {renderList()}
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
                    setIsDialogOpen(false);
                    setDeleteConfirmation({ isOpen: true, ids: idsToDelete });
                } else {
                    setIsDialogOpen(false);
                }
                clearSelection();
           }}
       />

       <AlertDialog 
          open={deleteConfirmation.isOpen} 
          onOpenChange={(open) => !open && setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
       >
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa ngoại lệ?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Bạn sắp xóa {deleteConfirmation.ids.length} ngoại lệ. Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                  <AlertDialogAction 
                      onClick={() => {
                          onRemoveException(deleteConfirmation.ids);
                          setDeleteConfirmation({ isOpen: false, ids: [] });
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                      Xóa vĩnh viễn
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
       </AlertDialog>
    </div>
  );
}
