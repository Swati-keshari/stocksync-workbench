import { Article } from "@/components/site/Article";
import { CountBoards, LedgerPulse } from "@/components/artifacts/Motion";

export default function ProductPage() {
  return (
    <Article title="What the product does" lead="StockSync is a screen for comparing three stock notebooks.">
      <CountBoards />
      <p>
        A till (POS) writes how many packets left the counter. A warehouse (WMS) writes how many sit on pallets. A
        website writes how many customers can buy. Those three notebooks should match. They often do not.
      </p>
      <p>
        This workbench lists each mismatch, scores how serious it looks, and lets you pick one notebook as the truth.
        The data is mocked so the UI can be shown without a live shop.
      </p>
      <LedgerPulse />
    </Article>
  );
}
