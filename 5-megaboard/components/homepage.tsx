"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { nftAbi } from "./nft-abi";
import { Hero, Highlight } from "./ui/hero";
import dynamic from "next/dynamic";
import { useChainId } from "wagmi";
import { CONTRACT_NFT_ADDRESS_BAOBAB } from "./contract";
import { Button } from "./ui/button";
import Link from "next/link";
import HeroImage from "./svgcomponents/HeroImage";
import CustomButton from "./Button/CustomButton";
// import HeroImage from "@/assets/HeroImage.svg";

const formSchema = z.object({
  to: z.coerce.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  uri: z.coerce.string({
    required_error: "uri is required",
    invalid_type_error: "uri must be a number",
  }),
});

function HomePage() {
  const { toast } = useToast();
  let chainId = useChainId();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  // 2. Define a submit handler.


  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="w-full ">
      <Hero className="w-full flex items-center justify-center py-36px-10 gap-10">
        <div>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-sm  md:text-xl lg:text-xl font-semibold  text-justify dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug lg:text-left"
          >
            <Highlight className="mb-2.5 text-5xl lg:text-7xl -top-9 font-bold">
              Rental Billboard By OOH
            </Highlight>
            {/* break line */} <br />
          
            <span className="bg-primary bg-clip-text text-transparent">
            OOH
            </span>{" "}
             is a platform that serves as an intermediary for billboard rental services. Users can post their available billboards, while others can search for and rent them in prime locations.
          </motion.h1>
          <Link href="/booking">
          <div className="w-[240px] mt-10">
          <CustomButton content="Booking now" onclick={()=>{}} />

          </div>

            {/* <Button
              variant="default"
              size="default"
              className="bg-black flex mt-6 text-white">
              Shoot HackFi Now
            </Button> */}
          </Link>
        </div>
        <div className="w-[30%] hidden lg:block">
          {/* <HeroImage /> */}
        </div>
      </Hero>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});
