import React from "react";

function NFTCard({ nft }: { nft: any }) {
  return (
    <div className="w-full h-full shadow-inner p-6 shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative">
      <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
        <p>{nft.type}</p>
      </div>
      <div className=" w-full full flex flex-col text-white justify-between rounded-t-xl">
        <div className=" w-full h-[70%] rounded-t-xl flex justify-center items-center">
          {nft.type == "Video" ? (
            <video
              className=" rounded-t-xl h-full w-full object-fill"
              autoPlay={true}
              loop
              controls={false}
              muted
            >
              <source
                src={nft.img}
                className=" w-full h-full"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              className=" w-full h-[80%] rounded-t-xl object-cover"
              src={nft.img}
            />
          )}
        </div>
        <div className="h-[25%] flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{nft.name}</span>
            <span className="text-gray-300 text-sm">Pool: <span className="text-orange-400 font-semibold">Uniswap V3</span></span>
          </div>
          <div className=" w-full flex gap-2">
            <div className=" w-6 h-6">
              <img
                className=" h-full w-full object-cover rounded-full"
                src={"./images/CHRISTIAN.png"}
              />
            </div>
            <p>{`${nft.owner.substring(0, 6)}...${nft.owner.substring(36)}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
