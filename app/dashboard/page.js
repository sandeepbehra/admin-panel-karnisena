import {
  Users,
  UserCheck,
  Clock3,
  CalendarDays,
} from "lucide-react";

const cards = [
  {
    title: "Total Members",
    value: "--",
    description:
      "Registered members",
    icon: Users,
  },

  {
    title: "Approved Members",
    value: "--",
    description:
      "Active memberships",
    icon: UserCheck,
  },

  {
    title: "Pending Requests",
    value: "--",
    description:
      "Waiting for approval",
    icon: Clock3,
  },

  {
    title: "Events",
    value: "--",
    description:
      "Published events",
    icon: CalendarDays,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage Karni Sena members
          and website content.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-karni-saffron">
                  <Icon size={22} />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900">
                {card.value}
              </h3>

              <p className="mt-2 font-medium text-gray-700">
                {card.title}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}