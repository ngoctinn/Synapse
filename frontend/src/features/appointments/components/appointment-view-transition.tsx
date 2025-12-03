"use client"

import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { ReactNode } from "react"

interface AppointmentViewTransitionProps {
  children: ReactNode
  view: "list" | "calendar"
}

export function AppointmentViewTransition({ children, view }: AppointmentViewTransitionProps) {
  return (
    <LayoutGroup>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.98, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -5 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth feel
          }}
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  )
}
