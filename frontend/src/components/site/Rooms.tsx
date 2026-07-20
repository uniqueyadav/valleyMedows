import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Users, Check, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { getAllRooms } from "@/service/api"; 
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Exact Database Schema Structure
interface DatabaseRoom {
  _id: string;          
  roomName: string;     
  roomNumber: string;
  roomType: string;
  price: number;        
  capacity: number;     
  description: string;
  amenities: string[];
  images: string[];     
  status: string;       
}

export function Rooms() {
  const { data: responseData, isLoading, error } = useQuery({ 
    queryKey: ["rooms"], 
    queryFn: getAllRooms 
  });

  // Safe nested scenarios extract
  const rawData = responseData?.data?.rooms || responseData?.data || responseData?.rooms || responseData || [];

  // Strict Array Check
  const rooms: DatabaseRoom[] = Array.isArray(rawData) 
    ? rawData 
    : (rawData && typeof rawData === "object" ? (rawData.rooms || Object.values(rawData).find(Array.isArray) || []) : []);

  // Filter Active/Available rooms safely
  const activeRooms = rooms.filter((room) => {
    if (!room) return false;
    const currentStatus = String(room.status || "").toLowerCase();
    return currentStatus === "available" || currentStatus === "active";
  });

  const fallbackPerks = ["Complimentary breakfast", "Free Wi-Fi", "Daily housekeeping"];

  return (
    <section id="rooms" className="py-10 md:py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          eyebrow="Stay & Tariffs"
          title="Our Rooms & Pricing"
          subtitle="Comfortable, thoughtfully designed rooms with simple, all-inclusive per-night rates."
        />

        {error && (
          <div className="text-center py-10 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 mt-12 max-w-xl mx-auto">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Bhai, Localhost Server (Port 5000) se connect nahi ho pa raha hai. Server check karein.</p>
          </div>
        )}

        {!isLoading && !error && activeRooms.length === 0 && (
          <div className="text-center py-12 bg-muted/40 rounded-2xl border border-dashed mt-12 max-w-md mx-auto">
            <p className="text-muted-foreground font-medium">Database me koi bhi 'Available' room nahi mila.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Total items fetched: {rooms.length}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 justify-center">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-[28rem] w-full rounded-2xl" />)
            : activeRooms.map((r) => (
                <article key={r._id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant border border-border/60 hover:border-primary/20 transition-all duration-300 flex flex-col w-full">
                  
                  <RoomSlider images={r.images} roomName={r.roomName} />
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-serif text-2xl text-card-foreground line-clamp-1">{r.roomName}</h3>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{r.roomType} • No: {r.roomNumber}</p>
                      </div>
                      <span className="flex items-center gap-1 text-sm bg-muted/60 text-muted-foreground px-2 py-1 rounded-md shrink-0 font-medium">
                        <Users className="w-4 h-4" />{r.capacity}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 min-h-[3.75rem]">{r.description}</p>
                    
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="text-primary text-2xl font-bold">₹{Number(r.price).toLocaleString("en-IN")}</span>
                      <span className="text-muted-foreground text-sm font-medium">/ night</span>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {r.amenities && r.amenities.length > 0 ? (
                        r.amenities.slice(0, 4).map((am) => (
                          <li key={am} className="flex items-start gap-2 text-sm font-medium">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/90 line-clamp-1">{am}</span>
                          </li>
                        ))
                      ) : (
                        fallbackPerks.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{p}</span>
                          </li>
                        ))
                      )}
                    </ul>
                    
                    <Button asChild className="w-full mt-auto shadow-sm">
                      <a href="#book">Book this room</a>
                    </Button>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}

function RoomSlider({ images, roomName }: { images?: string[]; roomName: string }) {
  const list = images && images.length > 0 ? images : ["/placeholder-room.jpg"];
  const [idx, setIdx] = useState(0);
  const go = (delta: number) => setIdx((i) => (i + delta + list.length) % list.length);
  
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-muted border-b">
      {list.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${roomName} ${i + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105 ${i === idx ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      
      {list.length > 1 && (
        <>
          <button type="button" onClick={(e) => { e.preventDefault(); go(-1); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-sm">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={(e) => { e.preventDefault(); go(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="uppercase tracking-[0.25em] text-xs text-primary font-bold mb-3">{eyebrow}</p>
      <h2 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>}
    </div>
  );
}