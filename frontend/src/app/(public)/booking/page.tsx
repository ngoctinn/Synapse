"use client";

import dynamic from "next/dynamic";

const BookingWizard = dynamic(
  () => import("@/features/booking-wizard").then((m) => m.BookingWizard),
  { ssr: false }
);

export default function BookingPage() {
  return <BookingWizard />;
}
