"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

interface DecodedLead {
  name?: string;
  phone?: string;
}

function decodeLeadPreview(d: string | null): DecodedLead | null {
  if (!d) return null;
  try {
    const json = atob(d.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json);
    return { name: parsed.name, phone: parsed.phone };
  } catch {
    return null;
  }
}

export default function PurchaseForm() {
  const searchParams = useSearchParams();
  const d = searchParams.get("d");
  const s = searchParams.get("s");
  const preview = useMemo(() => decodeLeadPreview(d), [d]);

  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount.replace(/[^\d.]/g, ""));
    if (!numericAmount || numericAmount <= 0) {
      setError("Summani to'g'ri kiriting");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ d, s, amount: numericAmount, pin }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Xatolik yuz berdi");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Xatolik yuz berdi, qayta urinib ko'ring");
      setSubmitting(false);
    }
  }

  if (!d || !s) {
    return (
      <div className="admin-card">
        <p className="form-error">Havola yaroqsiz.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="admin-card">
        <h1>Yuborildi</h1>
        <p>To&apos;lov ma&apos;lumoti Meta&apos;ga muvaffaqiyatli yuborildi.</p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h1>To&apos;lovni belgilash</h1>
      {preview && (
        <p className="admin-preview">
          {preview.name} — {preview.phone}
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="amount">Summa (so&apos;m)</label>
          <input
            id="amount"
            type="text"
            inputMode="numeric"
            placeholder="Masalan: 500000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            placeholder="Admin PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Yuborilmoqda..." : "Yuborish"}
        </button>
      </form>
    </div>
  );
}
