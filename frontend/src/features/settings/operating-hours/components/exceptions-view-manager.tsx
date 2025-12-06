
"use client";

import { useMemo, useState } from "react";
import { ExceptionDate } from "../model/types";
import { Button } from "@/shared/ui/button";
import { Plus, Calendar as CalendarIcon, List as ListIcon, Paintbrush, MousePointer2 } from "lucide-react";
import { ExceptionsCalendar } from "./exceptions-calendar";
import { ExceptionsTable } from "./exceptions-table";
import { ExceptionsFilterBar } from "./exceptions-filter-bar";
import { useExceptionFilters } from "../hooks/use-exception-filters";
import { cn } from "@/shared/lib/utils";
import { useCalendarSelection } from "../hooks/use-calendar-selection";
import { FloatingActionDock } from "./floating-action-dock";
import { InspectorPanel } from "./inspector-panel";
import { YearViewGrid } from "./year-view-grid";
import { applyExceptionToDates, isDateSelected } from "../utils/bulk-operations";
import { format } from "date-fns";
import { toast } from "sonner"; // If needed

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
  
  // 1. Data & State Logic
  const {
    filteredExceptions,
    selectedTypes,
    toggleTypeFilter,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange
  } = useExceptionFilters(exceptions);

  const {
    selectedDateIds,
    toggleDate,
    selectRange,
    clearSelection,
    getSelectedDates,
    setSelectedDates,
    addToSelection,
    mode,
    setMode,
    view,
    setView
  } = useCalendarSelection();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Convert selectedDateIds Set to sorted array for Calendar display
  const selectedDates = useMemo(() => getSelectedDates(), [getSelectedDates, selectedDateIds]);

  return (
      <div className="space-y-6 relative">
          {/* Header & Tools */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="space-y-1">
                 <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
                    Ngày nghỉ & Ngoại lệ
                 </h3>
                 <p className="text-sm text-muted-foreground">
                    Quản lý các ngày nghỉ lễ, bảo trì và lịch làm việc đặc biệt.
                 </p>
               </div>

               <div className="flex items-center gap-2">
                    {/* Mode Toggle (Select vs Paint) - Visible only in Calendar modes */}
                    {view !== 'list' && (
                        <div className="bg-muted/50 p-1 rounded-lg border flex items-center mr-2">
                            <Button 
                                variant={mode === 'select' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                onClick={() => setMode('select')} 
                                className="h-8 w-8 p-0"
                                title="Chế độ chọn (Kéo để chọn vùng)"
                            >
                                <MousePointer2 className="w-4 h-4" />
                            </Button>
                            <Button 
                                variant={mode === 'paint' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                onClick={() => setMode('paint')} 
                                className="h-8 w-8 p-0"
                                title="Chế độ tô (Kéo để thêm vào vùng chọn)"
                            >
                                <Paintbrush className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    <div className="bg-muted/50 p-1 rounded-lg border flex items-center">
                        <Button variant={view === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setView('month')} className="h-8 rounded-md gap-2">
                            <CalendarIcon className="w-4 h-4" /> Tháng
                        </Button> 
                        <Button variant={view === 'year' ? 'default' : 'ghost'} size="sm" onClick={() => setView('year')} className="h-8 rounded-md gap-2">
                            <CalendarIcon className="w-4 h-4" /> Năm
                        </Button>
                        <Button variant={view === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setView('list')} className="h-8 rounded-md gap-2">
                            <ListIcon className="w-4 h-4" /> List
                        </Button>
                    </div>
               </div>
          </div>

          <div className="bg-card/30 rounded-2xl border p-4 backdrop-blur-sm space-y-4">
            <ExceptionsFilterBar 
                selectedTypes={selectedTypes} toggleTypeFilter={toggleTypeFilter}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                dateRange={dateRange} setDateRange={setDateRange}
            />
          </div>

          <div className="min-h-[600px] relative">
              {view === 'list' ? (
                  <ExceptionsTable 
                      exceptions={filteredExceptions} 
                      onEdit={(ex) => {
                          clearSelection();
                          toggleDate(ex.date);
                          setIsPanelOpen(true);
                      }} 
                      onRemove={onRemoveException} 
                  />
              ) : view === 'year' ? (
                  <YearViewGrid 
                      year={new Date().getFullYear()} // Todo: Add Year state
                      exceptions={filteredExceptions}
                      selectedDates={selectedDates}
                      onSelectDates={(dates) => {
                          if (mode === 'paint') {
                              addToSelection(dates);
                          } else {
                              setSelectedDates(dates);
                          }
                      }}
                  />
              ) : (
                  <>
                      <ExceptionsCalendar 
                          exceptions={filteredExceptions}
                          selectedDates={selectedDates} 
                          onSelectDates={(dates) => {
                              if (mode === 'paint') {
                                  addToSelection(dates);
                              } else {
                                  setSelectedDates(dates);
                              }
                          }}
                          onEdit={(ex) => {
                              clearSelection();
                              toggleDate(ex.date);
                              setIsPanelOpen(true);
                          }}
                      />
                  </>
              )}
          </div>

          <FloatingActionDock 
              selectedCount={selectedDates.length} 
              onClearSelection={clearSelection}
              onAction={(action, payload) => {
                  switch(action) {
                      case 'lock':
                          const updates = applyExceptionToDates(selectedDates, { isClosed: true, type: 'custom', reason: 'Đóng cửa' }, exceptions);
                          onAddExceptions(updates);
                          break;
                      case 'time':
                          const slots = [{ start: payload.start, end: payload.end }];
                          const updatesTime = applyExceptionToDates(selectedDates, { isClosed: false, modifiedHours: slots, type: 'custom' }, exceptions);
                          onAddExceptions(updatesTime);
                          break;
                      case 'type':
                           const updatesType = applyExceptionToDates(selectedDates, { type: payload }, exceptions);
                           onAddExceptions(updatesType);
                           break;
                  }
              }}
          />

          <InspectorPanel 
              isOpen={isPanelOpen || (selectedDates.length === 1 && false)} 
              onClose={() => setIsPanelOpen(false)}
              selectedDates={selectedDates}
              existingExceptions={exceptions}
              onSave={(config) => {
                  // If we are in mixed mode/bulk edit, logic inside InspectorPanel handles what to send.
                  // But `config` here is partial.
                  // We apply it.
                  const updates = applyExceptionToDates(selectedDates, config, exceptions);
                  onAddExceptions(updates);
              }}
              onDelete={() => {
                  const ids = exceptions.filter(e => isDateSelected(e.date, selectedDateIds)).map(e => e.id);
                  onRemoveException(ids);
                  setIsPanelOpen(false);
                  clearSelection();
              }}
          />
      </div>
  );
}
