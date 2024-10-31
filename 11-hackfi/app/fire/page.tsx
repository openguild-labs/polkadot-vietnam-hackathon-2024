import dynamic from "next/dynamic";
import Mint from "./fire";
import { motion } from "framer-motion";
import { Hero, Highlight } from "@/components/ui/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroImage from "@/components/svgcomponents/HeroImage";

function MintNFTPage() {
  return (
    <>
      <div className="flex flex-col justify-between items-center w-full relative">
        <Hero className="flex items-center w-full px-10 gap-10">
          <div>
            <h1
              className="text-sm md:text-xl  lg:text-xl font-semibold text-black  dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left"
            >
              <Highlight className="mb-2.5 text-4xl lg:text-7xl -top-9 font-bold">
                Shoot HackFi NFT for your friends
              </Highlight>
              {/* break line */} <br />
              Fire {" "}
              <span className="bg-primary bg-clip-text text-transparent">
              HackFi NFT
              </span>{" "}
               is the ultimate digital collectible to surprise your friends. With its bold design and edgy concept, it's more than just an NFT—it's a statement. Gift it to your friends to set their collection ablaze and make them laugh with this fiery, fun addition!
            </h1>
          </div>
          <div className="w-[20%] hidden lg:block ">
            <HeroImage />
          </div>
        </Hero>
        <Mint />
      </div>
    </>
  );
}
export default dynamic(() => Promise.resolve(MintNFTPage), { ssr: false });
