"use client";

import { Modal } from "antd";
import { useState } from "react";
import { Profile, defaultProfile } from "../lib/mockData";

type ExtractResult = {
  name?: string | null;
  email?: string | null;
  skills?: string[];
  title?: string | null;
  error?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skill-nav-profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<Profile>;
          return { ...defaultProfile, ...parsed };
        } catch (err) {
          console.error("Failed to parse saved profile", err);
        }
      }
    }
    return defaultProfile;
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("Select a PDF to extract");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<ExtractResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadStatus("Please upload a PDF file.");
      setFileName(null);
      setUploadResult(null);
      return;
    }
    setFileName(file.name);
    setUploadStatus("Uploading and extracting...");
    setUploadLoading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = (await res.json()) as ExtractResult;
      if (!res.ok || data.error) {
        setUploadStatus(data.error || "Extraction failed");
        setUploadResult(data);
      } else {
        setUploadStatus("Extraction complete");
        setUploadResult(data);
      }
    } catch (err) {
      setUploadStatus(`Upload failed: ${err}`);
    } finally {
      setUploadLoading(false);
    }
  };

  const saveExtractedToProfile = () => {
    if (!uploadResult) return;
    const nextProfile = {
      ...profile,
      fullName: uploadResult.name ?? profile.fullName,
      email: uploadResult.email ?? profile.email,
      skills: uploadResult.skills?.join(", ") ?? profile.skills,
      title: uploadResult.title ?? profile.title,
    };
    setProfile(nextProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem("skill-nav-profile", JSON.stringify(nextProfile));
    }
    setProfileMessage("Saved extracted details to profile.");
    setModalOpen(false);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:px-10 sm:py-12">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Profile</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Setup and edit profile</h1>
            <p className="text-sm text-slate-300">
              Keep your details current. Update your basics and save locally.
            </p>
          </div>
          <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-[11px] text-indigo-100">
            Editable on-page
          </span>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-indigo-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Profile Details</p>
            <h3 className="text-lg font-semibold text-white">Edit and save</h3>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20"
            type="button"
          >
            + Upload Your CV
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Full name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={profile.fullName}
              onChange={(e) => handleProfileChange("fullName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              type="email"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={profile.title}
              onChange={(e) => handleProfileChange("title", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Location</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={profile.location}
              onChange={(e) => handleProfileChange("location", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Years of experience</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              value={profile.yearsExperience}
              onChange={(e) => handleProfileChange("yearsExperience", e.target.value)}
            >
              <option>0-2 years</option>
              <option>2-5 years</option>
              <option>5-7 years</option>
              <option>7-10 years</option>
              <option>10+ years</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Key skills (comma separated)</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              rows={2}
              value={profile.skills}
              onChange={(e) => handleProfileChange("skills", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setProfileMessage("Profile saved locally (mock).")}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-cyan-400"
          >
            Save profile
          </button>
          {profileMessage && <span className="text-sm text-emerald-200">{profileMessage}</span>}
        </div>
      </section>

      <Modal
        title="Upload CV & Extraction"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-200">
            Select a PDF to run the extractor. After extraction, save to populate your profile fields.
          </p>
          <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-emerald-400/70 bg-slate-900 text-center text-slate-100 transition hover:border-emerald-300 hover:bg-slate-800 dark:border-emerald-400/80 dark:bg-slate-900">
            <span className="mt-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/30">
              Select PDF
            </span>
            <span className="pb-6 text-sm text-slate-200">
              {fileName ? fileName : "Drop or click to upload a PDF"}
            </span>
            <input
              className="hidden"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <span>{uploadStatus}</span>
            {uploadLoading && <span className="text-emerald-400">Working...</span>}
          </div>

          {uploadResult && !uploadResult.error && (
            <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <p>
                <span className="text-slate-500">Name:</span> {uploadResult.name || "N/A"}
              </p>
              <p>
                <span className="text-slate-500">Email:</span> {uploadResult.email || "N/A"}
              </p>
              <p>
                <span className="text-slate-500">Title:</span> {uploadResult.title || "No title detected"}
              </p>
              <p>
                <span className="text-slate-500">Skills:</span> {(uploadResult.skills || []).join(", ") || "N/A"}
              </p>
              <div className="pt-2">
                <button
                  onClick={saveExtractedToProfile}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-cyan-400"
                  type="button"
                >
                  Save to profile
                </button>
              </div>
            </div>
          )}

          {uploadResult && uploadResult.error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-100">
              Extraction error: {uploadResult.error}
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}
