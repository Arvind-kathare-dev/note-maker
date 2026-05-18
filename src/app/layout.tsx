import type { Metadata } from "next";
import { Inter, Outfit, Roboto, Playfair_Display, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['400', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veloc Note Maker | Fast, Smart & Scalable Note Platform",
  description: "Boost productivity with Veloc Note Maker – a modern platform for notes, documentation, and knowledge management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = `${inter.variable} ${outfit.variable} ${roboto.variable} ${playfair.variable} ${montserrat.variable} ${jetbrains.variable}`;

  return (
    <html lang="en" className={`h-full ${fontVariables}`}>
      <body className="antialiased min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
