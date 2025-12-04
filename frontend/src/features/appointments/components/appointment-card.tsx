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
  onClick?: () => void;
}

// Premium Pastel Colors
const statusStyles = {
  pending: 'bg-amber-50/90 border-amber-200 text-amber-900 hover:bg-amber-100',
  confirmed: 'bg-sky-50/90 border-sky-200 text-sky-900 hover:bg-sky-100',
  serving: 'bg-emerald-50/90 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
  completed: 'bg-slate-50/90 border-slate-200 text-slate-700 hover:bg-slate-100',
  cancelled: 'bg-rose-50/80 border-rose-100 text-rose-700 hover:bg-rose-50 opacity-60 grayscale',
  'no-show': 'bg-red-50/90 border-red-200 text-red-900 hover:bg-red-100',
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
  const duration = (appointment.endTime.getTime() - appointment.startTime.getTime()) / (1000 * 60);
  const isSmall = duration < 45; // Chế độ xem gọn cho lịch hẹn ngắn

  return (
    <motion.div
      layoutId={`appointment-${appointment.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={style}
      onClick={onClick}
      className={cn(
        'absolute inset-x-1 rounded-lg border p-2 text-xs font-medium cursor-pointer shadow-sm overflow-hidden group backdrop-blur-[2px]',
        statusStyles[appointment.status],
        className
      )}
    >
      {/* Thanh trạng thái (Status Bar) */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5",
          statusIndicator[appointment.status]
        )}
      />

      <div className="pl-2 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between gap-1">
          <span className="font-bold truncate text-sm leading-tight font-serif tracking-wide">
            {appointment.customerName}
          </span>
          {!isSmall && (
            <span className="opacity-70 text-[10px] whitespace-nowrap flex items-center gap-0.5 font-mono">
              <Clock className="w-3 h-3" />
              {format(appointment.startTime, 'HH:mm')} - {format(appointment.endTime, 'HH:mm')}
            </span>
          )}
        </div>

        <div className="text-[11px] opacity-90 truncate font-normal mt-0.5 text-current/80">
          {appointment.serviceName}
        </div>

        {!isSmall && appointment.notes && (
          <div className="mt-1 text-[10px] opacity-70 truncate italic border-t border-black/5 pt-1">
            {appointment.notes}
          </div>
        )}
      </div>
    </motion.div>
  );
}
