"use client";

import FooterActionpage from "@/components/layouts/footer-actionpage";
import HeaderActionPage from "@/components/layouts/header-actionpage";
import { QueryClient } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/components/wagmi-providers";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Providers>
        <HeaderActionPage />
        <div className="flex flex-col h-[80vh]">{children}</div>
        <FooterActionpage />
      </Providers>
    </>
  );
}
