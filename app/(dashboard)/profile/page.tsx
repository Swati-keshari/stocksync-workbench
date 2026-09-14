"use client";

import { useState } from "react";
import { useUiStore } from "@/stores/useUiStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function ProfilePage() {
  const pushToast = useUiStore((s) => s.pushToast);
  const [name, setName] = useState("Swati Keshari");
  const [email, setEmail] = useState("swati@stocksync.demo");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your account and preferences.</p>
      </div>

      <div className="flex items-center gap-4 rounded-card border border-border bg-surface p-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-semibold text-primary">
          SK
        </span>
        <div>
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          <p className="text-xs text-text-secondary">Personal project owner</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          pushToast("Profile updated", "success");
        }}
        className="flex flex-col gap-4 rounded-card border border-border bg-surface p-5"
      >
        <h2 className="text-sm font-semibold text-text-primary">Account details</h2>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Save changes
        </button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCurrentPw("");
          setNewPw("");
          pushToast("Password changed", "success");
        }}
        className="flex flex-col gap-4 rounded-card border border-border bg-surface p-5"
      >
        <h2 className="text-sm font-semibold text-text-primary">Change password</h2>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">Current password</span>
          <input
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            type="password"
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">New password</span>
          <input
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            type="password"
            className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-alt"
        >
          Update password
        </button>
      </form>

      <div className="flex items-center justify-between rounded-card border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Theme preference</h2>
          <p className="text-xs text-text-secondary">Switch between light and dark mode.</p>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
