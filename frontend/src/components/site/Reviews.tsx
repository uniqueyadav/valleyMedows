import { Star, Quote } from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { SectionHeader } from "./Rooms";

const REVIEWS = [
  { name: "Aarav Sharma", location: "Delhi", rating: 5, text: "Stunning location and warm hosts. The rooms are spotless and the breakfast was amazing. Felt like home in Kashmir." },
  { name: "Priya Iyer", location: "Bangalore", rating: 5, text: "Perfect base for exploring Srinagar. Easy airport pickup, lovely garden views, and the staff went out of their way for us." },
  { name: "Rahul Verma", location: "Mumbai", rating: 5, text: "Booked the family room for 4 nights. Spacious, clean, and very peaceful. Will definitely come back next summer." },
  { name: "Sana Khan", location: "Hyderabad", rating: 5, text: "Authentic Kashmiri hospitality. Loved the kahwa every evening. Great value compared to nearby hotels." },
  { name: "James O'Connor", location: "Dublin", rating: 5, text: "A hidden gem in Srinagar. Friendly owners helped plan our entire trip including Gulmarg and Pahalgam." },
  { name: "Meera Nair", location: "Kochi", rating: 5, text: "Quiet, comfortable and beautifully maintained. The location near the airport made arrival/departure very easy." },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-10 md:py-12 gradient-warm">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader eyebrow="Guests" title="What Guests Say" subtitle="Stories from travellers who stayed with us." />
        <div className="mt-12 px-4 md:px-12">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          >
            <CarouselContent>
              {REVIEWS.map((r, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-full bg-card rounded-2xl shadow-card border border-border p-6 flex flex-col">
                    <Quote className="w-8 h-8 text-primary/30 mb-3" />
                    <p className="text-foreground/80 leading-relaxed flex-1 mb-5">{r.text}</p>
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.location}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
