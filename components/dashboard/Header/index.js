"use client";

import { Bell } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-5 md:px-8">
      <div>
        <p className="text-sm text-gray-500">
          Welcome back,
        </p>

        <h2 className="font-semibold text-gray-900">
          {user?.fullName || "Admin"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50">
          <Bell size={19} />
        </button>

        <div className="flex items-center gap-3">
          {user?.profilePhotoUrl ? (
           
            <Image src={user.profilePhotoUrl} alt={
                 user?.fullName ||
                 "Admin"
               }
               width={10}
               height={10}
               className="object-fill h-10 w-10 rounded-full"
               >

            </Image>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-karni-saffron font-semibold text-white">
              {user?.fullName
                ?.charAt(0)
                ?.toUpperCase() ||
                "A"}
            </div>
          )}

          <div className="hidden sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-gray-800">
              {user?.fullName ||
                "Admin"}
            </p>

            <p className="text-xs text-gray-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}