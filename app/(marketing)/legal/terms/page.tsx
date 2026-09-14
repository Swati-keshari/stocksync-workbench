import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Terms"
      lead="This software is a personal demo, not a commercial service."
      paragraphs={[
        "You may run it locally to learn. Mock data is not a warehouse of record.",
        "No warranty. Numbers are invented.",
      ]}
    />
  );
}
