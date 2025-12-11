import { PartyPopper, Settings2, Wrench } from "lucide-react";
import { ExceptionDate } from "./types";

export const EXCEPTION_TYPES: {
  id: ExceptionDate['type'];
  label: string;
  icon: typeof PartyPopper;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    id: 'holiday',
    label: 'Ngày lễ',
    icon: PartyPopper,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20'
  },
  {
    id: 'maintenance',
    label: 'Bảo trì',
    icon: Wrench,
    color: 'text-alert-warning-foreground',
    bg: 'bg-alert-warning',
    border: 'border-alert-warning-border'
  },
  {
    id: 'custom',
    label: 'Khác',
    icon: Settings2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20'
  }
];

export const DEFAULT_BUSINESS_HOURS = [{ start: "08:00", end: "17:00" }];
