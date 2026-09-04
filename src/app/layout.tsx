import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luna Desk | Atencion multicanal con IA — MAY-CODE",
  description:
    "Inbox unificado con agentes IA para WhatsApp, Instagram, Web, Email y Llamadas. Por MAY-CODE (Lima).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
