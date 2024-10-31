"use client";
import { useState, useEffect } from "react";
import { readContract } from "@wagmi/core";
import { MEME_LAUNCHPAD_ADDRESS_MOONBEAM, CHAINID } from "./contract";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Hero } from "./ui/hero";
import dynamic from "next/dynamic";
import { useChainId } from "wagmi";
import { Button } from "./ui/button";
import Link from "next/link";
import { TokenCard } from "./ui/TokenCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { config } from "@/app/config";

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

const createTokenFormSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required"),
});

function HomePage() {
  const { toast } = useToast();
  let chainId = useChainId();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { data: createHash, writeContract: writeCreateToken } = useWriteContract();
  const [tokens, setTokens] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createTokenForm = useForm<z.infer<typeof createTokenFormSchema>>({
    resolver: zodResolver(createTokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
    },
  });

  const onCreateToken = async (values: z.infer<typeof createTokenFormSchema>) => {
    try {
      console.log("Creating token with values:", values); // Debug log
      await writeCreateToken({
        address: "0x3c94fadc6e34bc0a3bf3dc71dac00380d07638c9", // Updated contract address
        abi: [{
          name: "deployERC20Token",
          type: "function",
          stateMutability: "payable",
          inputs: [
            { type: "string", name: "name" },
            { type: "string", name: "symbol" }
          ],
          outputs: [],
        }],
        functionName: "deployERC20Token",
        value: BigInt(10000000000000000), // 0.01 ETH in wei
        args: [values.name, values.symbol],
        chainId: CHAINID.MOONBEAM, // Add chainId
        // Add legacy flag to match your cast command
        gas: BigInt(2000000), // Add gas limit
      });
      toast({
        title: "Success",
        description: "Token creation transaction submitted",
      });
    } catch (error) {
      console.error("Error creating token:", error);
      toast({
        title: "Error",
        description: `Failed to create token: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const fetchTokens = async () => {
    try {
      const data = await readContract(config, {
        address: MEME_LAUNCHPAD_ADDRESS_MOONBEAM,
        abi: [
          {
            name: "getAllTokens",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [{ type: "address[]" }],
          },
        ],
        functionName: "getAllTokens",
        chainId: CHAINID.MOONBEAM,
      });
      console.log("Fetched tokens:", data);
      setTokens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tokens",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  // Refresh tokens list when a new token is created
  useEffect(() => {
    if (createHash) {
      fetchTokens();
    }
  }, [createHash]);

  return (
    <div className="min-h-screen bg-red-900 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Create Token Button and Modal */}
        <div className="mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Token</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Token</DialogTitle>
              </DialogHeader>
              <Form {...createTokenForm}>
                <form onSubmit={createTokenForm.handleSubmit(onCreateToken)} className="space-y-4">
                  <FormField
                    control={createTokenForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input placeholder="MyToken" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createTokenForm.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="MTK" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createTokenForm.formState.isSubmitting}>
                    {createTokenForm.formState.isSubmitting ? "Creating..." : "Create Token"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="following" className="w-full">
          <TabsList className="mb-8 flex space-x-2 overflow-x-auto">
            <TabsTrigger className="min-w-[100px]" value="following">Following</TabsTrigger>
            <TabsTrigger className="min-w-[100px]" value="terminal">Terminal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="following">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((tokenAddress, index) => (
                <TokenCard
                  key={tokenAddress}
                  creatorAddress={tokenAddress}
                  tokenName={`Token ${index + 1}`}
                  marketCap="TBD"
                  replies={0}
                  timestamp="Now"
                  ticker="TBD"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="terminal">
            <div className="text-zinc-400">
              Terminal content here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});