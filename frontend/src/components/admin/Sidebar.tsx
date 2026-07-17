
import {
  Home,
  BedDouble,
  CalendarDays,
  Image,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menus = [
  { name: "Dashboard", icon: Home, path: "/admin-dashboard" },
  { name: "Rooms", icon: BedDouble, path: "/admin/rooms" },
  { name: "Bookings", icon: CalendarDays, path: "/admin/bookings" },
  { name: "Gallery", icon: Image, path: "/admin/gallery" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className="w-72 min-h-screen bg-slate-950 text-white shadow-2xl flex flex-col justify-between">
      <div>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-purple-400">Valley Meadows</h1>
          <p className="text-sm text-slate-400 mt-1">Admin Panel</p>
        </div>

        {/* Menu Items */}
        <div className="mt-4 px-3">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = location.pathname === menu.path;

            return (
              <button
                key={menu.name}
                onClick={() => navigate(menu.path)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 mb-2 ${
                  isActive 
                    ? "bg-purple-600 text-white font-semibold" 
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Icon size={20} />
                <span>{menu.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-red-600 hover:bg-red-700 transition duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}