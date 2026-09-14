import { CopyPage } from "@/components/site/CopyPage";
import { OrbitNodes } from "@/components/artifacts/Motion";

export default function Page() {
  return (
    <>
      <CopyPage
        title="Integrations"
        lead="In a live product these would be real APIs. Here they are labeled drawers."
        paragraphs={[
          "Shop till: pretend POS feed.",
          "Warehouse: pretend WMS feed.",
          "Online shop: pretend commerce feed.",
          "Open Sources in the workbench to toggle them on or off.",
        ]}
      />
      <div className="mx-auto max-w-2xl px-4 pb-16">
        <OrbitNodes />
      </div>
    </>
  );
}
