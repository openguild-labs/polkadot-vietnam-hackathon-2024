"use client";

import { useState } from "react";
// import { Button, Typography } from "@material-tailwind/react";
import { Footer } from "@/components";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function Hero() {
  // get address to check if wallet is connected
  const address = useAddress();
  const route = useRouter();
  const handleClick = () => {
    route.push("./launchpad");
  };
  return (
    <div
      className={`relative min-h-screen w-full bg-cover bg-no-repeat  overflow-hidden`}
      style={{
        backgroundImage: `url('https://www.hdwallpapers.in/download/dragon_dark_blue_background_4k_hd_horizon_forbidden_west-3840x2160.jpg')`,
      }}
    >
      {/* Overlay Gradient */}
      {/* <div className="absolute top-0 right-0 h-full w-full pointer-events-none">
        <div className="absolute right-0 bottom-0 w-[40%] h-[40%] bg-gradient-to-t from-neutral via-transparent to-transparent opacity-60 rounded-full animate-floating"></div>
      </div>
      <div className="absolute bottom-0 right-0 h-full w-full pointer-events-none">
        <div className="absolute bottom-0 bottom-0 w-[40%] h-[40%] bg-gradient-to-t from-neutral via-transparent to-transparent opacity-60 rounded-full animate-floating"></div>
      </div> */}
      <div className="absolute inset-0 h-full w-full bg-gray-900/40" />
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <h1 className="mb-2 text-white text-2xl">Project Launch Pad</h1>
          <h1 className="text-5xl text-white font-bold">
            Polkadot Hackathon - DeFi Track
          </h1>
          <span
            color="white"
            className="mt-3 mb-12 w-full md:max-w-full lg:max-w-2xl text-white"
          >
            Our launchpad allows projects to raise funds by locking vTokens for
            staking rewards, with native tokens in return and automatic vToken
            release post lock-up.
          </span>
          <div className="flex items-center gap-4 ">
            {address ? (
              <Button className=" bg-white rounded-md" onClick={handleClick}>
                Launchpad
              </Button>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Hero;
