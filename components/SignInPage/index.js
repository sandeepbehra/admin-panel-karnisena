"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const LOGIN_API =
  "https://6zq9472qqb.execute-api.ap-south-1.amazonaws.com/admin/login";

export default function SigninPage() {
  const router = useRouter();

  const { login, isLoggedIn } = useAuth();

  const [mobile, setMobile] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setMobile(value.slice(0, 10));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!mobile.trim()) {
      setError("Please enter mobile number.");

      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10 digit mobile number.");

      return;
    }

    if (!password.trim()) {
      setError("Please enter password.");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(LOGIN_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userName: mobile,

          password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Invalid mobile number or password.");
      }

      const { token, sessionId, userData } = data?.data || {};

      if (!token || !sessionId || !userData) {
        throw new Error("Invalid login response.");
      }

      if (userData?.role?.key !== "ADMIN") {
        throw new Error("You are not authorized to access the admin panel.");
      }

      login({
        token,
        sessionId,
        userData,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff8f1]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-karni-saffron-dark lg:flex lg:flex-col lg:justify-between">
          {/* Background Decorations */}

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-karni-saffron opacity-20" />

          <div className="absolute -bottom-40 -right-24 h-[450px] w-[450px] rounded-full bg-karni-saffron opacity-20" />

          {/* Content */}

          <div className="relative z-10 flex h-full flex-col justify-center px-16 xl:px-24">
            <div className="mb-12">
              {/* Logo */}

              <Image
                src="/logo-full.png"
                alt="Karni Sena Logo"
                width={160}
                height={160}
                priority
                className="mb-8 h-auto w-40 object-contain"
              />

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-200">
                Karni Sena
              </p>

              <h1 className="max-w-xl text-5xl font-bold leading-tight text-white xl:text-6xl">
                Admin
                <span className="text-karni-saffron"> CMS</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-orange-100/80">
                Manage members, membership requests, leadership, events and
                website content from one place.
              </p>
            </div>

            {/* Info Card */}

            <div className="max-w-lg rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                <span className="font-medium text-white">Karni Sena CMS</span>
              </div>

              <p className="text-sm leading-6 text-orange-100/70">
                Secure administration panel for managing your website and
                membership platform.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}

            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo-full.png"
                  alt="Karni Sena Logo"
                  width={70}
                  height={70}
                  priority
                  className="h-auto w-16 object-contain"
                />

                <div>
                  <h2 className="font-bold text-gray-900">Karni Sena</h2>

                  <p className="text-xs text-gray-500">Admin CMS</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-karni-saffron">
                Admin Portal
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Welcome Back
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Sign in with your registered mobile number to access the CMS.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mobile Number */}

              <div>
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Mobile Number
                </label>

                <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-karni-saffron focus-within:ring-2 focus-within:ring-orange-100">
                  <div className="flex items-center border-r border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-600">
                    +91
                  </div>

                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    maxLength={10}
                    onChange={handleMobileChange}
                    disabled={loading}
                    className="h-14 w-full bg-transparent px-4 text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={password}
                    disabled={loading}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-karni-saffron focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}

              <div className="flex w-full justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-karni-saffron transition hover:text-karni-saffron-dark"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-karni-saffron-dark font-semibold text-white transition hover:bg-karni-saffron disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer */}

            <p className="mt-8 text-center text-xs text-gray-400">
              Authorized administrators only
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
