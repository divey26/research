"use client";

import { useState } from "react";

type ExtractResult = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  links?: string[];
  skills?: string[];
  education?: string[];
  experience?: string[];
  entities?: Record<string, string[]>;
  raw_text?: string;
  title?: string | null;
  error?: string;
  details?: string;
};

export default function QwertyUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("No file uploaded yet.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStatus("Please upload a PDF file.");
      setFileName(null);
      setResult(null);
      return;
    }

    setFileName(file.name);
    setStatus("Uploading and extracting...");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as ExtractResult;
      if (!res.ok || data.error) {
        setStatus(data.error || "Extraction failed");
        setResult(data);
      } else {
        setStatus("Extraction complete");
        setResult(data);
      }
    } catch (err) {
      setStatus(`Upload failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const saveToProfile = () => {
    if (!result) return;
    const payload = {
      fullName: result.name || "",
      email: result.email || "",
      skills: (result.skills || []).join(", "),
      title: result.title || "",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("skill-nav-profile", JSON.stringify(payload));
      setSavedMessage("Saved to profile. Check the Profile page.");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 sm:px-10">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Upload</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          Qwerty: Upload a PDF CV
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Select a PDF and we will run the Python extractor (PyMuPDF + spaCy) server-side and show results here.
        </p>

        <div className="mt-6">
          <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-6 py-10 text-center transition hover:border-cyan-400/60">
            <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              Select PDF
            </span>
            <span className="text-slate-300">
              {fileName ? fileName : "Drop or click to upload a PDF"}
            </span>
            <input
              className="hidden"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
          <span>{status}</span>
          {loading && <span className="text-cyan-200">Working...</span>}
        </div>

        {result && !result.error && (
          <div className="mt-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-200">
            <div className="grid gap-2 sm:grid-cols-2">
              <p><span className="text-slate-400">Name:</span> {result.name || "—"}</p>
              <p><span className="text-slate-400">Email:</span> {result.email || "—"}</p>
              <p><span className="text-slate-400">Phone:</span> {result.phone || "—"}</p>
              <p><span className="text-slate-400">Links:</span> {(result.links || []).join(", ") || "—"}</p>
              <p><span className="text-slate-400">Title:</span> {result.title || "No title detected"}</p>
            </div>
            <p><span className="text-slate-400">Skills:</span> {(result.skills || []).join(", ") || "—"}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <p><span className="text-slate-400">Education:</span> {(result.education || []).join(" | ") || "—"}</p>
              <p><span className="text-slate-400">Experience:</span> {(result.experience || []).join(" | ") || "—"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveToProfile}
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-cyan-400"
              >
                Save name/email/skills to Profile
              </button>
              {savedMessage && <span className="text-emerald-200 text-xs">{savedMessage}</span>}
            </div>
            <details className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <summary className="cursor-pointer text-slate-300">Raw entities</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">
                {JSON.stringify(result.entities, null, 2)}
              </pre>
            </details>
            <details className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <summary className="cursor-pointer text-slate-300">Raw text</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">
                {result.raw_text}
              </pre>
            </details>
          </div>
        )}

        {result && result.error && (
          <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            Extraction error: {result.error}
            {result.details && <div className="text-rose-200/80">{result.details}</div>}
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Ensure the Python extractor exists at ../cv-extractor with its virtual env and model installed.
        </p>
      </div>
    </main>
  );
}
