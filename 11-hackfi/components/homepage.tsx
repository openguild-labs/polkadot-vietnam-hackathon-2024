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
import { CONTRACT_NFT_ADDRESS_BAOBAB, CONTRACT_NFT_ADDRESS_CYPRESS } from "./contract";
import { Button } from "./ui/button";
import Link from "next/link";
import HeroImage from "./svgcomponents/HeroImage";
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert 'to' address to appropriate format
    try {
      await writeContract({
        abi: nftAbi,
        address:
          chainId === 1001 ? CONTRACT_NFT_ADDRESS_BAOBAB : CONTRACT_NFT_ADDRESS_CYPRESS,
        functionName: "shootingShitNFT",
        args: [`0x${values.to.slice(2)}`], // Pass the 'to' and 'uri' values as arguments
      });
      toast({
        variant: "default",
        className: "bg-white",
        title: "Transaction successful",
        description: "Shoot HackFi NFT minted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transaction reverted",
        description: `${(error as BaseError).shortMessage.split(":")[1]}`,
      });
    }
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="w-full">
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
            className="text-sm  md:text-xl lg:text-xl font-semibold text-black text-justify dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug lg:text-left"
          >
            <Highlight className="mb-2.5 text-5xl lg:text-7xl -top-9 font-bold">
              Shoot HackFi NFT for your friends
            </Highlight>
            {/* break line */} <br />
            The{" "}
            <span className="bg-primary bg-clip-text text-transparent">
              HackFi
            </span>{" "}
             is the ultimate digital collectible to surprise your friends. With its bold design and edgy concept, it's more than just an NFT—it's a statement. Gift it to your friends to set their collection ablaze and make them laugh with this fiery, fun addition!
          </motion.h1>
          <Link href="/fire">
            <Button
              variant="default"
              size="default"
              className="bg-black flex mt-6 text-white">
              Shoot HackFi Now
            </Button>
          </Link>
        </div>
        <div className="w-[30%] hidden lg:block">
          <HeroImage />
        </div>
      </Hero>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});
