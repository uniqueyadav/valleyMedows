import Header from "../components/admin/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBookings, updateBookingStatus, getAllRooms } from "@/service/api"; 
import { Loader2, Calendar, AlertCircle, BedDouble, Users, TicketCheck, LogOut, BellRing } from "lucide-react";

// Real-Time System Updates Layer Dependencies
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

// Backend Server Connection Setup (Apne running Port string se update karein)
// const SOCKET_SERVER_URL = "https://valleymedows.onrender.com";
const SOCKET_SERVER_URL = "http://localhost:5000";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Real-time structural notification state
  const [liveBookingAlert, setLiveBookingAlert] = useState(null);

  // 1. Session Token Validation Verification & Socket Real-Time Setup
  useEffect(() => {
    document.title = "Admin — Valley Meadows";
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/adminlogin", { replace: true });
      return;
    }

    // Initialize Connection Matrix
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"], // smooth communication infrastructure
    });

    // 🚨 Real-time Event Receiver Channel
    socket.on("new_booking_request", (data) => {
      console.log("Live Booking Stream Object Caught:", data);
      
      // A. Global State Update: UI core banner active karega
      setLiveBookingAlert(data.booking);

      // B. Dynamic Query Invalidation: Bina refresh live table content refresh karega
      queryClient.invalidateQueries({ queryKey: ["adminRecentBookings"] });

      // C. Premium Native Floating Toast Popup Notification
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out'
          } max-w-md w-full bg-white border border-indigo-100 shadow-2xl rounded-2xl pointer-events-auto flex overflow-hidden`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl mt-0.5 shrink-0 animate-bounce">
                <BellRing className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-indigo-600">🚨 New Booking Request!</p>
                <p className="text-sm text-gray-800 font-bold mt-1">
                  {data.booking.name}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Room Choice: <span className="font-bold text-gray-700">{data.booking.room_preference}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Phone: {data.booking.phone} | Guests: {data.booking.guests || 1}
                </p>
              </div>
            </div>
          </div>
          <div className="border-l border-gray-100 flex">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-2xl px-4 flex items-center justify-center text-xs font-black uppercase tracking-wider text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 1000000 }); // 10 Seconds Active display retention window
    });

    // Active connection tear-down structure to prevent pipeline leakages
    return () => {
      socket.disconnect();
    };
  }, [navigate, queryClient]);

  // 2. Fetch Active Bookings Pipeline
  const { data: bookingsRes, isLoading: bookingsLoading, error: bookingsErr } = useQuery({
    queryKey: ["adminRecentBookings"],
    queryFn: async () => {
      const response = await getAllBookings();
      return response;
    },
    refetchOnWindowFocus: true,
  });

  // 3. Fetch Dynamic Rooms Metrics Array
  const { data: roomsRes, isLoading: roomsLoading, error: roomsErr } = useQuery({
    queryKey: ["adminTotalRoomsMetrics"],
    queryFn: async () => {
      const response = await getAllRooms();
      return response;
    },
    refetchOnWindowFocus: true,
  });

  // 4. Live Check-out Status Mutation Engine
  const checkoutMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminRecentBookings"] });
    },
    onError: (err) => {
      alert("Bhai database me check-out state save nahi ho payi. Ek baar backend Enum ya controller check karo.");
      console.error(err);
    }
  });

  const handleCheckoutAction = (bookingId: string) => {
    if (window.confirm("Bhai kya aap is guest ka Check-out complete karna chahte hain?")) {
      checkoutMutation.mutate({ id: bookingId, status: "checked-out" });
    }
  };

  // Structural normalization layers
  const rawBookings = bookingsRes?.data?.data || bookingsRes?.data || [];
  const roomsDataArray = roomsRes?.data?.rooms || roomsRes?.data?.data || roomsRes?.data || [];
  
  const totalRooms = roomsDataArray.length;
  const totalBookings = rawBookings.length;

  const uniqueUsersCount = new Set(
    rawBookings.map((b: any) => b.customerName || b.name).filter(Boolean)
  ).size;

  const recentBookings = Array.isArray(rawBookings) ? [...rawBookings].slice(0, 5) : [];
  const upcomingCheckins = Array.isArray(rawBookings) ? rawBookings.filter((b: any) => b.status === "confirmed").slice(0, 3) : [];

  const globalLoading = bookingsLoading || roomsLoading;
  const globalError = bookingsErr || roomsErr;

  return (
    <div className="flex bg-gradient-to-br from-purple-100 via-cyan-50 to-indigo-100 min-h-screen">
      <div className="flex-1 p-6">
        
        <Header />

        {/* 🌟 Toast Notification Renderer Container injection point */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Sticky Dynamic Top Page Alert Banner Component */}
        {liveBookingAlert && (
          <div className="flex items-center justify-between p-5 bg-amber-50 border-2 border-amber-200 mt-6 rounded-3xl text-amber-900 shadow-md animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-2xl shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-700 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-amber-800">New Booking Pipeline Request Pending</p>
                <p className="text-xs font-medium text-amber-700 mt-0.5">
                  Guest <b>{liveBookingAlert.name}</b> ({liveBookingAlert.phone}) requested a **{liveBookingAlert.room_preference}** unit. Check availability structure instantly.
                </p>
              </div>
            </div>
            <button
              onClick={() => setLiveBookingAlert(null)}
              className="text-xs font-black uppercase tracking-widest px-4 py-2 bg-amber-100 border border-amber-200 hover:bg-amber-600 hover:text-white rounded-xl transition-all"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Network Loading Vector State */}
        {globalLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white mt-8 rounded-3xl shadow-xl space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-bold text-gray-400">Syncing property analytics maps...</p>
          </div>
        )}

        {/* Global Network Failure Alert State */}
        {globalError && (
          <div className="flex items-center gap-3 p-6 bg-rose-50 border border-rose-200 mt-8 rounded-3xl text-rose-700 shadow-sm">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-sm font-bold">Failed to connect with analytical database pools.</p>
              <p className="text-xs opacity-80">Verify network proxy permissions or backend routing clusters.</p>
            </div>
          </div>
        )}

        {/* Content Engine Renders */}
        {!globalLoading && !globalError && (
          <>
            {/* New Database Connected Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              
              {/* Dynamic Total Rooms Metric Box */}
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex items-center justify-between group hover:scale-[1.01] transition-all">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Rooms Listed</p>
                  <h3 className="text-3xl font-black mt-2 text-gray-800">{totalRooms}</h3>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
                  <BedDouble className="w-7 h-7 text-purple-600" />
                </div>
              </div>

              {/* Dynamic Total Registered Users Metric Box */}
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex items-center justify-between group hover:scale-[1.01] transition-all">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Active Guests Tracked</p>
                  <h3 className="text-3xl font-black mt-2 text-gray-800">{uniqueUsersCount || 0}</h3>
                </div>
                <div className="p-4 bg-cyan-50 rounded-2xl group-hover:bg-cyan-100 transition-colors">
                  <Users className="w-7 h-7 text-cyan-600" />
                </div>
              </div>

              {/* Dynamic Gross Bookings Trace Box */}
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex items-center justify-between group hover:scale-[1.01] transition-all">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Bookings Managed</p>
                  <h3 className="text-3xl font-black mt-2 text-gray-800">{totalBookings}</h3>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                  <TicketCheck className="w-7 h-7 text-emerald-600" />
                </div>
              </div>

            </div>

            {/* Recent Bookings Section */}
            <div className="bg-white mt-8 rounded-3xl shadow-xl p-6 overflow-hidden">
              <h1 className="text-2xl font-bold mb-5 tracking-tight text-gray-800">
                Recent Bookings
              </h1>

              {recentBookings.length === 0 ? (
                <div className="text-center py-10 text-sm font-semibold text-gray-400">
                  Database pipeline empty. No recent bookings registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-3">Guest Name</th>
                        <th className="pb-3">Room Space</th>
                        <th className="pb-3">Transaction Status</th>
                        <th className="pb-3 text-right">Settled Amount</th>
                        <th className="pb-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                      {recentBookings.map((booking: any) => {
                        const guestName = booking.customerName || booking.name || "Unknown Guest";
                        const roomIdentifier = typeof booking.room === "object" 
                          ? booking.room?.name || booking.room?.roomNumber 
                          : booking.room || "N/A";
                        const grossAmount = booking.totalPrice || booking.amount || 0;

                        return (
                          <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 font-bold text-gray-900">{guestName}</td>
                            <td>
                              <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-bold text-gray-600">
                                {roomIdentifier}
                              </span>
                            </td>
                            <td>
                              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                                booking.status === "confirmed" 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : booking.status === "checked-out" || booking.status === "checked Out"
                                  ? "bg-blue-100 text-blue-700" 
                                  : booking.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="text-right font-mono font-bold text-gray-900">
                              ₹{grossAmount}
                            </td>
                            <td className="text-center py-2">
                              {booking.status === "confirmed" ? (
                                <button
                                  onClick={() => handleCheckoutAction(booking._id)}
                                  disabled={checkoutMutation.isPending}
                                  className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-rose-700 hover:text-white font-bold text-xs py-1.5 px-3 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <LogOut className="w-3.5 h-3.5" />
                                  <span>{checkoutMutation.isPending ? "Syncing..." : "check Out"}</span>
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400 italic">No Action</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Upcoming Checkins Section */}
            <div className="bg-white mt-8 rounded-3xl shadow-xl p-6">
              <h1 className="text-2xl font-bold mb-5 tracking-tight text-gray-800">
                Upcoming Check-ins
              </h1>

              {upcomingCheckins.length === 0 ? (
                <div className="text-center py-10 text-sm font-semibold text-gray-400">
                  No confirmed check-ins scheduled inside the upcoming queue window.
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-5">
                  {upcomingCheckins.map((booking: any, index: number) => {
                    const roomIdentifier = typeof booking.room === "object" 
                      ? booking.room?.name || booking.room?.roomNumber 
                      : booking.room || "Space Asset";
                    
                    const cardStyles = [
                      "bg-purple-100 text-purple-900 border-purple-200",
                      "bg-cyan-100 text-cyan-900 border-cyan-200",
                      "bg-emerald-100 text-emerald-900 border-emerald-200"
                    ];

                    return (
                      <div 
                        key={booking._id} 
                        className={`p-5 rounded-2xl border flex flex-col justify-between shadow-sm ${cardStyles[index % 3]}`}
                      >
                        <div>
                          <p className="text-xs uppercase font-black tracking-widest opacity-60">Confirmed Space</p>
                          <h4 className="text-lg font-black mt-0.5">{roomIdentifier}</h4>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold opacity-80">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("en-IN", {
                              day: "2-digit", 
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            }) : "Date Missing"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}