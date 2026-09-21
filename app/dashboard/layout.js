"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}) {
  const router = useRouter();

  const {
    loading,
    isLoggedIn,
  } = useAuth();

  useEffect(() => {
    if (
      !loading &&
      !isLoggedIn
    ) {
      router.replace("/");
    }
  }, [
    loading,
    isLoggedIn,
    router,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f1]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

          <p className="mt-4 text-sm text-gray-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="p-5 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}