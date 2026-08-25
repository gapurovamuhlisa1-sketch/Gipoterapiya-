"use client";

import { useEffect, useState } from "react";

const DURATION = 10;
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RahmatPage() {
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const channelUrl = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || "https://t.me/";

  useEffect(() => {
    if (secondsLeft <= 0) {
      window.location.href = channelUrl;
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, channelUrl]);

  const progress = (DURATION - secondsLeft) / DURATION;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <main className="thanks-section">
      <div className="thanks-card">
        <div className="thanks-ring">
          <svg viewBox="0 0 120 120">
            <circle className="track" cx="60" cy="60" r={RADIUS} />
            <circle
              className="progress"
              cx="60"
              cy="60"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="count">{secondsLeft}</span>
        </div>
        <h1>Rahmat!</h1>
        <p>
          Arizangiz qabul qilindi. {secondsLeft} soniyadan so&apos;ng Telegram kanalimizga
          avtomatik o&apos;tkazasiz — u yerda kurs haqida batafsil ma&apos;lumot kutmoqda.
        </p>
        <a className="cta" href={channelUrl}>
          Hozir o&apos;tish
        </a>
      </div>
    </main>
  );
}
