import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "./theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Navigator | Market-aligned Career Intelligence",
  description:
    "Real-time skill gap analysis, career predictions, and market-aligned pathways built on top of Next.js and Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <header className="border-b border-slate-900/80 bg-slate-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
            <Link href="/" className="text-lg font-semibold text-white">
              Skill Navigator
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-900" href="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-900" href="/profile">
              Profile
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-900" href="/signup">
              Create account
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-900" href="/login">
              Login
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
        {children}
      </body>
    </html>
  );
}
