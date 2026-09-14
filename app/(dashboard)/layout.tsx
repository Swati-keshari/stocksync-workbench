import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ConnectionBanner } from "@/components/shared/ConnectionBanner";
import { ToastStack } from "@/components/shared/ToastStack";
import { LiveSync } from "@/components/shared/LiveSync";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text-primary">
      <LiveSync />
      <Header />
      <ConnectionBanner />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6">{children}</main>
      <Footer />
      <ToastStack />
    </div>
  );
}
