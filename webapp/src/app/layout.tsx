import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alaf Vision",
  description: "Yüksek Performanslı Otomatik Plaka Tanıma ve Akıllı Görüntü Analizi Sistemi",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="%233b82f6" stroke-width="8" fill="none" /><circle cx="50" cy="50" r="20" fill="%238b5cf6" /><circle cx="20" cy="50" r="8" fill="%23ec4899" /><path d="M20 50 Q50 20 80 50" stroke="%233b82f6" stroke-width="4" fill="none" /></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-200">{children}</body>
    </html>
  );
}
