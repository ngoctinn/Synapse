"use client"

import { cn } from "@/shared/lib/utils"
import { HTMLMotionProps, motion } from "framer-motion"

interface AnimatedTableRowProps extends HTMLMotionProps<"tr"> {
  index: number
  children: React.ReactNode
  className?: string
}

export function AnimatedTableRow({
  index,
  children,
  className,
  ...props
}: AnimatedTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn(
        "hover:bg-blue-50/50 transition-colors border-b last:border-0",
        className
      )}
      {...props}
    >
      {children}
    </motion.tr>
  )
}
