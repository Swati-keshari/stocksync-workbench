"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Reconciliation lead");

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">Create an account</h1>
      <p className="mb-5 text-sm text-text-secondary">Set up your StockSync workspace.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/workbench");
        }}
        className="flex flex-col gap-3"
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
            placeholder="Swati Keshari"
          />
        </label>
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
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">Role (demo-only)</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
          >
            <option>Reconciliation lead</option>
            <option>Warehouse manager</option>
            <option>Operations analyst</option>
            <option>Admin</option>
          </select>
        </label>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
          Log in
        </Link>
      </p>
    </>
  );
}
