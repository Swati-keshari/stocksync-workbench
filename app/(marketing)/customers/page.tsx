import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Customers"
      lead="Stories a real product would collect. These names are invented for the demo."
      paragraphs={[
        "Kirana groups want one screen instead of three Excel files.",
        "A warehouse lead cares that the website does not oversell rice bags.",
        "Finance cares that missing units show up as rupees, not only percentages.",
      ]}
    />
  );
}
