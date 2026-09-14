import { NextResponse } from "next/server";
import health from "@/data/sync-health.json";

export async function GET() {
  return NextResponse.json(health);
}
