import { moonbeamIndex, moonbeamPair } from "@/const/menu.const";
import { useStore } from "@/store/useStore";
import { Pair } from "@/types";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function PairCard({
  index,
  pair,
  handleSelectPair,
}: {
  index: string,
  pair: Pair;
  handleSelectPair: (item: Pair, index: string) => void;
}) {
  const { contractAddress } = useStore();
  const isMoonbeam = contractAddress === process.env.NEXT_PUBLIC_MOONBEAM_SMART_CONTRACT;
  return ( 
    <div className="w-[20vw] h-[15vh] rounded-xl border-2 border-gray-400 p-5 bg-black flex flex-col justify-center">
      <div className="flex justify-between">
        <div className="flex">
          <img
            src={pair.lend_icon}
            alt={pair.lend_token_symbol}
            className="w-10 h-10 rounded-full block"
          />
          <img
            src={pair.collateral_icon}
            alt={pair.collateral_token_symbol}
            className="w-10 h-10 rounded-full block -translate-x-3"
          />
        </div>
        <span className="text-gray-300">
          Amount: <span>{pair.lend_amount} {pair.lend_token_symbol}</span>
        </span>
      </div>
      <div className=" flex justify-between items-center gap-5">
        <span className="text-xl font-semibold text-gray-300">
          {pair.lend_token_symbol} - {pair.collateral_token_symbol}
        </span>
        <FontAwesomeIcon
          icon={faArrowRight}
          className="w-5 h-5 p-2 rounded-xl bg-orange-300 cursor-pointer hover:translate-x-3 hover:transition-transform hover:duration-200"
          onClick={() => handleSelectPair(pair, isMoonbeam ? moonbeamPair : index)}
        />
      </div>
    </div>
  );
}

export default PairCard;
