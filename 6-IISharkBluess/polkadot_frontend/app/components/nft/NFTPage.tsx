import { NFT_List } from "@/const/menu.const";
import React from "react";
import NFTCard from "./NFTCard";
import Pagination from "../common/Pagination";

function NFTPage() {
  return (
    <div className="w-full h-full flex flex-col items-end justify-between p-5">
      <div className="w-full h-full gap-3 grid grid-cols-4 grid-rows-2">
        {NFT_List.map((item) => (
          <NFTCard nft={item} />
        ))}
      </div>
    </div>
  );
}

export default NFTPage;
