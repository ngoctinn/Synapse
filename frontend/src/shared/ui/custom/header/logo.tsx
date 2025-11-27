import Link from "next/link"

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="bg-primary text-primary-foreground p-1 rounded-full transition-transform group-hover:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
      </div>
      <span className="hidden font-bold sm:inline-block text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
        Synapse
      </span>
      <span className="sr-only">Synapse Home</span>
    </Link>
  )
}
