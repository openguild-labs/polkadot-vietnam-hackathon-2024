"use client"
import { Billboard } from "@/lib/type";
import { Button, Tag } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
interface CardProps {
  billboard: Billboard;
}
const NftBillBoard: React.FC<CardProps> = ({ billboard }) => {
  const router = useRouter()
  const navigateProposal = ()=>{
    router.push('/nft/proposal')
  }
  const navigateTracking = ()=>{
    router.push('/tracking')
  }
  console.log(billboard.imageUrl)
  return (
    <div className="bg-white/60 text-black shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 h-[290px] w-[300px]">
      <img
        alt="billboard"
        src={billboard.imageUrl}
        className="w-full h-40 object-cover bg-transparent"
      />
      <div className="p-4">
        <h3 className="text-sm overflow-hidden h-[22px]">
          {billboard.address}
        </h3>
        <p className="">Rental Price: {billboard.price}/day</p>
        <p className="">
          Mint:{" "}
          {billboard.isMint ? (
            <Tag color="green">True</Tag>
          ) : (
            <Tag color="error">False</Tag>
          )}
        </p>

        <div className="flex gap-2 mt-3">
          <Button color="primary" variant="solid" onClick={navigateProposal}>
            Proposal
          </Button>

          {billboard.status === 1 && (
            <Button color="default" variant="solid" onClick={navigateTracking}>
              Track
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftBillBoard;
