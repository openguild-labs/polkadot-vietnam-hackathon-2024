import { Header } from "@/components/layouts/header";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <Header />
      <div className="mt-24">{children}</div>
    </ThemeProvider>
  );
}
