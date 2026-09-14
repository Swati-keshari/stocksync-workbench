import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Why three lists of the same tea disagree"
      lead="A till, a storeroom, and a website update at different speeds."
      paragraphs={[
        "A customer buys two packets. The till subtracts immediately. The website may wait for a batch job. The warehouse may wait for a person with a scanner.",
        "For a few minutes the three notebooks tell different stories. That gap is normal. A long gap is a problem.",
        "StockSync’s demo pretends those delays so you can watch rows appear.",
      ]}
    />
  );
}
