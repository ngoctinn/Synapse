import { cn } from "@/shared/lib/utils"
import Link from "next/link"

interface HeaderLogoProps {
  className?: string
  textClassName?: string
}

export function HeaderLogo({ className, textClassName }: HeaderLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2 group", className)}>
      <div className="bg-primary text-primary-foreground p-1 rounded-full transition-transform group-hover:scale-110 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          {/* Left Terminal (Presynaptic) */}
          <path d="M 20 80 C 20 50 40 50 40 50" />
          <circle cx="40" cy="50" r="8" fill="currentColor" stroke="none" />

          {/* Right Terminal (Postsynaptic) */}
          <path d="M 80 20 C 80 50 60 50 60 50" />
          <circle cx="60" cy="50" r="8" fill="currentColor" stroke="none" />

          {/* The Spark (Neurotransmitter) */}
          <circle cx="50" cy="50" r="4" className="animate-pulse" fill="currentColor" stroke="none" />

          {/* Energy Arcs */}
          <path d="M 30 30 Q 50 10 70 30" strokeWidth="6" opacity="0.5" />
          <path d="M 70 70 Q 50 90 30 70" strokeWidth="6" opacity="0.5" />
        </svg>
      </div>
      <span className={cn(
        "hidden font-bold sm:inline-block text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 truncate",
        textClassName
      )}>
        Synapse
      </span>
      <span className="sr-only">Synapse Home</span>
    </Link>
  )
}
