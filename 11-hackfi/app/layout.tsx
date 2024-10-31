import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import ImageDropEffect from '@/components/ImageDropEffect';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackFi",
  description: "Shoot HackFi NFT for your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ImageDropEffect />
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
