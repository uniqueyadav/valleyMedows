import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "@/service/api"; // Sahi API path
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { CalendarCheck } from "lucide-react";
import { SectionHeader } from "./Rooms";

// Database Room Type Definition
interface DatabaseRoom {
  _id: string;
  roomName: string;
  status: string;
}

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(20),
  email: z.string().trim().email("Invalid email").max(255).or(z.literal("")),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  guests: z.number().min(1).max(20),
  room_preference: z.string().min(1, "Please select a preferred room option").max(100),
  message: z.string().max(1000),
});

export function BookingForm() {
  const { data: responseData } = useQuery({ 
    queryKey: ["rooms"], 
    queryFn: getAllRooms 
  });

  const rawRooms: DatabaseRoom[] = responseData?.data?.rooms || responseData?.data || [];

  const activeRooms = rawRooms.filter((room) => {
    const currentStatus = String(room.status || "").toLowerCase();
    return currentStatus === "available" || currentStatus === "active";
  });

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    check_in: "", check_out: "",
    guests: 2, room_preference: "", message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        check_in: form.check_in || undefined,
        check_out: form.check_out || undefined,
        guests: form.guests,
        room_preference: form.room_preference,
        message: form.message.trim(),
      };

      // YAHAN BADLA HAI: PHP URL ko hatakar aapke Node.js local port routing se connect kiya hai
      const res = await fetch("http://localhost:5000/api/bookings/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json" 
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      toast.success("Booking request saved in database successfully!");
      setForm({ name: "", phone: "", email: "", check_in: "", check_out: "", guests: 2, room_preference: "", message: "" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not save booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="py-10 md:py-12 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <SectionHeader eyebrow="Reserve" title="Book Your Stay" subtitle="Send us your details and we'll confirm availability within hours." />
        <form onSubmit={submit} className="mt-12 bg-card rounded-2xl shadow-card border border-border p-6 md:p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full Name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
            </Field>
            <Field label="Phone *">
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required maxLength={20} />
            </Field>
          </div>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
          </Field>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Check-in">
              <Input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} />
            </Field>
            <Field label="Check-out">
              <Input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} />
            </Field>
            <Field label="Guests">
              <Input type="number" min={1} max={20} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Preferred Room *">
            <select
              value={form.room_preference}
              onChange={(e) => setForm({ ...form, room_preference: e.target.value })}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">-- Choose a room option --</option>
              <option value="Any available room">Any available room</option>
              {activeRooms.map((r) => (
                <option key={r._id} value={r.roomName}>
                  {r.roomName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Message / Special Requests">
            <Textarea rows={4} value={form.message} maxLength={1000} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </Field>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            <CalendarCheck className="w-4 h-4 mr-2" />
            {submitting ? "Sending..." : "Request Booking"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}