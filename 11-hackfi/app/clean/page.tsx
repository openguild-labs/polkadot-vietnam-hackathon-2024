'use client';

import dynamic from "next/dynamic";
import { Hero, Highlight } from "@/components/ui/hero";
import HeroImage, { HeroImage2 } from "@/components/svgcomponents/HeroImage";
import { Button } from "@/components/ui/button";
import { px } from "framer-motion";
import ShitCoffee from '@/assets/funny-shit.gif'
import CleanForm from './clean';

function AirdropPage() {
  return (
    <div className="mt-5 w-full flex flex-col justify-between items-center relative">
      <Hero className="flex items-center px-10">
        <div>
          <h1 className="text-sm lg:text-xl font-semibold text-black w-[95%] dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug lg:text-left">
            <Highlight className="text-left mb-2.5 text-4xl lg:text-7xl -top-9 font-bold">
              Clean HackFi
            </Highlight>
            <br />
            Clean {" "}
            <span className="bg-primary bg-clip-text text-transparent">
            HackFi NFT 
            </span>{" "}
            brings a refreshing twist to digital collectibles. It's a playful yet polished piece that stands out with its crisp design. Perfect for friends who appreciate a bit of humor and sophistication, this NFT adds a clean and clever touch to any collection.
          </h1>
          <CleanForm />
        </div>
        <div className="w-[30%] hidden lg:block">
          <HeroImage2 />
        </div>
      </Hero>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AirdropPage), { ssr: false });
