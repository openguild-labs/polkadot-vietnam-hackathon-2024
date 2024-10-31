"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NFTModel(props) {
  const [nft] = useState(props.nfts);
  const tokenUrl = `https://uniquescan.io/opal/tokens/${nft.collectionId}/${nft.tokenId}`;
  return (
    <div
      className={` ${
        nft.image == undefined ? "w-[55%]" : "w-[25%]"
      } shadow-inner shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative`}
    >
      {/* NFT Type */}
      <div className="w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
        <p>{nft.properties.find((prop) => prop.key === "Type")?.value || "Unknown"}</p>
      </div>

      {/* NFT Image or Video */}
      <div
        className={` ${nft.image == undefined ? "px-0 w-[70%]" : "w-full"} ${
          props.isSell === false ? "h-[60vh] gap-2" : "h-[65vh]"
        } px-5 py-2 flex flex-col text-white rounded-t-xl`}
      >
        <div className="w-full h-[65%] rounded-t-xl flex justify-center items-center">
          {nft.properties.find((prop) => prop.key === "Type")?.value === "Video" ? (
            <video
              className="rounded-t-xl h-full w-full object-fill"
              autoPlay
              loop
              controls={false}
              muted
            >
              <source src={nft.image} type="video/mp4" />
            </video>
          ) : (
            <img
              className="w-full h-full py-1 rounded-t-xl object-cover"
              src={nft.image || "../../images/no_image_available.png"}
              alt={nft.name}
            />
          )}
        </div>

        {/* NFT Name */}
        <p className="text-xl font-bold text-center mt-2">{nft.name || "Unnamed"}</p>

        {/* NFT Description */}
        <p className="text-gray-400 text-sm text-center mb-2">
          {nft.properties.find((prop) => prop.key === "Description")?.value || "No description available"}
        </p>

        {/* NFT Owner */}
        <div className="w-full flex gap-2 items-center justify-center mb-2">
          <div className="w-6 h-6">
            <img
              className="h-full w-full object-cover rounded-full"
              src={"../../images/bannerIMG/avartar.jpg"}
              alt="Owner Avatar"
            />
          </div>
          <p className="text-sm">
            {`${nft.owner.substring(0, 6)}...${nft.owner.substring(nft.owner.length - 4)}`}
          </p>
        </div>

        {/* Link to NFT Details */}
        <Link
          href={tokenUrl}
          target="_blank"
          className="p-1 bg-[#593F9F] text-center rounded-tr-xl rounded-bl-xl text-sm font-semibold hover:bg-[#452a7a] transition"
        >
          See Detail &#8594;
        </Link>
      </div>

      {/* Toast Notification */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

export default NFTModel;
