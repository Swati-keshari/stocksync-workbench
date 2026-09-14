import { Article } from "@/components/site/Article";
import { DashedSync, InkPath, ScanBox } from "@/components/artifacts/Motion";

export default function HowPage() {
  return (
    <Article title="How a mismatch is found" lead="Read top to bottom. Each step is one human action.">
      <ol className="list-decimal space-y-3 pl-5">
        <li>Connect three pretend sources: shop till, warehouse, online shop.</li>
        <li>Every few seconds the demo copies new counts into one table.</li>
        <li>If two counts for the same product code differ, a row appears in Reconciliation.</li>
        <li>You open the row, read the story, and pick which count to keep.</li>
        <li>The audit log writes who picked what, so the story can be replayed.</li>
      </ol>
      <ScanBox />
      <DashedSync />
      <InkPath />
    </Article>
  );
}
