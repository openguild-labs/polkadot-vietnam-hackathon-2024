"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateVerifyTokenPageData } from "@/lib/store/formSlice";
import { ethers } from "ethers";

function VerifyToken() {
  const router = useRouter();
  const [tokenAddress, setTokenAddress] = useState("");
  const [signedMessage, setSignedMessage] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!signedMessage) {
      const signer = provider.getSigner();
      const signature = await signer.signMessage(
        `Guarantee this is your token address: ${tokenAddress}`
      );
      setSignedMessage(true);
      console.log(signature);
    }

    dispatch(updateVerifyTokenPageData(tokenAddress));

    try {
      console.log("Token Verified");
      router.push("./addProject/generalDetail");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary overflow-hidden">
      <div className="relative p-5  rounded-lg shadow-md text-center max-w-md w-full font-sans ">
        <h2 className="text-2xl font-semibold mb-4 text-white">Add Token</h2>
        <p className="text-gray-500 mb-6">
          Paste your project's token address so we can verify that you own this
        </p>
        <input
          type="text"
          placeholder="Contract Address"
          value={tokenAddress}
          className="w-full p-3 border border-gray-300 rounded-md mb-6 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <button
          className="w-full bg-[#0047FF] py-3 shadow-lg shadow-blue-500/50 rounded-md font-semibold
         text-[#fefefe] transition duration-300 ease-in-out hover:bg-[#203e6a] hover:text-[#fefefe] hover:shadow-lg hover:shadow-blue-200"
          onClick={handleSubmit}
          disabled={signedMessage}
        >
          Verify Ownership
        </button>
      </div>
    </div>
  );
}

export default VerifyToken;
