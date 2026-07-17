import {
  BedDouble,
  Wallet,
  Users,
  CalendarDays,
} from "lucide-react";

const cards = [

  {
    title: "Total Rooms",
    value: 25,
    icon: BedDouble,
  },

  {
    title: "Bookings",
    value: 120,
    icon: CalendarDays,
  },

  {
    title: "Revenue",
    value: "₹1,25,000",
    icon: Wallet,
  },

  {
    title: "Customers",
    value: 75,
    icon: Users,
  },

];

export default function DashboardCards() {

  return (

    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
    >

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-2 transition-all duration-300"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500">
                  {card.title}
                </p>

                <h1 className="text-3xl font-bold mt-2">
                  {card.value}
                </h1>
              </div>

              <Icon
                size={35}
                className="text-purple-600"
              />

            </div>

          </div>
        );
      })}
    </div>
  );
}