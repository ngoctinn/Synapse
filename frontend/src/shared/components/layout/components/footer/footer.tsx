import { Facebook, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Synapse</span>
            <span className="hidden md:inline">•</span>
            <span>&copy; {new Date().getFullYear()} Synapse. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Bảo mật
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Điều khoản
              </Link>
            </div>

            <div className="h-4 w-px bg-border hidden md:block" />

            <div className="flex items-center gap-3">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
