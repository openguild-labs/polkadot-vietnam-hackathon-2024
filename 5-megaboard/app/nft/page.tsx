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
import { erc20Abi } from "@/components/erc20-abi";
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

  useEffect(() => {
    fetchingData();
  }, []);

  const fetchingData = async () => {
    setIsLoading(true);
    if (account.address && tokenAddress) {
      try {
        const response = await readContract(config, {
          abi: erc20Abi,
          address: tokenAddress,
          functionName: 'getOOH_NFTs',
          args: [account.address],
        });

        const billboards = await Promise.all(response.map(async (tokenId) => {
          const tokenURI = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'tokenURI',
            args: [BigInt(tokenId)],
          });

          const res = await fetch(tokenURI);
          const data = await res.json();
          return data as Billboard;
        }));

        setData(billboards);
      } catch (error) {
        console.error('Error reading contract:', error);
        // You might want to set an error state here to display to the user
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Account or tokenAddress not available');
      setIsLoading(false);
    }
  }

  if (!account.isConnected) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        You need to connect your wallet
      </div>
    );
  }
 
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DisplayNft data={data} />
      )}
    </div>
  );
};

export default page;
