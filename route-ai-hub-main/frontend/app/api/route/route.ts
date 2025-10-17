import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${process.env.BACKEND_BASE_URL}/route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BACKEND_API_KEY || "",
      "Idempotency-Key": req.headers.get("Idempotency-Key") || "",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
