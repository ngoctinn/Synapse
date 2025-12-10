import { Facebook, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground text-lg md:text-base">Synapse</span>
            <span className="hidden md:inline text-muted-foreground/50">•</span>
            <span>&copy; {new Date().getFullYear()} Synapse. All rights reserved.</span>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center gap-6">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                Bảo mật
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                Điều khoản
              </Link>
            </div>

            <div className="h-4 w-px bg-border hidden md:block" />

            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
