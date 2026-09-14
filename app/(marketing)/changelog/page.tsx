import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Changelog"
      lead="What changed in this personal build."
      paragraphs={[
        "2026 — Public site added so visitors can learn before opening the workbench.",
        "2026 — Workbench moved to /workbench so the home page can teach the story.",
        "2026 — Copy rewritten for class-10 readers.",
      ]}
    />
  );
}
