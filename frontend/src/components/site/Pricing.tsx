import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { fetchRooms } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE } from "@/lib/data";
import { SectionHeader } from "./Rooms";

export function Pricing() {
  const { data: rooms, isLoading } = useQuery({ queryKey: ["rooms"], queryFn: fetchRooms });
  const perks = ["Free Wi-Fi", "Daily housekeeping", "Complimentary tea & breakfast", "Airport pickup on request"];
  return (
    <section id="pricing" className="py-10 md:py-12 gradient-warm">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader eyebrow="Tariffs" title="Pricing" subtitle="Simple, all-inclusive per-night rates. Group and long-stay discounts available." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80" />)
            : rooms?.map((r, i) => (
                <div key={r.id} className={`relative bg-card rounded-2xl p-6 shadow-card border ${i === 2 ? "border-primary shadow-elegant lg:-translate-y-3" : "border-border"}`}>
                  {i === 2 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>}
                  <h3 className="font-serif text-2xl mb-1">{r.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">Up to {r.capacity} guests</p>
                  <div className="mb-6">
                    <span className="text-4xl font-semibold text-primary">₹{Number(r.price_per_night).toLocaleString("en-IN")}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                  <ul className="space-y-2.5 mb-7">
                    {perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{p}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={i === 2 ? "default" : "outline"}>
                    <a href={`tel:${SITE.phoneRaw}`}>Book this room</a>
                  </Button>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
