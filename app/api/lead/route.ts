import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sendTelegramLead } from "@/lib/telegram";
import { sendMetaLeadEvent } from "@/lib/metaCapi";
import type { LeadPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const name = (payload.name ?? "").trim();
  const phone = (payload.phone ?? "").trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ success: false, error: "Ismingizni kiriting" }, { status: 400 });
  }
  if (!phone || phone.replace(/[^\d]/g, "").length < 9) {
    return NextResponse.json({ success: false, error: "Telefon raqamini to'g'ri kiriting" }, { status: 400 });
  }

  const eventId = randomUUID();
  const lead: LeadPayload = { name, phone };

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const clientUserAgent = req.headers.get("user-agent") ?? undefined;
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value;
  const eventSourceUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  const results = await Promise.allSettled([
    sendTelegramLead(lead),
    sendMetaLeadEvent({ lead, eventId, eventSourceUrl, clientIp, clientUserAgent, fbp, fbc }),
  ]);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("[api/lead] xatolik:", result.reason);
    }
  });

  return NextResponse.json({ success: true, eventId });
}
