"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(next);
      router.refresh();
      return;
    }

    const payload = await res.json().catch(() => ({}));
    setError(payload.error ?? "Couldn't sign you in.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <p className="eyebrow mb-4 text-lamp-400">Glamping Loch Lomond</p>
      <h1 className="font-display text-3xl text-oat-50">Owner login</h1>
      <p className="mt-3 text-sm text-oat-100/60">
        Sign in to manage photos, pods and enquiries.
      </p>

      <label className="eyebrow mb-2 mt-8 block text-oat-100/50" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        autoFocus
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl border border-oat-50/20 bg-oat-50/5 px-4 py-3 text-sm text-oat-50 outline-none transition-colors focus:border-lamp-400"
      />

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || !password}
        className="mt-6 w-full rounded-full bg-lamp-500 px-6 py-3.5 text-sm font-semibold text-loch-950 transition-colors hover:bg-lamp-400 disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <a
        href="/"
        className="mt-6 block text-center text-xs text-oat-100/45 transition-colors hover:text-oat-100/80"
      >
        Back to the website
      </a>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="on-dark grid min-h-screen place-items-center bg-dusk px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
