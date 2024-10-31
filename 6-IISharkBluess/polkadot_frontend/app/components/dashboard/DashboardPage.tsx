import React, { useMemo } from "react";
import Rewards from "../common/Rewards";
import { useStore } from "@/store/useStore";
import { useAccount, useReadContract } from "wagmi";
import Table from "../common/Table";
import { moonbaseAlpha, sepolia } from "viem/chains";
import { pool_abis } from "@/common/abi/pool_abi";
import { moonbeamIndex } from "@/const/menu.const";

function DashboardPage() {
  const { poolList, contractAddress } = useStore();
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
    <div className="w-full h-full p-5 flex flex-col gap-5">
      {/* firt session */}
      <div className="h-[50%] flex flex-col gap-5 w-full">
        <span className="text-green-500 text-xl font-semibold">
          My Borrowing Pool
        </span>
        <div className="h-[90%]">
          <Table poolLists={isMoonbeam ? moonbeamData.data : data.data} role="BorrowPool"/>
        </div>
      </div>
      {/* second session */}
      <div className="w-full h-1/2 flex flex-col gap-5">
        {/* tittle */}
        <div className="w-full flex justify-between items-center">
          <span className="text-xl text-violet-500 font-semibold">
            My Lending Pool
          </span>
          <div className="h-0.5 bg-gray-500 w-[85%]"></div>
        </div>
        <div className="w-full h-full flex gap-5">
          {/* my farm */}
          <div className="w-[80%] h-[80%]">
            <Table poolLists={isMoonbeam ? moonbeamData.data : data.data} role="LendPool" />
          </div>
          <div className="w-[20%] flex flex-col gap-3">
            <div className="h-[25%]">
              <Rewards />
            </div>
            <div className="h-[25%]">
              <Rewards />
            </div>
            <div className="h-[25%]">
              <Rewards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
