import { addHours, format, parseISO } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { date: rawDate, staffId } = await request.json();

  if (!rawDate || !staffId) {
    return NextResponse.json(
      { error: "Missing date or staffId" },
      { status: 400 }
    );
  }

  const date = parseISO(rawDate);

  const mockSlots = generateMockTimeSlots(date, staffId);

  return NextResponse.json(mockSlots);
}

function generateMockTimeSlots(baseDate: Date, staffId: string) {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  const intervalMinutes = 30;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const slotTime = addHours(baseDate, hour);
      slotTime.setMinutes(minute);
      slotTime.setSeconds(0);
      slotTime.setMilliseconds(0);

      const isBooked = Math.random() > 0.8;

      slots.push({
        id: `${format(slotTime, "yyyy-MM-dd-HH-mm")}-${staffId}`,
        time: slotTime.toISOString(),
        isAvailable: !isBooked,
        staffId: staffId,
      });
    }
  }
  return slots;
}
