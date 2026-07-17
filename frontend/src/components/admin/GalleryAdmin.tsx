import { useQuery } from "@tanstack/react-query";
import { fetchGallery } from "@/lib/data";

export function GalleryAdmin() {
  const { data: images } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">Gallery</h2>
      <p className="text-sm text-muted-foreground">
        Edit these in <code>src/lib/data.ts</code> (the <code>GALLERY</code> array).
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images?.map((img) => (
          <div key={img.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <img src={img.image_url} alt={img.caption} className="w-full aspect-square object-cover" />
            <div className="p-3 text-sm truncate">{img.caption || "Untitled"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
