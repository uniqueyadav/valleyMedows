import { Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/data";
import hero from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <img src={hero} alt="Valley Medows guest house exterior" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 gradient-hero" />
      <div className="relative z-10 max-w-3xl px-4 pt-20">
        <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-white/80 mb-5">Srinagar · Kashmir</p>
        <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-5">
          {SITE.name}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
          {SITE.tagline}. Warm hospitality, comfortable rooms, and the calm of the valley — minutes from the airport.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg" className="shadow-elegant">
            <a href="#book"><CalendarDays className="w-4 h-4 mr-2" />Book Now</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white">
            <a href={`tel:${SITE.phoneRaw}`}><Phone className="w-4 h-4 mr-2" />{SITE.phone}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
