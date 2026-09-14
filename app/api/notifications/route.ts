import { NextResponse } from "next/server";
import notifications from "@/data/notifications.json";

export async function GET() {
  return NextResponse.json(notifications);
}
