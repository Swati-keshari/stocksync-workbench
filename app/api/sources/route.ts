import { NextResponse } from "next/server";
import sources from "@/data/sources.json";

export async function GET() {
  return NextResponse.json(sources);
}
