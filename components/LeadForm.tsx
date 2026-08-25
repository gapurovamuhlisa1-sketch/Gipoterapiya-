"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Ismingizni to'liq kiriting");
      return;
    }
    if (phone.replace(/[^\d]/g, "").length < 9) {
      setError("Telefon raqamini to'g'ri kiriting");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Xatolik yuz berdi, qayta urinib ko'ring");
        setSubmitting(false);
        return;
      }

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {}, { eventID: data.eventId });
      }

      router.push("/rahmat");
    } catch {
      setError("Xatolik yuz berdi, qayta urinib ko'ring");
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h2>Kursga yoziling</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Ismingiz</label>
          <input
            id="name"
            type="text"
            placeholder="Masalan: Madina"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefon raqamingiz</label>
          <input
            id="phone"
            type="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Yuborilmoqda..." : "Kursga yozilish"}
        </button>
      </form>
      <div className="foot">Ma&apos;lumotlaringiz maxfiy saqlanadi</div>
    </div>
  );
}
