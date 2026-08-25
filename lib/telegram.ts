import type { LeadPayload } from "./types";

export async function sendTelegramLead(lead: LeadPayload): Promise<void> {
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

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[telegram] xabar yuborilmadi:", res.status, body);
  }
}
