"use client";
import { moonbeamIndex, topFarmList } from "@/const/menu.const";
import { FarmsList } from "@/types";
import React, { useEffect, useMemo, useState } from "react";
import Table from "../common/Table";
import Card from "../common/Card";
import { useStore } from "@/store/useStore";
import { useAccount, useReadContract } from "wagmi";
import { moonbaseAlpha, sepolia } from "viem/chains";
import { pool_abis } from "@/common/abi/pool_abi";

function HomePage() {
  const { fetchPool, contractAddress } = useStore();
  const isMoonbeam = contractAddress === process.env.NEXT_PUBLIC_MOONBEAM_SMART_CONTRACT;

  const data = useReadContract({
    chainId: sepolia.id,
    address: `0x${contractAddress}`,
    functionName: "getAllPool",
    abi: pool_abis,
    args: [],
  });

  const moonbeamData = useReadContract({
    chainId: moonbaseAlpha.id,
    address: `0x${contractAddress}`,
    functionName: "getAllPool",
    abi: pool_abis,
    args: [],
  });

  console.log(moonbeamData)
  useEffect(() => {
    fetchPool();
  }, []);
  return (
    <div className="w-full h-full p-5 flex flex-col gap-5">
      <span className="text-3xl font-bold">Good to see you, farmer!</span>
      <div className="w-full h-[50%] grid grid-cols-4 gap-3">
        {topFarmList.map((item: FarmsList) => (
          <Card item={item} />
        ))}
      </div>
      <div className="w-full h-[40%] flex flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <span className="text-gray-400">Recommended</span>
          <button className="p-3 bg-white rounded-xl shadow-sm shadow-black">
            See more farms
          </button>
        </div>
        <div className="h-[80%]">
          <Table poolLists={isMoonbeam ? moonbeamData.data : data.data} role="EarnPool" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
