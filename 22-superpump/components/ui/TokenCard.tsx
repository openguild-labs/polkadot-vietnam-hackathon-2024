import { Button } from "@/components/ui/button";
import { useWriteContract } from 'wagmi';
import { useToast } from "@/components/ui/use-toast";
import { CHAINID } from "../contract";
import Link from "next/link";

export function TokenCard({
  creatorAddress,
  tokenName,
  marketCap,
  replies,
  timestamp,
  ticker,
}: {
  creatorAddress: string;
  tokenName: string;
  marketCap: string;
  replies: number;
  timestamp: string;
  ticker: string;
}) {
  const { toast } = useToast();
  const { writeContract } = useWriteContract();

  const handleBuyToken = async () => {
    try {
      await writeContract({
        address: "0x4fe8ea21679b3ee10457a097c38452a94edab33b",
        abi: [{
          name: "buy",
          type: "function",
          stateMutability: "payable",
          inputs: [
            { type: "address", name: "tokenAddress" },
            { type: "uint256", name: "amount" },
            { type: "uint256", name: "minTokens" }
          ],
          outputs: [],
        }],
        functionName: "buy",
        value: BigInt(10000000000000000), // 0.01 ETH
        args: [
          creatorAddress as `0x${string}`, // token address
          BigInt(10000000000000000), // amount
          BigInt(10000000000000000), // minTokens
        ],
        chainId: CHAINID.MOONBEAM,
        gas: BigInt(2000000),
      });

      toast({
        title: "Success",
        description: "Buy token transaction submitted",
      });
    } catch (error) {
      console.error("Error buying token:", error);
      toast({
        title: "Error",
        description: `Failed to buy token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  return (
    <div className="rounded-lg border p-4 space-y-4 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold">{tokenName}</h3>
            <span className="text-xs text-zinc-500">{timestamp}</span>
          </div>
          <p className="text-xs text-zinc-500">
            Created by{" "}
            <Link href={`https://moonscan.io/address/${creatorAddress}`} target="_blank" className="text-blue-500 hover:underline">
              {`${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`}
            </Link>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-zinc-500">Market Cap</p>
          <p className="font-medium">{marketCap}</p>
        </div>
        <div>
          <p className="text-zinc-500">Ticker</p>
          <p className="font-medium">{ticker}</p>
        </div>
      </div>
      <div className="flex justify-between items-center space-x-4">
        <Button 
          onClick={handleBuyToken} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Buy Token
        </Button>
      </div>
    </div>
  );
}