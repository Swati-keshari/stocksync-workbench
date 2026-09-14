import { CopyPage } from "@/components/site/CopyPage";
import { LiveTicker } from "@/components/artifacts/Motion";

export default function Page() {
  return (
    <>
      <CopyPage
        title="Status"
        lead="All demo systems are local to this app process."
        paragraphs={["Shop till mock: up.", "Warehouse mock: up.", "Website mock: up.", "No third-party uptime checks."]}
      />
      <div className="mx-auto max-w-2xl px-4 pb-16">
        <LiveTicker />
      </div>
    </>
  );
}
