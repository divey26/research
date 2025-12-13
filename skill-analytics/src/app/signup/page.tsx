"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      setMessage("Please complete all fields.");
      return;
    }
    setMessage(`Account created for ${form.name}. You can now update your profile.`);
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 sm:px-10">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Create account</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          Start your Skill Navigator workspace
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Mock signup flow. Use the profile page to refine your details after creating an account.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="text-xs text-slate-400">Full name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jordan Patel"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="text-xs text-slate-400">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jordan@example.com"
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
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-indigo-400"
          >
            Create account
          </button>
          {message && <span className="text-sm text-emerald-200">{message}</span>}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
