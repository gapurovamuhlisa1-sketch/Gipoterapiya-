import { createHmac } from "crypto";

export interface LeadTokenPayload {
  name: string;
  phone: string;
  fbp?: string;
  fbc?: string;
  ts: number;
}

function getSecret(): string {
  const secret = process.env.LEAD_SECRET;
  if (!secret) {
    throw new Error("LEAD_SECRET sozlanmagan");
  }
  return secret;
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

export function signLeadToken(payload: LeadTokenPayload): { d: string; s: string } {
  const d = base64url(JSON.stringify(payload));
  const s = createHmac("sha256", getSecret()).update(d).digest("hex");
  return { d, s };
}

export function verifyLeadToken(d: string, s: string): LeadTokenPayload | null {
  if (!d || !s) return null;
  const expected = createHmac("sha256", getSecret()).update(d).digest("hex");
  if (expected.length !== s.length || !timingSafeEqualStr(expected, s)) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(d, "base64url").toString("utf8")) as LeadTokenPayload;
  } catch {
    return null;
  }
}

function timingSafeEqualStr(a: string, b: string): boolean {
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
