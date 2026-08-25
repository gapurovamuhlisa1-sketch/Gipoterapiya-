import type { LeadPayload } from "./types";
import { signLeadToken } from "./leadToken";

interface SendTelegramLeadOptions {
  lead: LeadPayload;
  fbp?: string;
  fbc?: string;
}

export async function sendTelegramLead({ lead, fbp, fbc }: SendTelegramLeadOptions): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan — xabar yuborilmadi."
    );
    return;
  }

  const text = [
    "🧠 Yangi lid — Gipnoterapiya darsligi",
    "",
    `👤 Ism: ${lead.name}`,
    `📞 Telefon: ${lead.phone}`,
    `🕒 ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`,
  ].join("\n");

  const body: Record<string, unknown> = { chat_id: chatId, text };

  const purchaseLink = buildPurchaseLink(lead, fbp, fbc);
  if (purchaseLink && purchaseLink.startsWith("https://")) {
    body.reply_markup = {
      inline_keyboard: [[{ text: "💰 To'lovni belgilash", url: purchaseLink }]],
    };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error("[telegram] xabar yuborilmadi:", res.status, errBody);
  }
}

const FALLBACK_SITE_URL = "https://gipoterapiya.vercel.app";

function buildPurchaseLink(lead: LeadPayload, fbp?: string, fbc?: string): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  if (!process.env.LEAD_SECRET) return null;

  try {
    const { d, s } = signLeadToken({ name: lead.name, phone: lead.phone, fbp, fbc, ts: Date.now() });
    return `${siteUrl}/admin/purchase?d=${d}&s=${s}`;
  } catch {
    return null;
  }
}
