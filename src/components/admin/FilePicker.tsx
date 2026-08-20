"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilePicker({
  urlName,
  sizeName,
  label = "Berkas",
  defaultUrl = "",
  defaultSize = 0,
  username,
}: {
  urlName: string;
  sizeName: string;
  label?: string;
  defaultUrl?: string;
  defaultSize?: number;
  /** Portfolio username this upload belongs to (self, or the user an admin is managing). */
  username: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [size, setSize] = useState(defaultSize);
  const [name, setName] = useState(defaultUrl ? defaultUrl.split("/").pop() ?? "" : "");
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
        setSize(data.item.size);
        setName(data.item.originalName);
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
      <input type="hidden" name={urlName} value={url} />
      <input type="hidden" name={sizeName} value={size} />

      {url ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <FileText size={18} className="shrink-0 text-gray-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{formatSize(size)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setSize(0);
              setName("");
            }}
            className="shrink-0 text-gray-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Mengunggah..." : "Pilih atau unggah berkas (PDF, dsb.)"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
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
