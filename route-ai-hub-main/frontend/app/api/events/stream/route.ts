import type { NextRequest } from "next/server";
export const runtime = "edge";

export async function GET(_req: NextRequest) {
  const upstream = await fetch(`${process.env.BACKEND_BASE_URL}/events/stream`, {
    headers: { "x-api-key": process.env.BACKEND_API_KEY || "" },
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
