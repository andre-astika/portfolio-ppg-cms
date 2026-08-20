"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  createHometownItemAction,
  updateHometownItemAction,
  deleteHometownItemAction,
} from "@/lib/actions/hometown";
import { Field, inputClass, buttonPrimaryClass, buttonSecondaryClass, Card } from "@/components/admin/ui";
import ImagePicker from "@/components/admin/ImagePicker";
import type { HometownItem } from "@/lib/types";

export default function HometownManager({ items, username }: { items: HometownItem[]; username: string }) {
  const [editing, setEditing] = useState<HometownItem | "new" | null>(null);

  return (
    <div className="space-y-6">
      {editing ? (
        <ItemForm item={editing === "new" ? null : editing} username={username} onClose={() => setEditing(null)} />
      ) : (
        <button onClick={() => setEditing("new")} className={buttonPrimaryClass}>
          <Plus size={16} /> Tambah Tempat
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="flex gap-4">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {item.image && <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{item.label}</p>
              <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setEditing(item)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:underline"
                >
                  <Pencil size={12} /> Edit
                </button>
                <form action={deleteHometownItemAction.bind(null, username, item.id)}>
                  <button className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
                    <Trash2 size={12} /> Hapus
                  </button>
                </form>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500">Belum ada item tempat asal.</p>
        )}
      </div>
    </div>
  );
}

function ItemForm({
  item,
  username,
  onClose,
}: {
  item: HometownItem | null;
  username: string;
  onClose: () => void;
}) {
  const action = item
    ? updateHometownItemAction.bind(null, username, item.id)
    : createHometownItemAction.bind(null, username);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">
          {item ? "Edit Tempat" : "Tambah Tempat Baru"}
        </p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
          <X size={16} />
        </button>
      </div>

      <form
        action={async (formData) => {
          await action(formData);
          onClose();
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label singkat (mis. Pantai)">
            <input name="label" defaultValue={item?.label} className={inputClass} />
          </Field>
          <Field label="Judul">
            <input name="title" defaultValue={item?.title} required className={inputClass} />
          </Field>
        </div>

        <Field label="Deskripsi">
          <textarea name="description" defaultValue={item?.description} rows={3} className={inputClass} />
        </Field>

        <ImagePicker name="image" defaultValue={item?.image} label="Gambar" username={username} />

        <Field label="Keterangan Gambar (alt text)">
          <input name="imageAlt" defaultValue={item?.imageAlt} className={inputClass} />
        </Field>

        <div className="flex gap-3">
          <button type="submit" className={buttonPrimaryClass}>
            Simpan
          </button>
          <button type="button" onClick={onClose} className={buttonSecondaryClass}>
            Batal
          </button>
        </div>
      </form>
    </Card>
  );
}
