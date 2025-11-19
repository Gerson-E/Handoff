import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const res = await fetch(`${process.env.BACKEND_BASE_URL}/events`, {
    headers: { "x-api-key": process.env.BACKEND_API_KEY || "" },
    cache: "no-store",
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}
