"use client";

import { EquipmentList } from "@/features/equipment/components/equipment-list";
import { MaintenanceScheduleForm } from "@/features/equipment/components/maintenance-schedule-form";
import { MaintenanceTimeline } from "@/features/equipment/components/maintenance-timeline";
import { mockEquipment, mockTasks } from "@/features/equipment/model/mocks";
import { MaintenanceSchedule, MaintenanceTask } from "@/features/equipment/model/types";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus, Settings } from "lucide-react";
import * as React from "react";

export default function EquipmentPage() {
  const [selectedEquipmentId, setSelectedEquipmentId] = React.useState<string | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<MaintenanceTask | null>(null);

  const handleSaveSchedule = (data: Partial<MaintenanceSchedule>) => {
    console.log("Saving schedule:", data);
    setIsCreateModalOpen(false);
    // Here you would call the API to save
  };

  const handleTaskClick = (task: MaintenanceTask) => {
    console.log("Clicked task:", task);
    setEditingTask(task);
    // Open edit modal or details view
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Quản Lý Thiết Bị & Bảo Trì
          </h1>
          <p className="text-muted-foreground">
            Theo dõi trạng thái thiết bị và lịch bảo trì định kỳ.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" />
                Lên Lịch Bảo Trì
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-none shadow-none">
               <MaintenanceScheduleForm
                  onSave={handleSaveSchedule}
                  onCancel={() => setIsCreateModalOpen(false)}
               />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar: Equipment List */}
        <div className="w-80 shrink-0 flex flex-col">
          <EquipmentList
            equipment={mockEquipment}
            selectedId={selectedEquipmentId}
            onSelect={(eq) => setSelectedEquipmentId(eq.id)}
          />
        </div>

        {/* Main View: Timeline */}
        <div className="flex-1 min-w-0 flex flex-col">
           <MaintenanceTimeline
              equipment={mockEquipment}
              tasks={mockTasks}
              onTaskClick={handleTaskClick}
           />
        </div>
      </div>
    </div>
  );
}
