import { Logo } from "@/components/brand/Logo";
import { ToastStack } from "@/components/shared/ToastStack";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-text-primary">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-6">{children}</div>
      <ToastStack />
    </div>
  );
}
