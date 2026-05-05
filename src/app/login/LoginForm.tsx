"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Changed flex to flex-col (mobile) and md:flex-row (desktop) */}
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Form Section: full width on mobile, 1/2 on medium screens+ */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white md:bg-gray-100 py-12 px-6">
          <div className="w-full max-w-sm">
            {" "}
            {/* Changed w-95 to max-w-sm for better containment */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Welcome back
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-base md:text-sm shadow-sm
                   placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1
                   focus:ring-blue-500 text-black"
                  placeholder="alice@ticktock.dev"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-base md:text-sm shadow-sm
                   placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1
                   focus:ring-blue-500 text-black"
                  placeholder="password123"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-3 md:py-2 text-sm font-semibold text-white
               shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
               focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 mx-4 mt-4">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Info Panel: hidden on very small screens, or stacked at the bottom */}
        <div className="w-full md:w-1/2 bg-blue-600 flex items-center justify-center text-white p-8 md:p-12">
          <div className="max-w-md text-center md:text-left">
            <h1 className="text-3xl font-bold mb-4">ticktock</h1>
            <p className="text-sm md:text-base leading-relaxed text-blue-100">
              Introducing ticktock, our cutting-edge timesheet web application
              designed to revolutionize how you manage employee work hours. With
              ticktock, you can effortlessly track and monitor employee
              attendance and productivity from anywhere, anytime.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
