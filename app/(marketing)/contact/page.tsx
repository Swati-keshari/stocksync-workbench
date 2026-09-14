import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Contact"
      lead="This is a demo. There is no support inbox."
      paragraphs={[
        "Use the in-app Help page if you are lost inside the workbench.",
        "Do not send passwords to this project.",
      ]}
    />
  );
}
