import Link from "next/link";
import { Article } from "@/components/site/Article";

export default function HelpPage() {
  return (
    <Article title="Help inside the workbench" lead="Short map of each tab.">
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link href="/workbench" className="text-primary hover:underline">
            Workbench
          </Link>{" "}
          — scoreboard of the three notebooks.
        </li>
        <li>
          <Link href="/reconciliation" className="text-primary hover:underline">
            Mismatches
          </Link>{" "}
          — pick which count to keep.
        </li>
        <li>
          <Link href="/backfill" className="text-primary hover:underline">
            Catch up
          </Link>{" "}
          — replay old days if a notebook was late.
        </li>
        <li>
          <Link href="/sources" className="text-primary hover:underline">
            Notebooks
          </Link>{" "}
          — turn a mock feed on or off.
        </li>
        <li>
          <Link href="/audit-log" className="text-primary hover:underline">
            Audit log
          </Link>{" "}
          — who picked what.
        </li>
        <li>
          <Link href="/learn" className="text-primary hover:underline">
            Class 10 lesson
          </Link>
        </li>
      </ul>
    </Article>
  );
}
