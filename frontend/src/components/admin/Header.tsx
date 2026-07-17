import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <div
      className="bg-white shadow-lg rounded-3xl p-5 flex justify-between items-center"
    >

      <div>
        <h1 className="text-3xl font-bold">
          Welcome Super Admin
        </h1>

        <p className="text-gray-500">
          Manage your room booking system.
        </p>
      </div>

      <div className="flex gap-5 items-center">

        

       

        <img
          src="https://i.pravatar.cc/150"
          className="w-12 h-12 rounded-full"
        />

      </div>
    </div>
  );
}