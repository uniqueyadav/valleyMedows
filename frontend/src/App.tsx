
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import RoomManagement from "./admin/RoomManagement";
import Sidebar from "./components/admin/Sidebar";
import AddRoom from "./components/admin/AddRoom";
import GalleryManagement from "./admin/GalleryManagement";
import BookingManagement from "./admin/BookingManagement";

const queryClient = new QueryClient();

// Layout Wrapper to keep Sidebar persistent in admin views
const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Frontend Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* Persistent Admin Layout Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<RoomManagement />} />
            <Route path="/admin/add-rooms" element={<AddRoom />} />
            <Route path="/admin/gallery" element={<GalleryManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            {/* Baaki sections ke route bhi isi layout ke andar direct use ho jayenge */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}