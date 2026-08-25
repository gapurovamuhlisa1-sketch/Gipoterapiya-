import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gipnoterapiya darsligi",
  description:
    "O'tmishdan kelgan og'riqlarni unuting, yangi pog'onaga dasturlaning. Gipnoterapiya darsligiga hoziroq yoziling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${fraunces.variable} ${karla.variable}`}>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
