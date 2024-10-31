"use client";

import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default function Hero() {
  return (
    <div className="relative flex flex-col justify-center items-center Lg:pt-10 lg:pt-24 xl:pt-32 gap-2 lg:gap-8 select-none">
      <h1 className="text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6">
        <Balancer>
          A protocol & developer stack for delivering your product experiences.{" "}
          <Cover className="bg-gradient bg-clip-text text-transparent">
            Everywhere.
          </Cover>
        </Balancer>
      </h1>
      <Link href={"/assetlinks"}>
        <Button size="lg" className="bg-black text-white font-semibold z-10">
          Try It Now
        </Button>
      </Link>
    </div>
  );
}
