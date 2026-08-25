# Gipnoterapiya darsligi — landing sahifa

Next.js 14 (App Router) + TypeScript asosida qurilgan lead-generatsiya sayti.
Dizayn: "Tinchlik" — issiq parchament fon, terrakota urg'u, Fraunces + Karla shriftlari.

## Tuzilma

```
app/
  page.tsx           — Bosh sahifa (Hero, 5 bosqichli yo'l, forma)
  rahmat/page.tsx     — Rahmat sahifasi (10 soniyalik animatsiya → Telegram kanaliga o'tish)
  api/lead/route.ts   — Forma ma'lumotlarini Telegram botga va Meta CAPI'ga yuboradi
  layout.tsx          — Umumiy layout, shriftlar, Meta Pixel bazaviy kodi
components/
  Hero, Journey, LeadForm, Footer, MetaPixel
lib/
  telegram.ts    — Telegram Bot API bilan ishlash
  metaCapi.ts    — Meta Conversions API bilan ishlash (SHA-256 hash bilan)
public/
  instructor.jpg — kurs muallifi fotosurati
```

## O'rnatish

```bash
npm install
```

`.env.local` fayli allaqachon mavjud (bo'sh qiymatlar bilan — localhostda test qilish uchun).
Haqiqiy qiymatlarni quyidagicha to'ldiring:

| O'zgaruvchi | Tavsif |
|---|---|
| `TELEGRAM_BOT_TOKEN` | @BotFather orqali yaratilgan bot tokeni |
| `TELEGRAM_CHAT_ID` | Xabarlar boradigan chat/kanal ID (@userinfobot orqali bilib oling) |
| `NEXT_PUBLIC_TELEGRAM_CHANNEL_URL` | Rahmat sahifasidan o'tiladigan Telegram kanal havolasi |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Events Manager'dagi Pixel ID |
| `META_CAPI_ACCESS_TOKEN` | Meta Conversions API access token (Events Manager > Conversions API) |
| `META_CAPI_TEST_EVENT_CODE` | (ixtiyoriy) test hodisalarini tekshirish uchun |
| `NEXT_PUBLIC_SITE_URL` | Saytning to'liq domeni (masalan `https://gipnoterapiya.uz`) |

## Ishga tushirish

```bash
npm run dev        # http://localhost:3000
npm run build       # production build
npm run start        # production serverni ishga tushirish
```

## Qanday ishlaydi

1. Foydalanuvchi bosh sahifada Ism va Telefon raqamini kiritadi.
2. "Kursga yozilish" bosilganda `/api/lead` route'ga so'rov ketadi:
   - ma'lumot Telegram botga xabar sifatida yuboriladi;
   - Meta Conversions API'ga "Lead" hodisasi server tomonidan yuboriladi (SHA-256 bilan xeshlangan holda).
3. Bir vaqtning o'zida brauzerda Meta Pixel orqali ham "Lead" hodisasi jo'natiladi
   (bir xil `event_id` bilan — Meta ikkalasini bitta hodisa sifatida hisoblaydi, ya'ni takrorlanmaydi).
4. Foydalanuvchi `/rahmat` sahifasiga o'tkaziladi — u yerda 10 soniyalik progress-ring
   animatsiyasi ko'rsatiladi, so'ng avtomatik Telegram kanaliga yo'naltiriladi
   ("Hozir o'tish" tugmasi orqali darhol o'tish ham mumkin).

## Deploy

1. GitHub'ga push qiling.
2. vercel.com'da repo'ni import qiling.
3. Environment Variables bo'limiga `.env.local`dagi barcha qiymatlarni kiriting.
4. Deploy tugmasini bosing.
