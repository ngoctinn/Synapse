import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-muted-foreground flex flex-col items-center gap-4 text-sm md:flex-row">
            <span className="text-foreground text-lg font-semibold md:text-base">
              Synapse
            </span>
            <span className="text-muted-foreground/50 hidden md:inline">•</span>
            <span>
              &copy; {new Date().getFullYear()} Synapse. All rights reserved.
            </span>
          </div>

          <div className="flex flex-col-reverse items-center gap-6 md:flex-row">
            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="hover:text-primary underline-offset-4 transition-colors hover:underline"
              >
                Bảo mật
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary underline-offset-4 transition-colors hover:underline"
              >
                Điều khoản
              </Link>
            </div>

            <div className="bg-border hidden h-4 w-px md:block" />

            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transform transition-colors hover:scale-110"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transform transition-colors hover:scale-110"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transform transition-colors hover:scale-110"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
