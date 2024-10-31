import updatePriceFeeds, { fetchEthPrice } from "@/common/pyth/pyth";
import { chainList } from "@/const";
import { useStore } from "@/store/useStore";
import { Pair } from "@/types";
import React, { useMemo, useState } from "react";

function TokenMenu({
  selectedToken,
  tokenType,
  setPrice,
  price,
  labelToken,
}: {
  selectedToken: Pair;
  tokenType: string;
  setPrice: any;
  price: number;
  labelToken: string;
}) {
  const [symbol, setSymbol] = useState("");
  const [icon, setIcon] = useState("");

  const { contractAddress } = useStore();
  const isMoonbeam = contractAddress === process.env.NEXT_PUBLIC_MOONBEAM_SMART_CONTRACT;
  const token = useMemo(async () => {
    if (isMoonbeam) {
      setPrice(1.0);
    } else {
      const token_price = await updatePriceFeeds(labelToken);
      setPrice(token_price);
    }
    if (tokenType == "LendToken") {
      setIcon(selectedToken.lend_icon);
      setSymbol(selectedToken.lend_token_symbol);
    } else {
      setIcon(selectedToken.collateral_icon);
      setSymbol(selectedToken.collateral_token_symbol);
    }
  }, [tokenType]);
  return (
    <div className="relative w-full">
      <span className="border border-solid border-gray-300 rounded-lg p-4 h-full w-full bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 shadow-md flex items-center">
        <React.Fragment>
          <img src={icon} alt={symbol} className="mr-2 w-6 h-6" />
          {symbol} : {price.toFixed(3)}
        </React.Fragment>
      </span>
    </div>
  );
}

export default TokenMenu;
