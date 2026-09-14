import { Article } from "@/components/site/Article";
import { StampMark } from "@/components/artifacts/Motion";

export default function LearnPage() {
  return (
    <Article
      title="StockSync for class 10"
      lead="Imagine three friends counting the same box of biscuits. They get three answers."
    >
      <p>
        <strong>Shop till</strong> is the cash counter. Each sale subtracts one biscuit from its notebook.
      </p>
      <p>
        <strong>Warehouse</strong> is the storeroom. Staff write how many boxes they see on the shelf.
      </p>
      <p>
        <strong>Online shop</strong> is the website. It shows customers how many they can buy.
      </p>
      <p>
        If the till says 42, the storeroom says 38, and the website says 40, somebody is wrong — or the lists are just
        late. StockSync draws that argument on a screen. You press a button to choose one number. That is
        “reconciliation”: making the lists agree on purpose.
      </p>
      <p>
        <strong>Backfill</strong> means “catch up old days.” If the website was down yesterday, you replay yesterday’s
        sales so the notebooks catch up.
      </p>
      <p>
        Nothing here talks to a real shop. Numbers are fake so you can learn the idea without breaking a business.
      </p>
      <StampMark />
    </Article>
  );
}
