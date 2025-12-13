"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setMessage("Enter email and password to continue.");
      return;
    }
    setMessage("Logged in (mock). Head to your dashboard or profile.");
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 sm:px-10">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Login</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          Welcome back to Skill Navigator
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Mock authentication for navigation. Use the dashboard to view insights.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="text-xs text-slate-400">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="alex@example.com"
              type="email"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="text-xs text-slate-400">Password</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              type="password"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-cyan-400"
          >
            Login
          </button>
          {message && <span className="text-sm text-emerald-200">{message}</span>}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Need an account?{" "}
          <Link href="/signup" className="text-cyan-300 hover:text-cyan-200">
            Create one
          </Link>{" "}
          or update your <Link href="/profile" className="text-cyan-300 hover:text-cyan-200">profile</Link>.
        </p>
      </div>
    </main>
  );
}
