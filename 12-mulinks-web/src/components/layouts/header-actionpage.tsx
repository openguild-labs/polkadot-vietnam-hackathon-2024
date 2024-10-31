"use client";
import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TempLogo from "../../../public/temp-logo";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const menuItems = [{ label: "Terms of service", path: "#" }];

export default function HeaderActionPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-black">
      <div className="px-4">
        <div className="container">
          <div className="py-4 flex items-center justify-between">
            <div className="relative">
              <Link href={"/"}>
                <TempLogo />
              </Link>
            </div>
            <div
              className="border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <MenuIcon className="text-black dark:text-white" />
            </div>
            <nav
              className={`flex gap-6 items-center ${
                isOpen ? "block" : "hidden"
              } lg:flex justify-center absolute top-14 left-0 right-0 bg-white dark:bg-black lg:static lg:bg-transparent z-10 p-4 lg:p-0`}
            >
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-[#737373] font-semibold hover:text-opacity-100 transition block lg:inline-block py-2 lg:py-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={"/create"}
                className="bg-[#e9e9e9] text-black py-2 px-4 rounded-lg block lg:inline-block"
              >
                Get Started
              </Link>
              <ConnectButton />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
