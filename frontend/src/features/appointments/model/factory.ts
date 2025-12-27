import { CalendarEvent } from "./types";

export function createDraftAppointment(
  startTime: Date,
  staffId: string = ""
): CalendarEvent {
  const ONE_HOUR_MS = 3600000;
  const endTime = new Date(startTime.getTime() + ONE_HOUR_MS);

  return {
    id: "new",
    start: startTime,
    end: endTime,
    title: "Lịch hẹn mới",
    staffId,
    staffName: "",
    color: "gray",
    status: "PENDING",
    isRecurring: false,
    appointment: {
      id: "new",
      customerId: "",
      customerName: "",
      customerPhone: "",
      items: [],
      totalPrice: 0,
      totalDuration: 60,
      staffId,
      staffName: "",
      serviceId: "",
      serviceName: "",
      serviceColor: "#gray",
      startTime,
      endTime,
      duration: 60,
      status: "PENDING",
      isRecurring: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "",
    },
  };
}
