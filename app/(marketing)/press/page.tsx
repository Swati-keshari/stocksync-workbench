import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Press kit"
      lead="One-line description you can quote."
      paragraphs={[
        "StockSync is a personal inventory workbench by Swati Keshari that teaches how three stock lists get compared.",
        "Screenshots: open /workbench after logging in with the demo credentials shown on the login page.",
      ]}
    />
  );
}
