"use client";

import DisplayNft from "@/components/Nft/DisplayNft";
import React, { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import {
  CONTRACT_NFT_ADDRESS_MOONBEAM,
  BLOCK_EXPLORER_MOONBEAM,
  BLOCK_EXPLORER_BAOBAB,
  CHAINID,
} from "@/components/contract";
import { readContract } from "@wagmi/core";
import { tokenAbi } from "@/components/token-abi";
import { config } from "../config";
import { Billboard } from "@/lib/type";

const page = () => {
  const account = useAccount();
  const chainId = useChainId();
  const { data: hash, writeContract } = useWriteContract();
  const [data, setData] = useState<Billboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  let blockexplorer: string;
  let tokenAddress: `0x${string}`;
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (account.isConnected) {
      fetchingData();
    }
  }, [account.isConnected]);

  // Handle chain-specific values
  switch (chainId) {
    case CHAINID.BAOBAB:
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;
    case CHAINID.MOONBEAM:
      tokenAddress = CONTRACT_NFT_ADDRESS_MOONBEAM;
      blockexplorer = BLOCK_EXPLORER_MOONBEAM;
      break;
    default:
      throw new Error("Network not supported");
  }

  const fetchingData = async () => {
    setIsLoading(true);
    if (account.address && tokenAddress) {
      try {
        const response = await readContract(config, {
          abi: tokenAbi,
          address: tokenAddress,
          functionName: 'getOOH_NFTs',
          args: [account.address],
        });

        const billboards = await Promise.all((response as number[]).map(async (tokenId) => {
          const tokenURI = await readContract(config, {
            abi: tokenAbi,
            address: tokenAddress,
            functionName: 'tokenURI',
            args: [BigInt(tokenId)],
          });

          const res = await fetch(tokenURI as string);
          const data = await res.json();
          return data as Billboard;
        }));

        setData(billboards);
      } catch (error) {
        console.error('Error reading contract:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Account or tokenAddress not available');
      setIsLoading(false);
    }
  };

  const handleCoinFlip = () => {
    if (!selectedSide) return;
    
    setIsFlipping(true);
    // Simulate coin flip
    setTimeout(() => {
      const flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(flipResult);
      setIsFlipping(false);
    }, 2000);
  };

  if (!mounted) {
    return null; // Return null on first render to avoid hydration mismatch
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-red-900 pt-24">
      {!account.isConnected ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          You need to connect your wallet
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg text-center w-[90%] max-w-[400px] p-6 m-4">
            <div className="mb-8">
              <div className={`w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-yellow-400 border-4 border-yellow-500 flex items-center justify-center text-xl md:text-2xl font-bold ${isFlipping ? 'animate-spin' : ''}`}>
                {result || 'HEADS'}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                className={`px-4 md:px-6 py-2 rounded ${selectedSide === 'heads' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedSide('heads')}
              >
                HEADS
              </button>
              <button
                className={`px-4 md:px-6 py-2 rounded ${selectedSide === 'tails' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedSide('tails')}
              >
                TAILS
              </button>
            </div>

            <button
              className={`w-full md:w-auto px-8 py-3 rounded bg-green-500 text-white ${(!selectedSide || isFlipping) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleCoinFlip}
              disabled={!selectedSide || isFlipping}
            >
              FLIP COIN
            </button>

            {result && (
              <div className="mt-4">
                {result === selectedSide ? (
                  <p className="text-green-600 font-bold">YOU WON!</p>
                ) : (
                  <p className="text-red-600 font-bold">YOU LOST!</p>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="mt-4">Loading...</div>
          ) : (
            <div className="w-[90%] max-w-[1200px] mt-4">
              <DisplayNft data={data} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default page;