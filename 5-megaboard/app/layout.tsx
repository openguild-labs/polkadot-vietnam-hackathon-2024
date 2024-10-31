import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import ImageDropEffect from "@/components/ImageDropEffect";
import { ConfigProvider } from "antd";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mega-Board",
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
        <div id="root">
          {/* <ImageDropEffect /> */}
          <Providers>
            <Header />
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "Nord",
                },
              }}
            >
              <AntdRegistry>{children}</AntdRegistry>
            </ConfigProvider>
            <Toaster />
          </Providers>
        </div>
      </body>
    </html>
  );
}
