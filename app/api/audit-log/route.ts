import { NextResponse } from "next/server";
import auditLog from "@/data/audit-log.json";

export async function GET() {
  return NextResponse.json(auditLog);
}
