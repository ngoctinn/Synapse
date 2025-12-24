"use client";

import { useState } from "react";
import type { CalendarEvent } from "../model/types";

/**
 * Hook to manage dialog/sheet states for the appointments module.
 */
export function useAppointmentDialogs() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<string | null>(null);

  // Dialog actions (Cancel, Delete)
  const [actionEvent, setActionEvent] = useState<CalendarEvent | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedEvent(null);
    setSheetMode("create");
    setIsSheetOpen(true);
  };

  const handleEditRequest = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  const handleCancelRequest = (event: CalendarEvent) => {
    setActionEvent(event);
    setIsCancelOpen(true);
  };

  const handleDeleteRequest = (event: CalendarEvent) => {
    setActionEvent(event);
    setIsDeleteOpen(true);
  };

  const openSheetWithData = (event: CalendarEvent, mode: "view" | "edit" | "create") => {
    setSelectedEvent(event);
    setSheetMode(mode);
    setIsSheetOpen(true);
  };

  return {
    // Sheet states
    isSheetOpen,
    setIsSheetOpen,
    selectedEvent,
    setSelectedEvent,
    sheetMode,
    setSheetMode,
    selectedBookingForReview,
    setSelectedBookingForReview,

    // Dialog states
    actionEvent,
    setActionEvent,
    isCancelOpen,
    setIsCancelOpen,
    isDeleteOpen,
    setIsDeleteOpen,

    // Common handlers
    handleEventClick,
    handleCreateClick,
    handleEditRequest,
    handleCancelRequest,
    handleDeleteRequest,
    openSheetWithData,
  };
}
