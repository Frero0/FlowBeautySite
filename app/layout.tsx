import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Flow Beauty Estetica | Centro estetico a Pinerolo",
  description:
    "Flow Beauty Estetica: trattamenti viso, unghie, laminazione ed epilazione a Pinerolo. Prenota online in pochi click."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${body.variable} ${display.variable}`}>
      <body className="bg-nude-50 text-ink antialiased">{children}</body>
    </html>
  );
}
