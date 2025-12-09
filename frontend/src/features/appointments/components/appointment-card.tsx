import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import * as React from 'react';
import { Appointment } from '../types';

interface AppointmentCardProps {
  appointment: Appointment;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
}


const statusStyles = {
  pending: 'bg-[var(--status-pending)] border-[var(--status-pending-border)] text-[var(--status-pending-foreground)] hover:brightness-95',
  confirmed: 'bg-[var(--status-confirmed)] border-[var(--status-confirmed-border)] text-[var(--status-confirmed-foreground)] hover:brightness-95',
  serving: 'bg-[var(--status-serving)] border-[var(--status-serving-border)] text-[var(--status-serving-foreground)] hover:brightness-95',
  completed: 'bg-[var(--status-completed)] border-[var(--status-completed-border)] text-[var(--status-completed-foreground)] hover:brightness-95',
  cancelled: 'bg-[var(--status-cancelled)] border-[var(--status-cancelled-border)] text-[var(--status-cancelled-foreground)] hover:brightness-110 opacity-70 grayscale',
  'no-show': 'bg-[var(--status-noshow)] border-[var(--status-noshow-border)] text-[var(--status-noshow-foreground)] hover:brightness-110',
};

const statusIndicator = {
  pending: 'bg-amber-400',
  confirmed: 'bg-sky-400',
  serving: 'bg-emerald-400',
  completed: 'bg-slate-400',
  cancelled: 'bg-rose-400',
  'no-show': 'bg-red-500',
};

export function AppointmentCard({ appointment, style, className, onClick }: AppointmentCardProps) {


  return (
    <motion.div
      layout
      layoutId={`appointment-${appointment.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 50, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={style}
      onClick={onClick}
      className={cn(
        'absolute inset-x-1 rounded-lg border p-2 text-xs font-medium cursor-pointer shadow-sm overflow-hidden group backdrop-blur-[2px]',
        statusStyles[appointment.status],
        className
      )}
    >

      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5",
          statusIndicator[appointment.status]
        )}
      />

      <div className="pl-2.5 h-full flex flex-col justify-center gap-1">

        <div className="font-bold truncate text-sm leading-none font-serif tracking-tight text-foreground/90">
          {appointment.customerName}
        </div>


        <div className="flex items-center gap-1 text-[11px] opacity-85 font-mono leading-none">
           <Clock className="w-3 h-3" />
           <span className="truncate">
             {format(appointment.startTime, 'HH:mm')} - {format(appointment.endTime, 'HH:mm')}
           </span>
        </div>


        <div className="text-[11px] opacity-90 truncate font-medium leading-none">
          {appointment.serviceName}
        </div>
      </div>
    </motion.div>
  );
}
