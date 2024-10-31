"use client";
import { PoolList } from "@/const/menu.const";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import SwapContent from "./Swap";
import Rewards from "../common/Rewards";
import { pool_abis } from "@/common/abi/pool_abi";
import { useAccount, useWriteContract } from "wagmi";
import updatePriceFeeds from "@/common/pyth/pyth";
import { standard_uint } from "@/const/pool.const";
import { readContractTemplalte } from "@/common/blockchain/ethereum/eth_template";
import { Token } from "@/types";

function DetailFarm({
  pool,
  setSelectedFarm,
  totalDeposits,
  lendToken,
  collateralToken,
}: {
  pool: any;
  setSelectedFarm: (item: any) => void;
  totalDeposits: string;
  lendToken: Token;
  collateralToken: any;
}) {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const tokenPrice = [BigInt(Number(2408020)), BigInt(Number(1409900))];
  const handleBorrowPool = async () => {
    const borrow = await writeContractAsync({
      abi: pool_abis,
      address: `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
      functionName: "borrow",
      args: [Number(pool.poolId), tokenPrice],
    });

    const approve = await writeContractAsync({
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      address: `0x${collateralToken.address}`,
      functionName: "approve",
      args: [
        `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
        pool.collateral_amount,
      ],
    });

    const depositeLender = await writeContractAsync({
      abi: pool_abis,
      address: `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
      functionName: "deposite",
      args: [
        `0x${pool.creator.substring(1)}`,
        `0x${lendToken.address}`,
        pool.lend_amount,
      ],
    });

    const depositeBorrower = await writeContractAsync({
      abi: pool_abis,
      address: `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
      functionName: "deposite",
      args: [
        `0x${address?.substring(1)}`,
        `0x${collateralToken.address}`,
        pool.collateral_amount,
      ],
    });
  };

  const handleRepay = async () => {
    console.log("check", address, pool.borrower);
    if (address === pool.borrower) {
      const repay = await writeContractAsync({
        abi: pool_abis,
        address: `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
        functionName: "repay",
        args: [Number(pool.poolId)],
      });
    } else {
      alert("You are not borrower");
    }
  };

  const handleWithdraw = async () => {
    if (address === pool.borrower) {
      const repay = await writeContractAsync({
        abi: pool_abis,
        address: `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
        functionName: "withdraw",
        args: [`0x${collateralToken.address}`, pool.collateral_amount],
      });
    } else if (address === pool.creator) {
      const repay = await writeContractAsync({
        abi: pool_abis,
        address: `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
        functionName: "withdraw",
        args: [`0x${lendToken.address}`, pool.lend_amount],
      });
    } else {
      alert("You don't have pool");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {/* navbar */}
      <div className="w-full h-full flex justify-between">
        <div className="flex gap-5">
          <FontAwesomeIcon
            onClick={() => setSelectedFarm(null)}
            icon={faArrowLeft}
            className="w-8 h-8 p-3 rounded-xl cursor-pointer bg-gray-200"
          />
          <div className="h-full flex items-center">
            <div className="flex">
              <img
                src={lendToken.icon}
                alt={lendToken.name}
                className="w-10 h-10 rounded-full block"
              />
              <img
                src={collateralToken.icon}
                alt={collateralToken.name}
                className="w-10 h-10 rounded-full block -translate-x-3"
              />
            </div>
            <span className="text-xl text-center font-semibold">
              {lendToken.name} - {collateralToken.name}
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-gray-400">
            Pool: <span className="text-black">{pool.name}</span>
          </span>
          <span className="text-gray-400">
            TVL: <span className="text-black">{totalDeposits}</span>
          </span>
          <div className="px-2 py-1 rounded-full text-[#edb45f] bg-[#fcead1] opacity-75 flex justify-center items-center">
            <FontAwesomeIcon icon={faStar} className="w-5 h-5" />
            New
          </div>
        </div>
      </div>
      {/* content */}
      <div className="w-full flex gap-5">
        <div className="w-[60%] h-full flex flex-col gap-5">
          {/* pool */}
          <div className="w-full p-5 rounded-xl bg-[#F6F6F6] flex flex-col gap-3">
            <span className="text-sm text-gray-400">Interest rate</span>
            <span className="text-3xl font-semibold">{pool.profit}%</span>
            <div className="w-full p-3 rounded-lg bg-white flex gap-[5%] items-center">
              <img src="./images/logo.png" alt="logo" className="w-10 h-10" />
              <span className="font-bold text-xl">{pool.name}</span>
              <span className="font-semibold text-xl">
                {(Number(pool.lend_amount) / 10 ** lendToken.decimals).toFixed(
                  2
                )}
              </span>
              <span className="text-gray-400">
                {(
                  Number(pool.collateral_amount) /
                  10 ** collateralToken.decimals
                ).toFixed(2)}
              </span>
              <button
                className="p-2 font-semibold bg-red-300 rounded-xl"
                onClick={handleBorrowPool}
              >
                Borrow
              </button>
              <button
                className="p-2 font-semibold bg-blue-300 rounded-xl"
                onClick={handleRepay}
              >
                Repay
              </button>
              <button
                className="p-2 font-semibold bg-green-300 rounded-xl"
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
            </div>
          </div>
          {/* desc */}
          <div className="w-full p-5 rounded-xl bg-[#F6F6F6] flex flex-col gap-3">
            <span className="text-sm text-gray-400">Description</span>
            <span className="text-bold">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat
              sequi expedita, odio eligendi officia consequuntur aut officiis
              voluptatibus eaque odit debitis illo quaerat labore eius omnis,
              commodi facilis in porro eum, iure minus totam? Necessitatibus
              culpa rerum, facere quidem labore nisi impedit sapiente explicabo
              doloremque, delectus enim exercitationem, voluptatem debitis a
              mollitia! Quasi facilis consectetur amet repellat rem distinctio
              minima odio asperiores laborum quis accusantium mollitia molestiae
              repellendus reprehenderit, veritatis eaque voluptas quidem vel
              similique dicta quibusdam recusandae voluptatem ab nulla? Error
              libero molestias reiciendis inventore, quae accusamus perferendis
              atque odit asperiores repellendus architecto expedita aliquid
              magni numquam, amet tempora?
            </span>
          </div>
        </div>
        <div className="w-[40%] flex flex-col gap-5">
          <SwapContent
            pool={pool}
            lendToken={lendToken}
            collateralToken={collateralToken}
            tokenPrice={tokenPrice}
          />
          <Rewards />
        </div>
      </div>
    </div>
  );
}

export default DetailFarm;
