import { createHash } from "crypto";
import type { LeadPayload } from "./types";

interface MetaCapiOptions {
  lead: LeadPayload;
  eventId: string;
  eventSourceUrl: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("998")) return `+${digits}`;
  if (digits.length === 9) return `+998${digits}`;
  return `+${digits}`;
}

export async function sendMetaLeadEvent(options: MetaCapiOptions): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn(
      "[meta-capi] NEXT_PUBLIC_META_PIXEL_ID yoki META_CAPI_ACCESS_TOKEN sozlanmagan — hodisa yuborilmadi."
    );
    return;
  }

  const { lead, eventId, eventSourceUrl, clientIp, clientUserAgent, fbp, fbc } = options;

  const userData: Record<string, unknown> = {
    ph: [sha256(normalizePhone(lead.phone))],
    fn: [sha256(lead.name)],
  };
  if (clientIp) userData.client_ip_address = clientIp;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: userData,
      },
    ],
    ...(process.env.META_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE }
      : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error("[meta-capi] hodisa yuborilmadi:", res.status, errBody);
  }
}
