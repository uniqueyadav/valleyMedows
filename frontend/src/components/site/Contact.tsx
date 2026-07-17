import { Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/data";
import { SectionHeader } from "./Rooms";

export function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`;
  return (
    <section id="contact" className="py-10 md:py-12 gradient-warm">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader eyebrow="Visit" title="Contact & Location" subtitle="We'd love to host you. Reach out anytime." />
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <div className="bg-card rounded-2xl p-7 shadow-card space-y-5">
            <ContactRow icon={MapPin} label="Address" value={SITE.address} />
            <ContactRow icon={MapPin} label="Landmark" value={SITE.landmark} />
            <ContactRow icon={Phone} label="Phone" value={SITE.phone} href={`tel:${SITE.phoneRaw}`} />
            <ContactRow icon={Phone} label="Alternate Phone" value={SITE.phoneAlt} href={`tel:${SITE.phoneAltRaw}`} />
            <ContactRow icon={Mail} label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-primary-glow font-medium pt-2">
              Open in Google Maps →
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card w-full min-h-[260px] sm:aspect-[4/3] sm:min-h-[320px] lg:aspect-auto">
            <iframe title="Valley Medows location" src={mapSrc} className="w-full h-full border-0 min-h-[260px] sm:min-h-[320px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const Body = (
    <>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="text-foreground">{value}</p>
    </>
  );
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">{href ? <a href={href} className="block hover:text-primary">{Body}</a> : Body}</div>
    </div>
  );
}
