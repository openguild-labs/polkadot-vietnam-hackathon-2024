import { DropDown } from "@/app/components";
import React, { useEffect } from "react";
import ConnectMetamask from "./ConnectMetamask";
import { useDisconnect } from "wagmi";

function ConnectButton({
  network,
  setNetwork,
}: {
  network: string;
  setNetwork: any;
}) {
  const { disconnect } = useDisconnect();
  useEffect(() => {
    disconnect();
  }, [network])
  return (
    <div className="w-[25%] flex gap-3 items-center justify-end">
      <DropDown setNetwork={setNetwork} network={network} />
      <ConnectMetamask network={network}/>
    </div>
  );
}

export default ConnectButton;
