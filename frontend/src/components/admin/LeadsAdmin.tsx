import { SITE } from "@/lib/data";

export function LeadsAdmin() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">Booking Requests</h2>
      <div className="bg-card rounded-xl border border-border p-6 text-sm text-muted-foreground space-y-2">
        <p>Booking requests are no longer stored. The booking form on the site now opens the visitor's email app and sends the request directly to <a className="text-primary" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        <p>Check that inbox to view new requests.</p>
      </div>
    </div>
  );
}
