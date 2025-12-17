import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ScrollRestoration } from "@/components/ScrollRestoration";

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
      <body className="bg-nude-50 text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <BackToTop />
        <ScrollRestoration />
      </body>
    </html>
  );
}
