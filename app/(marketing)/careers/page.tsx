import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Careers"
      lead="No jobs are open. This page exists so the site looks like a full product."
      paragraphs={[
        "If this were a company, roles would be ops designer, frontend, and inventory analyst.",
        "For now it is a student-readable portfolio.",
      ]}
    />
  );
}
