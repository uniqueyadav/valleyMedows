import { SITE } from "@/lib/data";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <img src={logo} alt={`${SITE.name} logo`} className="h-10 w-auto" />
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        </div>
        <a
          href="https://ecliqs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary"
        >
          Developed by e-Cliqs Consulting
        </a>
      </div>
    </footer>
  );
}
