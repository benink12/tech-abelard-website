import { NextResponse } from "next/server";
import { getAuditResult } from "@/lib/audit/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Not called by the results page itself (that reads the store directly,
// server-side, to skip a same-origin round trip) — this exists as the
// addressable read path a future PDF renderer, the automated-email job, or
// an external client could hit.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getAuditResult(id);
  if (!result) {
    return NextResponse.json({ error: "Audit result not found." }, { status: 404 });
  }
  return NextResponse.json(result);
}
