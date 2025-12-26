"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ServiceCategory } from "../../model/types";

interface SortableItemProps {
  category: ServiceCategory;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function SortableItem({
  category,
  onUpdate,
  onDelete,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(category.id, editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(category.name);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-background group mb-2 flex items-center gap-2 rounded-lg border p-2 ${
        isDragging
          ? "ring-primary/20 shadow-lg ring-[1.5px]"
          : "hover:border-primary/50"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab p-1 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="h-8"
          />
        ) : (
          <span className="pl-1 text-sm font-medium">{category.name}</span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
