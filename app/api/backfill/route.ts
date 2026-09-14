import { NextResponse } from "next/server";
import job from "@/data/backfill.json";

export async function GET() {
  return NextResponse.json(job);
}
