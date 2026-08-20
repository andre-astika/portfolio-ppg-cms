"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";

export default function LoginCard() {
  return (
    <Suspense fallback={null}>
      <LoginCardInner />
    </Suspense>
  );
}

function LoginCardInner() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="font-display text-2xl text-gray-900">Masuk</h2>
      <p className="mt-1.5 text-sm text-gray-500">
        Masukkan username dan kata sandi akunmu.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Username</span>
          <input
            type="text"
            name="username"
            required
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Kata Sandi</span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </label>

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700 disabled:opacity-50"
        >
          {pending ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
