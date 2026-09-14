"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <MailCheck size={22} />
        </span>
        <h1 className="text-lg font-semibold text-text-primary">Check your email</h1>
        <p className="text-sm text-text-secondary">
          If an account exists for <span className="text-text-primary">{email}</span>, we've sent a link to reset your password.
        </p>
        <Link href="/login" className="mt-2 text-sm font-medium text-primary hover:text-primary-hover">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">Forgot password</h1>
      <p className="mb-5 text-sm text-text-secondary">
        Enter the email tied to your account and we'll send you a reset link.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="flex flex-col gap-3"
      >
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
        <button
          type="submit"
          className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Send reset link
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-text-secondary">
        <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
          Back to log in
        </Link>
      </p>
    </>
  );
}
