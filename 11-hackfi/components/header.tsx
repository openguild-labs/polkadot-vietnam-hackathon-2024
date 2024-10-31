"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "@/assets/hacker-logo.png";
import { usePathname } from "next/navigation";

function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname= usePathname()

  const navItems = [
    { href: "/staking", label: "Staking 💰" },
    { href: "/story", label: "Story 📖" },
    { href: "/fire", label: "Fire 🔥" },
    { href: "/clean", label: "Clean 🧹" },
    { href: "/super-hack", label: "Super HackFi 🚩" },
  ];

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <>
      <nav className="flex lg:absolute top-0 z-[100] items-center justify-between  w-full px-10 py-1 text-nowrap text-xs ">
        <div>
          <Link href="/" className="flex items-center">
            <Image
              className="cursor-pointer w-[4rem] h-auto"
              src={logo}
              alt="logo"
            />
            <div className="ml-4 text-black -top-9 font-bold text-xs md:text-xl lg:text-xl lg:font-semibold max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto">
              HackFi 🔥
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex gap-10">
        <ul className="flex gap-10 text-xl px-4 md:text-xl font-semibold text-neutral-700 dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto">
            {navItems.map((item, index) => {
              // Check if the current item href matches the active route
              const isActive =pathname === item.href;

              return (
                <li
                  key={index}
                  className={`py-1 transition-all duration-300 transform ${
                    isActive
                      ? "scale-105 shadow-lg border-r-4 border-b-4 border-solid border-[#d4b3ac]  bg-[#e9e1df] p-2 rounded-lg"
                      : ""
                  }`}
                >
                  <Link href={item.href}>
                    <div
                      className={`text-black ${ isActive ? "text-[#b17a5e] italic" : ""
                      }`}
                    >
                      {item.label}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="connect-btn">
            <ConnectButton accountStatus="avatar" />
          </div>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            className="text-secondary focus:outline-none"
            onClick={toggleMobileNav}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {isMobileNavOpen && (
        <nav className="lg:hidden flex flex-col items-center justify-between bg-gradient-bg w-full px-10 py-1 text-nowrap text-xs ">
          <ul className="flex flex-col items-center gap-4 text-xl font-semibold text-neutral-700 dark:text-zinc-400">
            {navItems.map((item, index) => (
              <li key={index} className="py-1">
                <Link href={item.href}>
                  <div className="text-secondary">{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="connect-btn mt-4">
            <ConnectButton accountStatus="avatar" />
          </div>
        </nav>
      )}
    </>
  );
}

export default Header;
