import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBookings, updateBookingStatus, deleteBooking } from "@/service/api";
import { 
  Calendar, Users, Phone, Mail, MessageSquare, 
  CheckCircle, XCircle, Trash2, Search, Filter, 
  RefreshCw, Loader2, AlertCircle, BookmarkCheck,
  TrendingUp, Clock, CheckSquare
} from "lucide-react";
import { toast } from "sonner";

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  check_in?: string;
  check_out?: string;
  guests: number;
  room_preference: string;
  message?: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

export function BookingManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetching live data via Axios api
  const { data: responseData, isLoading, error, refetch } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: getAllBookings,
  });

  const bookings: Booking[] = responseData?.data?.data || responseData?.data || [];

  // Mutation for updating status
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Status updated!");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  // Mutation for deleting a booking
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Booking removed.");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
    },
    onError: () => toast.error("Could not delete booking"),
  });

  // Filters & Search logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.phone.includes(searchTerm) || 
                          b.room_preference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Counters
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "Pending").length;
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center space-y-3">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="text-base font-semibold text-muted-foreground animate-pulse">Syncing Live Reservations Database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center shadow-2xl backdrop-blur-md">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3 animate-bounce" />
        <h3 className="text-lg font-bold text-foreground">Database Connection Failed</h3>
        <p className="text-muted-foreground text-sm mt-1">Bhai backend server ya network configurations check karo.</p>
        <button onClick={() => refetch()} className="mt-5 flex items-center gap-2 mx-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-600/20 transition-all duration-300 transform hover:scale-105 active:scale-95">
          <RefreshCw className="h-4 w-4" /> Reconnect Now
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen transition-all duration-500">
      
      {/* Dynamic Top Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6 border-border/60">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            <BookmarkCheck className="text-indigo-600 w-9 h-9 stroke-[2.5]" /> Premium Booking Desk
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Monitor, filter, and validate elite room reservations instantly.</p>
        </div>
        <button 
          onClick={() => {
            refetch();
            toast.info("Database matrix re-synchronized!");
          }} 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-xl hover:shadow-indigo-600/20 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <RefreshCw className="h-4 w-4" /> Refresh System Matrix
        </button>
      </div>

      {/* Advance Dynamic Stats Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Card */}
        <div className="relative group overflow-hidden bg-card border rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Enquiries</p>
              <p className="text-4xl font-black mt-2 tracking-tight text-foreground">{total}</p>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="relative group overflow-hidden bg-card border rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-amber-500/20 bg-gradient-to-br from-card to-amber-500/[0.02]">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-orange-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">Pending Approvals</p>
              <p className="text-4xl font-black mt-2 tracking-tight text-amber-600 dark:text-amber-400">{pending}</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Confirmed Card */}
        <div className="relative group overflow-hidden bg-card border rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/[0.02]">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-teal-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">Confirmed Stays</p>
              <p className="text-4xl font-black mt-2 tracking-tight text-emerald-600 dark:text-emerald-400">{confirmed}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Glassmorphism Control Panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card/60 backdrop-blur-md p-4 rounded-2xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients, phone grids or room archetypes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 border-border/70 placeholder:text-muted-foreground/60 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="text-muted-foreground w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 bg-background border border-border/70 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="All">All Categories</option>
            <option value="Pending">Status: Pending</option>
            <option value="Confirmed">Status: Confirmed</option>
            <option value="Cancelled">Status: Cancelled</option>
          </select>
        </div>
      </div>

      {/* Grid with Premium Micro-Interactions */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border/80 rounded-3xl bg-card/40 backdrop-blur-sm">
          <p className="text-muted-foreground font-semibold text-base">No real-time records align with your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((b) => (
            <div 
              key={b._id} 
              className="group bg-card border rounded-3xl p-6 transition-all duration-300 relative flex flex-col justify-between hover:shadow-2xl hover:border-indigo-500/40 hover:bg-gradient-to-b hover:from-card hover:to-secondary/10 overflow-hidden"
            >
              {/* Dynamic Neon Background Glow on Hover */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/5 to-purple-500/0 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Premium Card Header */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-card-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {b.name}
                    </h3>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground select-all">
                      UUID: {b._id}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm border ${
                    b.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20" :
                    b.status === "Cancelled" ? "bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20" :
                    "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse dark:bg-amber-500/20"
                  }`}>
                    {b.status}
                  </span>
                </div>

                {/* Info Grid Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t border-b py-4 my-4 border-border/60">
                  <div className="flex items-center gap-3 text-foreground/80 hover:text-indigo-600 transition-colors duration-200">
                    <Phone className="w-4 h-4 text-indigo-500/70 shrink-0" /> 
                    <a href={`tel:${b.phone}`} className="hover:underline font-medium">{b.phone}</a>
                  </div>
                  {b.email && (
                    <div className="flex items-center gap-3 text-foreground/80 truncate hover:text-indigo-600 transition-colors duration-200">
                      <Mail className="w-4 h-4 text-indigo-500/70 shrink-0" /> 
                      <a href={`mailto:${b.email}`} className="hover:underline font-medium truncate">{b.email}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Calendar className="w-4 h-4 text-indigo-500/70 shrink-0" />
                    <span className="font-semibold text-xs">
                      {b.check_in ? new Date(b.check_in).toLocaleDateString("en-IN", {day: 'numeric', month: 'short'}) : "N/A"} → {b.check_out ? new Date(b.check_out).toLocaleDateString("en-IN", {day: 'numeric', month: 'short'}) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Users className="w-4 h-4 text-indigo-500/70 shrink-0" /> 
                    <span className="font-medium">{b.guests} Premium Guests</span>
                  </div>
                </div>

                {/* Preference Badges */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-bold bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-xl shadow-inner">
                    Preference: {b.room_preference}
                  </span>
                </div>

                {/* Premium User Message Block */}
                {b.message && (
                  <div className="mt-4 bg-secondary/50 rounded-2xl p-4 flex items-start gap-3 border border-border/40 group-hover:bg-background transition-colors duration-300">
                    <MessageSquare className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                      "{b.message}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Rows */}
              <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap justify-between items-center gap-4">
                <span className="text-[11px] text-muted-foreground/80 font-semibold">
                  Logs In: {new Date(b.createdAt).toLocaleString("en-IN", {hour: '2-digit', minute:'2-digit', day:'numeric', month:'short'})}
                </span>
                
                {/* Premium Glow Action Buttons Control */}
                <div className="flex items-center gap-2">
                  {b.status === "Pending" && (
                    <>
                      <button 
                        onClick={() => statusMutation.mutate({ id: b._id, status: "Confirmed" })}
                        className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 transform hover:scale-105"
                        title="Confirm Booking"
                      >
                        <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button 
                        onClick={() => statusMutation.mutate({ id: b._id, status: "Cancelled" })}
                        className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20 hover:bg-amber-600 hover:text-white hover:shadow-lg hover:shadow-amber-600/30 transition-all duration-300 transform hover:scale-105"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      if(confirm("Bhai, kya aap sach me is reservation log ko database se permanently remove karna chahte hain?")) {
                        deleteMutation.mutate(b._id);
                      }
                    }}
                    className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl border border-rose-500/20 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-600/30 transition-all duration-300 transform hover:scale-105"
                    title="Delete Permanently"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingManagement;