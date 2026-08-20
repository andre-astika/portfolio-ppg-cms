"use client";

import { useState } from "react";
import { Plus, Trash2, X, Pencil, FileText, CalendarDays, Tag } from "lucide-react";
import { createTaskAction, deleteTaskAction } from "@/lib/actions/tasks";
import {
  createTaskCategoryAction,
  updateTaskCategoryAction,
  deleteTaskCategoryAction,
} from "@/lib/actions/task-categories";
import { Field, inputClass, buttonPrimaryClass, buttonSecondaryClass, Card } from "@/components/admin/ui";
import FilePicker from "@/components/admin/FilePicker";
import type { TaskItem, TaskCategory } from "@/lib/types";

export default function TasksManager({
  tasks,
  categories,
  username,
}: {
  tasks: TaskItem[];
  categories: TaskCategory[];
  username: string;
}) {
  const [adding, setAdding] = useState(false);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name || "Tanpa kategori";

  return (
    <div className="space-y-8">
      <CategoryManager categories={categories} username={username} />

      <div className="space-y-6">
        {adding ? (
          <AddForm categories={categories} username={username} onClose={() => setAdding(false)} />
        ) : (
          <button onClick={() => setAdding(true)} className={buttonPrimaryClass}>
            <Plus size={16} /> Tambah Tugas
          </button>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <FileText size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    {categoryName(task.categoryId)}
                  </p>
                  <p className="truncate text-sm font-semibold text-gray-900">{task.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    {task.course && <span>{task.course}</span>}
                    {task.date && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} /> {task.date}
                      </span>
                    )}
                    <span>&middot;</span>
                    <span>{task.size}</span>
                  </div>
                </div>
              </div>
              <form action={deleteTaskAction.bind(null, username, task.id)}>
                <button className="flex shrink-0 items-center gap-1 text-xs font-medium text-red-600 hover:underline">
                  <Trash2 size={12} /> Hapus
                </button>
              </form>
            </Card>
          ))}
          {tasks.length === 0 && <p className="text-sm text-gray-500">Belum ada tugas.</p>}
        </div>
      </div>
    </div>
  );
}

function CategoryManager({ categories, username }: { categories: TaskCategory[]; username: string }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<TaskCategory | null>(null);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Kategori Tugas</p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:underline"
          >
            <Plus size={12} /> Tambah Kategori
          </button>
        )}
      </div>

      {adding && (
        <CategoryForm username={username} onClose={() => setAdding(false)} />
      )}

      <div className="space-y-2">
        {categories.map((cat) =>
          editing?.id === cat.id ? (
            <CategoryForm key={cat.id} category={cat} username={username} onClose={() => setEditing(null)} />
          ) : (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3.5 py-2.5"
            >
              <span className="flex items-center gap-2 text-sm text-gray-900">
                <Tag size={13} className="text-gray-400" />
                {cat.name}
              </span>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => setEditing(cat)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:underline"
                >
                  <Pencil size={12} /> Edit
                </button>
                <form action={deleteTaskCategoryAction.bind(null, username, cat.id)}>
                  <button className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
                    <Trash2 size={12} /> Hapus
                  </button>
                </form>
              </div>
            </div>
          )
        )}
        {categories.length === 0 && !adding && (
          <p className="text-sm text-gray-500">Belum ada kategori tugas.</p>
        )}
      </div>
    </Card>
  );
}

function CategoryForm({
  category,
  username,
  onClose,
}: {
  category?: TaskCategory;
  username: string;
  onClose: () => void;
}) {
  const action = category
    ? updateTaskCategoryAction.bind(null, username, category.id)
    : createTaskCategoryAction.bind(null, username);

  return (
    <form
      action={async (formData) => {
        await action(formData);
        onClose();
      }}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5"
    >
      <input
        name="name"
        defaultValue={category?.name}
        placeholder="Nama kategori"
        required
        autoFocus
        className={`${inputClass} bg-white`}
      />
      <button type="submit" className={buttonPrimaryClass}>
        Simpan
      </button>
      <button type="button" onClick={onClose} className={buttonSecondaryClass}>
        <X size={16} />
      </button>
    </form>
  );
}

function AddForm({
  categories,
  username,
  onClose,
}: {
  categories: TaskCategory[];
  username: string;
  onClose: () => void;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Tambah Tugas Baru</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
          <X size={16} />
        </button>
      </div>

      <form
        action={async (formData) => {
          await createTaskAction(username, formData);
          onClose();
        }}
        className="space-y-4"
      >
        <Field label="Judul Tugas">
          <input name="title" required className={inputClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mata Kuliah">
            <input name="course" className={inputClass} />
          </Field>
          <Field label="Tanggal">
            <input name="date" type="date" className={inputClass} />
          </Field>
        </div>

        <Field label="Kategori">
          <select name="categoryId" defaultValue="" className={inputClass}>
            <option value="">Tanpa kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>

        <FilePicker urlName="fileUrl" sizeName="fileSize" label="Berkas Tugas" username={username} />

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
