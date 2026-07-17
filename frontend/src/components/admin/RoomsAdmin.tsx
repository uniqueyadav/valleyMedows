import { useQuery } from "@tanstack/react-query";
import { fetchRooms } from "@/lib/data";

export function RoomsAdmin() {
  const { data: rooms } = useQuery({ queryKey: ["rooms"], queryFn: fetchRooms });
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">Rooms & Pricing</h2>
      <p className="text-sm text-muted-foreground">
        Edit these in <code>src/lib/data.ts</code> (the <code>ROOMS</code> array).
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {rooms?.map((r) => (
          <div key={r.id} className="bg-card rounded-xl border border-border p-5 space-y-2 opacity-90">
            {r.image_url && <img src={r.image_url} alt={r.name} className="rounded-lg w-full h-32 object-cover" />}
            <h3 className="font-medium text-lg">{r.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{r.description}</p>
            <div className="text-sm flex gap-4 text-foreground/80">
              <span>Capacity: {r.capacity}</span>
              <span>₹{Number(r.price_per_night).toLocaleString("en-IN")} / night</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
