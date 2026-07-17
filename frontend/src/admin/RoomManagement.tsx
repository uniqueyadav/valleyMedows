import React, { useEffect, useState } from "react";
import { getAllRooms, updateRoom, deleteRoom } from "../service/api"; 
import { toast } from "sonner";
import { Edit2, Trash2, Eye, X, Plus, Loader2, ShieldAlert, UploadCloud, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";

interface RoomType {
  _id: string;
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

export default function RoomManagement() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modals status management
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  // Fullscreen Preview Mode State
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Dynamic input fields states
  const [editForm, setEditForm] = useState<Partial<RoomType>>({});
  const [amenityInput, setAmenityInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getAllRooms();
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load rooms!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenView = (room: RoomType) => {
    setSelectedRoom(room);
    setIsViewMode(true);
  };

  const handleOpenEdit = (room: RoomType) => {
    setSelectedRoom(room);
    setEditForm({ ...room });
    setIsEditMode(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "capacity" ? Number(value) : value,
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom?._id) return;

    setActionLoading(true);
    try {
      const res = await updateRoom(selectedRoom._id, editForm);
      if (res.data.success) {
        toast.success(res.data.message || "Room updated successfully!");
        setIsEditMode(false);
        setSelectedRoom(null);
        fetchRooms(); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update process failed!");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bhai, kya aap sach me is room ko system se delete karna chahte hain?")) return;

    setActionLoading(true);
    try {
      const res = await deleteRoom(id);
      if (res.data.success) {
        toast.success(res.data.message || "Room safely purged!");
        setIsViewMode(false);
        setSelectedRoom(null);
        fetchRooms();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Deletion blocked by server!");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && editForm.amenities) {
      if (!editForm.amenities.includes(amenityInput.trim())) {
        setEditForm({ ...editForm, amenities: [...editForm.amenities, amenityInput.trim()] });
      }
      setAmenityInput("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setEditForm((prev) => ({
              ...prev,
              images: [...(prev.images || []), reader.result as string],
            }));
          }
        };
      });
      toast.success("New images added to local pool!");
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setEditForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Happy Haven Rooms Registry</h1>
          <p className="text-sm text-gray-500">Monitor availability statuses, details, records modification</p>
        </div>
        <Link to="/admin/add-rooms" className="bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] text-white px-4 py-2 rounded-lg flex items-center font-medium shadow-md hover:shadow-lg transition-all duration-200">
          <Plus className="w-4 h-4 mr-1.5" /> Add Room
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-xl shadow border">
          <ShieldAlert className="w-12 h-12 mx-auto text-amber-500 mb-2" />
          <p className="text-gray-600 text-lg font-medium">No Rooms Added in Database yet!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="p-4">Room Specs</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-600">
              {rooms.map((room) => (
                <tr 
                  key={room._id} 
                  className="hover:bg-indigo-50/40 transition-colors duration-150 cursor-pointer group"
                  onClick={() => handleOpenView(room)}
                >
                  <td className="p-4 flex items-center gap-3">
                    {room.images && room.images[0] ? (
                      <div 
                        className="relative w-12 h-12 rounded-md border overflow-hidden shadow-sm group/img"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImageUrl(room.images[0]);
                        }}
                      >
                        <img src={room.images[0]} alt="Room thumb" className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-200">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-400">N/A</div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{room.roomName}</div>
                      <div className="text-xs text-gray-400">No: {room.roomNumber}</div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{room.roomType}</td>
                  <td className="p-4 font-semibold text-gray-900">₹{room.price}</td>
                  <td className="p-4">{room.capacity} Pax</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      room.status === "Available" ? "bg-green-100 text-green-700" :
                      room.status === "Booked" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-2">
                      {/* VIEW BUTTON */}
                      <div className="relative group/tooltip">
                        <button onClick={() => handleOpenView(room)} className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm border border-transparent hover:border-blue-700" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-10">
                          View Details
                        </span>
                      </div>

                      {/* EDIT BUTTON */}
                      <div className="relative group/tooltip">
                        <button onClick={() => handleOpenEdit(room)} className="p-2 text-amber-600 hover:text-white hover:bg-amber-600 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm border border-transparent hover:border-amber-700" title="Edit Properties">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-10">
                          Edit Room
                        </span>
                      </div>

                      {/* DELETE BUTTON */}
                      <div className="relative group/tooltip">
                        <button onClick={() => handleDelete(room._id)} className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm border border-transparent hover:border-red-700" title="Delete Room">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-10">
                          Purge Record
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 1. VIEW DETAILS MODAL */}
      {isViewMode && selectedRoom && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl scale-100 transition-transform duration-300">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition" onClick={() => setIsViewMode(false)}>
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedRoom.roomName} Details</h3>
            
            {selectedRoom.images && selectedRoom.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selectedRoom.images.map((img, i) => (
                  <div 
                    key={i} 
                    className="relative group/gallery cursor-zoom-in rounded-lg overflow-hidden border shadow-sm h-28"
                    onClick={() => setPreviewImageUrl(img)}
                  >
                    <img src={img} alt="room visual" className="w-full h-full object-cover transition-transform duration-300 group-hover/gallery:scale-105" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/gallery:opacity-100 flex items-center justify-center transition-all">
                      <Maximize2 className="w-4 h-4 text-white opacity-80" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-400 block text-xs font-medium">Room Number</span><strong className="text-gray-800">{selectedRoom.roomNumber}</strong></div>
              <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-400 block text-xs font-medium">Category Type</span><strong className="text-gray-800">{selectedRoom.roomType}</strong></div>
              <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-400 block text-xs font-medium">Price Per Night</span><strong className="text-indigo-600 text-base">₹{selectedRoom.price}</strong></div>
              <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-400 block text-xs font-medium">Max Limit</span><strong className="text-gray-800">{selectedRoom.capacity} People</strong></div>
              <div className="bg-gray-50 p-3 rounded-lg col-span-2"><span className="text-gray-400 block text-xs font-medium">Current Operational Status</span>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  selectedRoom.status === "Available" ? "bg-green-100 text-green-700" :
                  selectedRoom.status === "Booked" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {selectedRoom.status}
                </span>
              </div>
            </div>

            <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm">
              <span className="text-gray-400 block text-xs font-medium">Description</span>
              <p className="text-gray-700 mt-1 leading-relaxed">{selectedRoom.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-gray-400 block text-xs font-medium mb-1.5">Amenities Offered</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.amenities.map((am, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-md border font-medium">{am}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button onClick={() => { setIsViewMode(false); handleOpenEdit(selectedRoom); }} className="bg-amber-600 text-white hover:bg-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm">Edit info</button>
              <button onClick={() => handleDelete(selectedRoom._id)} className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm">Delete Forever</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC EDIT FORM MODAL */}
      {isEditMode && selectedRoom && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition" onClick={() => setIsEditMode(false)}>
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Room Metadata</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Operational Room Status</label>
                <select 
                  name="status" 
                  value={editForm.status || "Available"} 
                  onChange={handleEditChange} 
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm font-semibold bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="Available">🟢 Available</option>
                  <option value="Booked">🔵 Booked</option>
                  <option value="Maintenance">🟠 Maintenance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Room Name</label>
                  <input type="text" name="roomName" value={editForm.roomName || ""} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Room Number</label>
                  <input type="text" name="roomNumber" value={editForm.roomNumber || ""} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Room Type</label>
                  <input type="text" name="roomType" value={editForm.roomType || ""} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Max Capacity</label>
                  <input type="number" name="capacity" value={editForm.capacity || 1} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price Per Night (₹)</label>
                  <input type="number" name="price" value={editForm.price || 0} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amenities</label>
                <div className="flex gap-2">
                  <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="Add amenity..." className="flex-1 px-3 py-1.5 border rounded-lg text-sm outline-none" />
                  <button type="button" onClick={handleAddAmenity} className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-black transition">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editForm.amenities?.map((am, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded border border-indigo-200 flex items-center">
                      {am}
                      <X className="w-3 h-3 ml-1 cursor-pointer text-indigo-400 hover:text-indigo-600" onClick={() => setEditForm({ ...editForm, amenities: editForm.amenities?.filter((_, idx) => idx !== i) })} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Manage Room Images</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="border border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/10 transition relative">
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                    <p className="text-xs font-semibold text-gray-600">Upload new images</p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex gap-2">
                      <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Or paste image URL..." className="flex-1 px-3 py-2 border rounded-lg text-xs outline-none" />
                      <button type="button" onClick={handleAddImageUrl} className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-black transition">Link</button>
                    </div>
                  </div>
                </div>

                {editForm.images && editForm.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 p-2 bg-gray-50 rounded-lg border">
                    {editForm.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md overflow-hidden border bg-white shadow-sm group/editimg">
                        <img src={img} alt={`Edit preview ${idx}`} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setPreviewImageUrl(img)} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow transition opacity-90 hover:scale-110"
                          title="Remove this image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button type="button" onClick={() => setIsEditMode(false)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={actionLoading} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition shadow-sm">
                  {actionLoading && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                  Commit Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC FULLSCREEN IMAGE PREVIEW LIGHTBOX */}
      {previewImageUrl && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] cursor-zoom-out p-4 animate-fade-in backdrop-blur-md"
          onClick={() => setPreviewImageUrl(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition duration-200"
            onClick={() => setPreviewImageUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={previewImageUrl} 
            alt="Room Asset Fullscreen" 
            className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} // modal click se wrap off na ho
          />
        </div>
      )}
    </div>
  );
}