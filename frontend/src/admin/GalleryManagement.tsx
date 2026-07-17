import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Bhai dynamic data flow ke liye 'getAllRooms' ko import matrix me add kar diya hai
import { getMedia, uploadMedia, deleteMedia, getAllRooms } from "@/service/api"; 
import { 
  Image, UploadCloud, Trash2, LayoutGrid, 
  RefreshCw, Loader2, FileImage, Info,
  AlertTriangle, CheckCircle2, Eye, BedDouble
} from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
  _id: string;
  title: string;
  category: "gallery" | "rooms";
  imageUrl: string;
  fileName: string;
  createdAt: string;
}

export function GalleryManagement() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"All" | "gallery" | "rooms">("All");
  
  // Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"gallery" | "rooms">("gallery");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Fetch Gallery Media Layer
  const { data: mediaResponse, isLoading: isMediaLoading, error: mediaError, refetch: refetchMedia } = useQuery({
    queryKey: ["adminMedia", activeTab],
    queryFn: () => getMedia(activeTab),
  });

  // 2. Fetch Dynamic Room Management Documents Layer
  const { data: roomsResponse, isLoading: isRoomsLoading, error: roomsError, refetch: refetchRooms } = useQuery({
    queryKey: ["adminRoomsData"],
    queryFn: getAllRooms,
    // Optimal Strategy: Jab 'All' ya 'rooms' tab active ho, tabhi background me rooms query fire hogi
    enabled: activeTab === "All" || activeTab === "rooms", 
  });

  const rawGalleryItems = mediaResponse?.data?.data || [];
  const rawRoomsItems = roomsResponse?.data?.data || [];

  // Data Normalization Layer: Dono collections ko standard format me fusion pipeline me daal rahe hain
  let mediaItems: MediaItem[] = [];

  // Step A: Parse and Push normal gallery items
  if (activeTab === "All" || activeTab === "gallery") {
    rawGalleryItems.forEach((item: any) => {
      mediaItems.push({
        _id: item._id,
        title: item.title || "Untitled Asset",
        category: "gallery",
        imageUrl: item.imageUrl || "",
        fileName: item.fileName || "gallery-file.jpg",
        createdAt: item.createdAt || new Date().toISOString(),
      });
    });
  }

  // Step B: Parse, Transform and Push authentic dynamic Room images array data
  if (activeTab === "All" || activeTab === "rooms") {
    rawRoomsItems.forEach((room: any) => {
      if (room.images && Array.isArray(room.images)) {
        room.images.forEach((imgUrl: string, index: number) => {
          mediaItems.push({
            // Dynamic index combined key to keep mapping react key clean
            _id: `room-${room._id}-${index}`, 
            title: room.name || `Room Space Asset`,
            category: "rooms",
            imageUrl: imgUrl,
            fileName: imgUrl.split("/").pop() || `room-asset-${index}.jpg`,
            createdAt: room.createdAt || new Date().toISOString(),
          });
        });
      }
    });
  }

  // Unified loading and error structures
  const isLoading = isMediaLoading || (isRoomsLoading && (activeTab === "All" || activeTab === "rooms"));
  const hasError = mediaError || roomsError;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (res) => {
      toast.success(res.data?.message || "Asset uploaded to gallery archive!");
      queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
      setTitle("");
      setFile(null);
      setPreviewUrl(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Upload operation failed.");
    },
    onSettled: () => setIsUploading(false)
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category === "rooms") {
      return toast.info("Bhai, Rooms images system direct Room Management panel se control hota hai!");
    }
    if (!file) return toast.warning("Bhai, file attach karo pehle.");
    if (!title.trim()) return toast.warning("Bhai, asset title blank nahi ho sakta.");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);
    formData.append("title", title);

    uploadMutation.mutate(formData);
  };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: (res) => {
      toast.success(res.data?.message || "Asset deleted permanently.");
      queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
    },
    onError: () => toast.error("Asset matrix clean down pipeline failed.")
  });

  const handleDelete = (id: string, itemCategory: string) => {
    if (itemCategory === "rooms") {
      return toast.error("Bhai, Room features images database security ke kaaran direct target room editor se modify hoti hain!");
    }
    if (confirm("Bhai, kya aap is archive asset ko delete karna chahte ho?")) {
      deleteMutation.mutate(id);
    }
  };

  const BACKEND_BASE = "https://valleymedows.onrender.com";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-background via-background to-secondary/10 min-h-screen">
      
      {/* Top Main Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            <LayoutGrid className="text-indigo-600 w-8 h-8 stroke-[2.5]" /> Multimedia Hub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
            Integrated architecture syncing standalone items and real-time Room Management arrays.
          </p>
        </div>
        <button 
          onClick={() => { 
            refetchMedia(); 
            refetchRooms();
            toast.info("Database cache re-indexed!"); 
          }}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all border border-border"
        >
          <RefreshCw className="h-4 w-4" /> Resync Repositories
        </button>
      </div>

      {/* Control Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column - Asset Upload Form */}
        <div className="bg-card border rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
          <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2 text-foreground">
            <UploadCloud className="w-5 h-5 text-indigo-500" /> Asset Ingestion Box
          </h2>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Asset Context Name</label>
              <input
                type="text"
                placeholder="e.g., Suite Balcony View..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={category === "rooms"}
                className="w-full bg-background border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all disabled:opacity-50 text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Target Storage Folder</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as "gallery" | "rooms")}
                className="w-full bg-background border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-foreground"
              >
                <option value="gallery">📂 Folder: uploads/gallery</option>
                
              </select>
            </div>

            {category === "rooms" ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs space-y-2 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="font-medium leading-relaxed">
                  <strong>Room Image Logic Warning:</strong> Multiple dynamic room assets aapke pure functional <strong>Room Management</strong> board se flow ho rhe hain. Nayi room images wahi se post karein.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Upload Content Binary</label>
                  <div className="relative group border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl transition-all duration-300 bg-secondary/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {previewUrl ? (
                      <div className="p-2 relative group-hover:opacity-90 transition-opacity">
                        <img src={previewUrl} alt="Preview" className="h-44 w-full object-cover rounded-xl shadow-inner" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <p className="text-white text-xs font-bold flex items-center gap-1"><FileImage className="w-4 h-4" /> Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 px-4 space-y-2">
                        <FileImage className="mx-auto h-10 w-10 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        <p className="text-sm font-medium text-foreground">Drag image here or browse</p>
                        <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Pushing bits...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Push To Gallery Storage
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>

        {/* Right Column - Multi Mode Gallery Grid View */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dynamic Filter Tabs */}
          <div className="flex bg-card p-1.5 rounded-2xl border shadow-sm w-max gap-1">
            {(["All", "gallery", "rooms"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                    : "text-gray-500 hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab === "All" && "🌌 All Vaults"}
                {tab === "gallery" && "🖼️ Gallery Asset"}
                
              </button>
            ))}
          </div>

          {/* Loader Elements State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-2 border border-dashed rounded-3xl bg-card">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-semibold text-gray-400 animate-pulse">Syncing dynamic data streams...</p>
            </div>
          )}

          {/* Failure Alert Grid */}
          {hasError && (
            <div className="text-center py-12 bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6">
              <AlertTriangle className="mx-auto w-10 h-10 text-rose-500 mb-2" />
              <p className="text-sm font-bold text-foreground">Failed to process resource index matrices</p>
              <p className="text-xs text-gray-400 mt-1">Check endpoints routing details inside backend configuration logs.</p>
            </div>
          )}

          {/* Final Assets Mapping Container */}
          {!isLoading && !hasError && mediaItems.length === 0 ? (
            <div className="text-center py-24 bg-card/60 border border-dashed rounded-3xl p-8">
              <Image className="mx-auto w-12 h-12 text-gray-300 mb-2" />
              <p className="text-gray-500 font-semibold text-sm">No items found in active data vector partition.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mediaItems.map((item) => (
                <div 
                  key={item._id}
                  className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative border-border/60"
                >
                  {/* Categorized Visual Badge indicator */}
                  <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border backdrop-blur-md shadow-sm ${
                    item.category === "rooms" 
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20" 
                      : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20"
                  }`}>
                    {item.category === "rooms" ? "Dynamic Room" : "Gallery Element"}
                  </span>

                  {/* Multimedia Rendering Canvas Area */}
                  <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                    <img 
                      src={item.imageUrl.startsWith("http") ? item.imageUrl : `${BACKEND_BASE}${item.imageUrl}`} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <a 
                        href={item.imageUrl.startsWith("http") ? item.imageUrl : `${BACKEND_BASE}${item.imageUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-all transform scale-90 group-hover:scale-100"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      
                      {item.category !== "rooms" && (
                        <button
                          onClick={() => handleDelete(item._id, item.category)}
                          className="p-2.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl backdrop-blur-md transition-all transform scale-90 group-hover:scale-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadata labels string layout */}
                  <div className="p-4 space-y-1 bg-card">
                    <h4 className="font-bold text-sm text-foreground truncate">{item.title}</h4>
                    <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
                      <span className="truncate max-w-[120px]" title={item.fileName}>{item.fileName}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString("en-IN", {day:'2-digit', month:'short'})}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default GalleryManagement;