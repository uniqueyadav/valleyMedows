import { useQuery } from "@tanstack/react-query";
// Bhai dynamic backend connectivity ke liye direct getMedia ko import kiya hai
import { getMedia } from "@/service/api"; 
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "./Rooms";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  fileName: string;
  createdAt: string;
}

export function Gallery() {
  // 1. Database se sifr 'gallery' category ka data fetch kar rahe hain
  const { data: responseData, isLoading } = useQuery({ 
    queryKey: ["mainSiteGallery"], 
    queryFn: () => getMedia("gallery") // Admin jo uploads/gallery me dalega wahi aayega
  });

  // Backend response format ke mutabik data extract kar rahe hain
  const images: GalleryItem[] = responseData?.data?.data || [];
  const BACKEND_BASE = "http://localhost:5000";

  return (
    <section id="gallery" className="py-10 md:py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader eyebrow="Property" title="Gallery" subtitle="A glimpse of Valley Medows and the beauty of Srinagar." />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-12">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)
            : images.map((img, i) => {
                // Agar URL pure absolute path (http) nahi hai toh backend base URL append karein
                const fullImageUrl = img.imageUrl.startsWith("http") 
                  ? img.imageUrl 
                  : `${BACKEND_BASE}${img.imageUrl}`;

                return (
                  <div 
                    key={img._id} 
                    className={`group relative overflow-hidden rounded-xl ${
                      i % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"
                    }`}
                  >
                    <img 
                      src={fullImageUrl} 
                      alt={img.title || "Gallery image"} 
                      loading="lazy" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {img.title && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {img.title}
                      </div>
                    )}
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}