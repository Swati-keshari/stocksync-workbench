"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";

// Demo-only credential check — there's no real auth backend in this build.
// Shown on-screen so anyone opening the app can actually log in without
// guessing, rather than the form silently accepting anything typed in.
const DEMO_EMAIL = "demo@stocksync.io";
const DEMO_PASSWORD = "stocksync-demo";

export default function LoginPage() {
  const router = useRouter();
  const pushToast = useUiStore((s) => s.pushToast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        pushToast("Logged in", "success");
        router.push("/workbench");
      } else {
        setError("That email/password combination doesn't match our records.");
      }
    }, 600);
  }

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">Log in</h1>
      <p className="mb-1 text-sm text-text-secondary">Demo only. Use the printed password, never a real one.</p>
      <p className="mb-5 rounded-lg bg-surface-alt px-3 py-2 text-xs text-text-secondary">
        Demo credentials: <span className="text-text-primary">{DEMO_EMAIL}</span> /{" "}
        <span className="text-text-primary">{DEMO_PASSWORD}</span>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
            placeholder="you@company.com"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="text-xs text-status-critical">{error}</p>}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 text-text-secondary">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-primary"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-primary hover:text-primary-hover">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-text-secondary">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:text-primary-hover">
          Sign up
        </Link>
      </p>
    </>
  );
}
