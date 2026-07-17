import { useState } from "react";
import { Menu, X, Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/data";
import logo from "@/assets/logo.png";

const links = [
  { href: "#rooms", label: "Rooms & Pricing" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <a href="#home" className="flex items-center gap-2" aria-label={SITE.name}>
          <img src={logo} alt={`${SITE.name} logo`} className="h-10 md:h-11 w-auto" width={220} height={88} />
        </a>
        <nav className="hidden md:flex items-center justify-center gap-7">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center justify-end gap-2">
          <Button asChild size="sm">
            <a href="#book"><CalendarDays className="w-4 h-4 mr-1.5" />Book Now</a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={`tel:${SITE.phoneRaw}`}><Phone className="w-4 h-4 mr-1.5" />{SITE.phone}</a>
          </Button>
        </div>
        <button className="md:hidden p-2 col-start-3 justify-self-end" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-1 text-foreground/80">
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2">
              <Button asChild size="sm"><a href="#book"><CalendarDays className="w-4 h-4 mr-1.5" />Book Now</a></Button>
              <Button asChild size="sm" variant="outline"><a href={`tel:${SITE.phoneRaw}`}><Phone className="w-4 h-4 mr-1.5" />{SITE.phone}</a></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
