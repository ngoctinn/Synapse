import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import * as React from 'react';
import { Appointment, AppointmentStatus } from '../types';

interface AppointmentCardProps {
  appointment: Appointment;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
}


import { APPOINTMENT_STATUS_CONFIG } from '../config';

const getStatusStyles = (status: AppointmentStatus) => {
    return APPOINTMENT_STATUS_CONFIG[status]?.styles || APPOINTMENT_STATUS_CONFIG['pending'].styles
}

export function AppointmentCard({ appointment, style, className, onClick }: AppointmentCardProps) {
  const styles = getStatusStyles(appointment.status)

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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        'absolute inset-x-1 rounded-lg border p-2 text-xs font-medium cursor-pointer shadow-sm overflow-hidden group backdrop-blur-[2px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        styles.card,
        className
      )}
    >

      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5",
          styles.indicator
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
