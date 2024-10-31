"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import mintImage from "@/assets/bahroo-hacker.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { nftAbi } from "../../components/nft-abi";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { Hero, Highlight } from "../../components/ui/hero";
import MintButton from "../../components/ui/mint-btn";
import dynamic from "next/dynamic";
import { useChainId } from "wagmi";
import {
  BLOCK_EXPLORER_BAOBAB,
  BLOCK_EXPLORER_CYPRESS,
  
  CHAINID,
  CONTRACT_NFT_ADDRESS_BAOBAB,
  CONTRACT_NFT_ADDRESS_CYPRESS,

  CONTRACT_STAKE_ADDRESS_BAOBAB,
  CONTRACT_STAKE_ADDRESS_CYPRESS
} from "../../components/contract";

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

export default function MintForm() {
  const { toast } = useToast();
  let chainId = useChainId();
  let contractAddress: any;
  switch (chainId) {
    case CHAINID.BAOBAB:
      contractAddress = CONTRACT_NFT_ADDRESS_BAOBAB;
      break;

    case CHAINID.CYPRESS:
      contractAddress = CONTRACT_NFT_ADDRESS_CYPRESS;
      break;

    default:
      throw new Error("Network not supported");
  }
  let blockexplorer;
  switch (chainId) {
    case CHAINID.BAOBAB:
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;

    case CHAINID.CYPRESS:
      blockexplorer = BLOCK_EXPLORER_CYPRESS;
      break;

    default:
      throw new Error("Network not supported");
  }
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
        address: contractAddress,
        functionName: "shootingShitNFT",
        args: [`0x${values.to.slice(2)}`], // Pass the 'to' and 'uri' values as arguments
      });
      toast({
        variant: "default",
        className: "bg-white",
        title: "Transaction successful",
        description: "SoulBound NFT minted successfully!",
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full text-white"
        >
          <FormField
            control={form.control}
            name="uri"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <div></div>
                <div>
                  <FormControl className="my-1.5">
                    <Input
                      type="hidden"
                      {...field}
                      value="https://peach-realistic-spider-498.mypinata.cloud/ipfs/QmQNEoAnnNmyacZmEMTSH39B2E2SMMB89fHZHZjyu5yd3R"
                    />
                  </FormControl>
                </div>

                <div className="mb-1">
                  <Image 
                    src={mintImage}
                    alt="Shit"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-8">
                <div>
                  <FormLabel className="text-md text-black font-semibold hover:text-gray-700 transition-colors duration-300">
                    To Address:{" "}
                  </FormLabel>
                  <FormControl className="my-1.5">
                    <Input
                      required
                      type="text"
                      placeholder="Enter Address"
                      {...field}
                      value={field.value ?? ""}
                      className="
                        bg-secondary-bg text-dark-text
                        border-none
                        focus:outline-none
                        placeholder-dark-text
                        "
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <MintButton />
          )}
        </form>
      </Form>
      <div className="bg-secondary-bg p-6 mt-10 inline-block w-full lg:w-[70%] rounded-xl">
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Transaction status
        </h3>
        {hash ? (
          <div className="flex flex-row gap-2">
            Hash:
            <a
              target="_blank"
              className="text-blue-500 underline"
              // href={`https://baobab.klaytnfinder.io/tx/${hash}`}
              href={`${blockexplorer + hash}`}
            >
              {truncateAddress(hash)}
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-2">
              Hash: no transaction hash until after submission
            </div>
            <Badge variant="outline" className="border-[#2B233C]">
              No transaction yet
            </Badge>
          </>
        )}
        {isConfirming && (
          <Badge variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waiting for confirmation...
          </Badge>
        )}
        {isConfirmed && (
          <Badge className="flex flex-row items-center w-[40%] bg-green-500 cursor-pointer">
            <Check className="mr-2 h-4 w-4" />
            Transaction confirmed!
          </Badge>
        )}
      </div>
    </>
  );
}
