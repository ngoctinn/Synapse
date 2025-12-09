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
  pending: 'bg-status-pending border-status-pending-border text-status-pending-foreground hover:bg-status-pending/90',
  confirmed: 'bg-status-confirmed border-status-confirmed-border text-status-confirmed-foreground hover:bg-status-confirmed/90',
  serving: 'bg-status-serving border-status-serving-border text-status-serving-foreground hover:bg-status-serving/90 shadow-[0_0_10px_rgba(var(--status-serving),0.3)]',
  completed: 'bg-status-completed border-status-completed-border text-status-completed-foreground hover:bg-status-completed/90',
  cancelled: 'bg-status-cancelled border-status-cancelled-border text-status-cancelled-foreground hover:bg-status-cancelled/90 opacity-80',
  'no-show': 'bg-status-noshow border-status-noshow-border text-status-noshow-foreground hover:bg-status-noshow/90',
};

const statusIndicator = {
  pending: 'bg-status-pending-foreground',
  confirmed: 'bg-status-confirmed-foreground',
  serving: 'bg-status-serving-foreground',
  completed: 'bg-status-completed-foreground',
  cancelled: 'bg-status-cancelled-foreground',
  'no-show': 'bg-status-noshow-foreground',
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
