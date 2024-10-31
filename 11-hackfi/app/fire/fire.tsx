"use client";

import dynamic from "next/dynamic";
import MintForm from "./fireForm";
import Image from "next/image";
import MintImage from "@/assets/shoot.gif";
import "./fire.css";

function MintNFT() {
  return (
    <div className=" pt-4 pb-20  lg:px-10 w-full">
      <div className="w-full px-2 lg:px-5 py-8 rounded-2xl border-2 border-black">
        <div className="bg-gradient bg-clip-text text-black text-xl lg:text-4xl font-extrabold">
          Shooting {" "}
          <span className="text-white animate-color-change">HackFi</span>.
        </div>
        <div className="flex w-full">
          <div className="w-full lg:w-[55%]"><MintForm /></div>
          <div className="w-[45%] hidden lg:block">
            <Image
              src={MintImage}
              alt="Mint"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MintNFT), {
  ssr: false,
});
