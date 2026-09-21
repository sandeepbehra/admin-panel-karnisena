"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  House,
  CalendarDays,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    name: "Members",
    href: "/dashboard/members",
    icon: Users,
  },

  {
    name: "Home Content",
    href: "/dashboard/content/home",
    icon: House,
  },

  {
    name: "Events",
    href: "/dashboard/content/events",
    icon: CalendarDays,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    router.replace("/");
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-karni-saffron-dark text-white lg:flex">
      {/* LOGO */}

      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <ShieldCheck size={23} />
        </div>

        <div>
          <h2 className="font-bold">
            Karni Sena
          </h2>

          <p className="text-xs text-orange-100/70">
            Admin CMS
          </p>
        </div>
      </div>

      {/* MENU */}

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-karni-saffron text-white"
                  : "text-orange-100/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-orange-100 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={20} />

          Logout
        </button>
      </div>
    </aside>
  );
}