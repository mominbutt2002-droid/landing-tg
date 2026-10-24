import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { LeadFormProvider } from "@/components/providers/LeadFormContext";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Nexus AI — ИИ-автоматизация для бизнеса",
  description:
    "Внедрение ИИ в процессы компании: пилот за 14 дней, интеграции и сопровождение.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full bg-[#0c1222] font-body text-slate-200 antialiased">
        <LenisProvider>
          <LeadFormProvider>{children}</LeadFormProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
