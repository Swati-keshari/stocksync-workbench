import { NextResponse } from "next/server";
import { listItems, resolveItems } from "../_store";

// Mocked endpoint — reads/writes the in-memory store in ../_store.ts in
// place of a real reconciliation engine + database. See section 6 of the
// project spec.
export async function GET() {
  return NextResponse.json(listItems());
}

// Resolves one or more items server-side, so a subsequent refetch (which
// useOptimisticResolve always triggers via invalidateQueries, and which
// bulk actions rely on staying consistent with) reflects what actually
// happened instead of reverting to the static fixture.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids)
    ? body.ids.filter((x: unknown): x is string => typeof x === "string")
    : typeof body?.id === "string"
      ? [body.id]
      : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "Request body must include an id or ids array" }, { status: 400 });
  }

  // Simulate real network latency, and an occasional transient failure —
  // this is what exercises the optimistic-update + rollback + retry path
  // on the client. A single-item resolve fails more often (10%) than a
  // batch (5% for the whole batch, not per item — an independent per-item
  // failure chance would make large batches fail almost every time, which
  // isn't how real batch endpoints are designed).
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400));
  const failChance = ids.length === 1 ? 0.1 : 0.05;
  if (Math.random() < failChance) {
    return NextResponse.json({ error: "Simulated sync failure" }, { status: 502 });
  }

  const { resolved, missing } = resolveItems(ids);
  if (resolved.length === 0) {
    return NextResponse.json({ error: "No matching item(s) found", missing }, { status: 404 });
  }

  return NextResponse.json({ resolved, missing });
}
