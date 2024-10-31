"use client";
import { useEffect, useMemo, useState } from "react";
import { MainContext, SideBar } from "./components";
import ConnectButton from "@/common/connect-wallet/ConnectButton";
import FarmModal from "./components/FarmModal";
import { useStore } from "@/store/useStore";

export default function Home() {
  const [network, setNetworks] = useState<string>("Ethereum");
  const [selectedPage, setSlectedPage] = useState<string>("Home");
  const [isOpen, setOpen] = useState<boolean>(false);
  const { fetchPair, fetchPool, fetchTransaction, setContractAddress, setPairList, pairList } = useStore()

  const poolAddress = useMemo(() => {
    switch (network) {
      case "Ethereum":
        const evmAddress = process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT;
        if (evmAddress !== undefined) {
          setContractAddress(evmAddress)
          return evmAddress;
        }
      case "Moonbeam":
        const moonbeamAddress = process.env.NEXT_PUBLIC_MOONBEAM_SMART_CONTRACT
        if (moonbeamAddress !== undefined) {
          setContractAddress(moonbeamAddress)
          return moonbeamAddress;
        }
      default:
        return process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT;
    }
  }, [network]);

  useEffect(() => {
    fetchPair()
    fetchPool()
    fetchTransaction()
  }, [])
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#d9a7c7] to-[#fffcdc] shadow-inner shadow-slate-700 overflow-hidden">
      <div className="w-full h-[10%] flex justify-between items-center p-5 border-b-[1px] border-white">
        <div className="w-[60%] flex items-center gap-6">
          <img
            src="./images/IISharkBluess_logo_v2.png"
            alt="IISharkBluess_logo"
            className="w-[25%]"
          />
          <p className="text-gray-400">
            TVL{" "}
            <span className="font-semibold text-black">$207,232,094.34</span>
          </p>
          <div className="flex gap-3 items-center">
            <img
              src="./images/logo.png"
              alt="IISharkBluess_logo"
              className="w-[12%]"
            />
            <span className="font-semibold">$108.92</span>
            <button
              onClick={() => setOpen(true)}
              className="px-2 py-1 rounded-full text-[#edb45f] bg-[#fcead1] opacity-75"
            >
              Make your farm
            </button>
            {isOpen ? <FarmModal isOpen={isOpen} setOpen={setOpen} /> : null}
          </div>
        </div>
        <ConnectButton network={network} setNetwork={setNetworks} />
      </div>
      <div className="w-full h-[90%] flex">
        <SideBar selectedPage={selectedPage} setSelectedPage={setSlectedPage} />
        <MainContext selectedPage={selectedPage} />
      </div>
    </div>
  );
}
