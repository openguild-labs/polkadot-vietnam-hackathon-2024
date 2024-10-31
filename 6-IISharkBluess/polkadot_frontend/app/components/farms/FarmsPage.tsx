import React, { useMemo } from "react";
import Table from "../common/Table";
import { useStore } from "@/store/useStore";
import { useAccount, useReadContract } from "wagmi";
import { moonbaseAlpha, sepolia } from "viem/chains";
import { pool_abis } from "@/common/abi/pool_abi";
import { moonbeamIndex } from "@/const/menu.const";

function FarmsPage() {
  const { poolList, contractAddress } = useStore();
  const { address } = useAccount();
  const isMoonbeam = contractAddress === process.env.NEXT_PUBLIC_MOONBEAM_SMART_CONTRACT;
  
  const moonbeamData = useReadContract({
    chainId: moonbaseAlpha.id,
    address: `0x${contractAddress}`,
    functionName: "getAllPool",
    abi: pool_abis,
    args: [],
  });

  const data = useReadContract({
    chainId: sepolia.id,
    address: `0x${contractAddress}`,
    functionName: "getAllPool",
    abi: pool_abis,
    args: [],
  });
  return (
    <div className="w-full h-full px-5 py-5 flex flex-col justify-between">
      <Table poolLists={isMoonbeam ? moonbeamData.data : data.data} role="EarnPool" />
    </div>
  );
}

export default FarmsPage;
