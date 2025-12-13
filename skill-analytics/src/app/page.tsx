import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10">
      <div className="rounded-3xl border border-slate-900/80 bg-slate-900/60 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Skill Navigator
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
          Market-aligned career intelligence with dedicated flows for account,
          profile, and dashboards.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Create an account, set up your profile (or auto-extract from CV), and explore the
          live dashboard for skill gaps, predictions, and recommended pathways.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-indigo-400"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-400/50"
          >
            Login
          </Link>
          <Link
            href="/profile"
            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/50"
          >
            Profile setup
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/50"
          >
            View dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
