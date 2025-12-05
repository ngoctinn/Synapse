"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Plus, Search, Wrench } from "lucide-react";
import * as React from "react";
import { Equipment } from "../model/types";

interface EquipmentListProps {
  equipment: Equipment[];
  onSelect: (eq: Equipment) => void;
  selectedId?: string;
}

export function EquipmentList({
  equipment,
  onSelect,
  selectedId,
}: EquipmentListProps) {
  const [search, setSearch] = React.useState("");

  const filteredEquipment = equipment.filter(
    (eq) =>
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.code.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoạt động</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Bảo trì</Badge>;
      case "broken":
        return <Badge variant="destructive">Hỏng</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-semibold text-lg">Thiết Bị</h3>
          <Button size="icon" variant="ghost">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thiết bị..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredEquipment.map((eq) => (
            <button
              key={eq.id}
              onClick={() => onSelect(eq)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all hover:bg-muted/50",
                selectedId === eq.id ? "bg-primary/5 ring-1 ring-primary/20" : ""
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shrink-0 mt-0.5">
                 {eq.image ? (
                      <img
                        src={eq.image}
                        alt={eq.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench className="w-5 h-5 text-muted-foreground" />
                    )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{eq.name}</div>
                <div className="text-xs text-muted-foreground mb-1.5">{eq.code}</div>
                {getStatusBadge(eq.status)}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
