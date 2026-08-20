"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

export default function ImagePicker({
  name,
  defaultValue = "",
  label = "Gambar",
  value,
  onChange,
  username,
  shape = "rect",
}: {
  name: string;
  defaultValue?: string;
  label?: string;
  /** Optional controlled mode — pass both value & onChange to let a parent own the URL. */
  value?: string;
  onChange?: (url: string) => void;
  /** Portfolio username this upload belongs to (self, or the user an admin is managing). */
  username: string;
  /** "arch" mirrors the public profile-photo frame (rounded top, flat bottom) — use for the avatar field so the admin preview matches the live site exactly, regardless of the uploaded photo's original orientation. */
  shape?: "rect" | "arch";
}) {
  const [internalUrl, setInternalUrl] = useState(defaultValue);
  const controlled = value !== undefined && onChange !== undefined;
  const url = controlled ? value! : internalUrl;
  const setUrl = controlled ? onChange! : setInternalUrl;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengunggah file.");
      } else {
        setUrl(data.item.url);
      }
    } catch {
      setError("Gagal mengunggah file. Periksa koneksi Anda.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-fit">
          <div
            className={
              shape === "arch"
                ? "relative aspect-[5/6] w-32 overflow-hidden rounded-t-full border-4 border-gray-200 bg-gray-100"
                : "relative h-32 w-48 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
            }
          >
            <Image src={url} alt="" fill sizes="192px" className="object-cover object-top" />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow-sm ring-1 ring-gray-200"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={
            shape === "arch"
              ? "flex aspect-[5/6] w-32 flex-col items-center justify-center gap-1.5 rounded-t-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600"
              : "flex h-24 w-48 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600"
          }
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-xs">{uploading ? "Mengunggah..." : "Unggah gambar"}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
