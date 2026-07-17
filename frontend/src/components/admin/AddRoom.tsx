import React, { useState } from "react";
import { createRoom } from "../../service/api"; // Path check kar lena aapne jahan api.js rakha hai
import { toast } from "sonner";
import { Loader2, Plus, X, UploadCloud } from "lucide-react";

interface RoomFormData {
  roomNumber: string;
  roomType: string;
  roomName: string;
  price: number;
  capacity: number;
  description: string;
  amenities: string[];
  images: string[];
  status: "Available" | "Booked" | "Maintenance";
}

export default function AddRoom() {
  const [loading, setLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: "",
    roomType: "",
    roomName: "",
    price: 0,
    capacity: 1,
    description: "",
    amenities: [],
    images: [],
    status: "Available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "capacity" ? Number(value) : value,
    }));
  };

  // Amenities list me string add karne ke liye
  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Image handling via Cloudinary ya Base64 text URLs logic
  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() && !formData.images.includes(imageUrlInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  // Agar locally input file fetch karke database me upload chalana ho (Base64 approach)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, reader.result as string],
            }));
          }
        };
      });
      toast.success("Images selected and converted to dynamic storage!");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.roomName || !formData.roomType || formData.price <= 0) {
      toast.error("Please fill all required fields properly!");
      return;
    }

    setLoading(true);
    try {
      const response = await createRoom(formData);
      if (response.data.success) {
        toast.success(response.data.message || "Room added successfully 🎉");
        // Reset form data after success
        setFormData({
          roomNumber: "",
          roomType: "",
          roomName: "",
          price: 0,
          capacity: 1,
          description: "",
          amenities: [],
          images: [],
          status: "Available",
        });
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Something went wrong while saving to Database!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Luxury Room</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form inputs section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Name *</label>
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              placeholder="e.g. Deluxe Ocean View Suite"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="e.g. 101, B-204"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
            <input
              type="text"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              placeholder="e.g. Single, Double, Suite"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity (Persons) *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Tell details about view, bed sizing, special feature..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Dynamic Amenities Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Amenities</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              placeholder="e.g. Free Wi-Fi, Mini Bar, AC"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.amenities.map((item, index) => (
              <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center font-medium border border-indigo-200">
                {item}
                <X className="w-3.5 h-3.5 ml-1.5 cursor-pointer text-indigo-500 hover:text-indigo-800" onClick={() => handleRemoveAmenity(index)} />
              </span>
            ))}
          </div>
        </div>

        {/* Advanced Dynamic Image Selector/Uploader */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Room Images</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Direct Upload via device */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 transition relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-600">Click to upload files from device</p>
              <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG (Auto conversion)</p>
            </div>

            {/* Direct URL Method */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold text-gray-500 mb-1">Or paste dynamic Image Web URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... or cloud link"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
                >
                  Link
                </button>
              </div>
            </div>
          </div>

          {/* Selected Images Preview Grids */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-3 bg-gray-50 rounded-lg border">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-md overflow-hidden border bg-white shadow-sm group">
                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow transition opacity-90 group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit button wrapper */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition shadow-md"
        >
          {loading ? (
            <>
              <BrowseLoader className="w-5 h-5 mr-2 animate-spin" />
              Connecting & Creating Room in Database...
            </>
          ) : (
            "Save Room "
          )}
        </button>
      </form>
    </div>
  );
}

// Simple inline loader for neat setup
function BrowseLoader({ className }: { className?: string }) {
  return <Loader2 className={className} />;
}