import Link from "next/link";
import { Article } from "@/components/site/Article";

export default function Page() {
  return (
    <Article title="Journal" lead="Short notes about counting stock, written in plain language.">
      <ul className="space-y-3">
        <li>
          <Link href="/blog/three-lists" className="text-primary hover:underline">
            Why three lists of the same tea disagree
          </Link>
        </li>
        <li>
          <Link href="/blog/missing-units" className="text-primary hover:underline">
            Missing units are missing money
          </Link>
        </li>
      </ul>
    </Article>
  );
}
