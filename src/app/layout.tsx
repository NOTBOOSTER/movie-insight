import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MovieInsight — AI-Powered Film Intelligence",
  description:
    "Enter any IMDb ID and receive a cinematic AI-generated analysis, sentiment classification, and editorial summary powered by Groq and LangChain.",
  keywords: ["movie", "AI", "film analysis", "sentiment", "IMDb", "Groq", "LangChain"],
  openGraph: {
    title: "MovieInsight",
    description: "Cinematic intelligence. Distilled.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoniModa.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
