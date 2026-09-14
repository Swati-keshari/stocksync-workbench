import { CopyPage } from "@/components/site/CopyPage";
import { TallyNudge } from "@/components/artifacts/Motion";

export default function Page() {
  return (
    <>
      <CopyPage
        title="Missing units are missing money"
        lead="A percentage can hide a large rupee hole."
        paragraphs={[
          "Two missing luxury items can cost more than twenty missing cheap soaps.",
          "The workbench ranks mismatches by money, not only by percent, so the expensive fight is seen first.",
        ]}
      />
      <div className="mx-auto max-w-2xl px-4 pb-16">
        <TallyNudge />
      </div>
    </>
  );
}
