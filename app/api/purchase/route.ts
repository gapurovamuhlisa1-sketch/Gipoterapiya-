import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { verifyLeadToken } from "@/lib/leadToken";
import { sendMetaPurchaseEvent } from "@/lib/metaCapi";

export async function POST(req: NextRequest) {
  let body: { d?: string; s?: string; amount?: number; pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { d, s, amount, pin } = body;

  const adminPin = process.env.ADMIN_PIN;
  if (adminPin && pin !== adminPin) {
    return NextResponse.json({ success: false, error: "PIN noto'g'ri" }, { status: 401 });
  }

  if (!d || !s) {
    return NextResponse.json({ success: false, error: "Havola yaroqsiz" }, { status: 400 });
  }

  const lead = verifyLeadToken(d, s);
  if (!lead) {
    return NextResponse.json({ success: false, error: "Havola yaroqsiz yoki buzilgan" }, { status: 400 });
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ success: false, error: "Summani to'g'ri kiriting" }, { status: 400 });
  }

  const eventSourceUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  try {
    await sendMetaPurchaseEvent({
      phone: lead.phone,
      amount,
      currency: "UZS",
      eventId: randomUUID(),
      eventSourceUrl,
      fbp: lead.fbp,
      fbc: lead.fbc,
    });
  } catch (err) {
    console.error("[api/purchase] xatolik:", err);
    return NextResponse.json({ success: false, error: "Meta'ga yuborishda xatolik" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
