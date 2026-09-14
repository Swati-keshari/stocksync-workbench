import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="About"
      lead="StockSync is a personal frontend project by Swati Keshari."
      paragraphs={[
        "The workbench shows how inventory lists can disagree and how a person might fix that on a screen.",
        "It is not a company product and it is not connected to other people’s shops.",
        "Git history on this copy is authored as Swati Keshari.",
      ]}
    />
  );
}
