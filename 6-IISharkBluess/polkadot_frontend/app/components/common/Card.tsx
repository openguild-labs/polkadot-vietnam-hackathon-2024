import { FarmsList } from "@/types";
import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Card({ item }: { item: FarmsList }) {
  const handleContextCard = useMemo(() => {
    switch (item.standard) {
      case "Most Supplied Farm":
        return (
          <div className="w-full h-full rounded-xl border-2 border-gray-400 p-2 flex flex-col gap-3 shadow-md shadow-black">
            <div className="w-[65%] px-3 py-2 gap-3 text-[#1C8AF9] bg-[#EAF4FE] rounded-full text-sm flex items-center">
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.standard}</span>
            </div>
            <div className="w-full h-[40%] flex flex-col justify-center">
              <div className="flex">
                <img
                  src={item.token1.icon}
                  alt={item.token1.name}
                  className="w-10 h-10 rounded-full block"
                />
                <img
                  src={item.token2.icon}
                  alt={item.token2.name}
                  className="w-10 h-10 rounded-full block -translate-x-3"
                />
              </div>
              <span className="text-xl font-semibold">
                {item.token1.name} - {item.token2.name}
              </span>
              <span className="text-3xl font-bold">{item.profit}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">
                Pool:{" "}
                <span className="text-black font-semibold">{item.pool}</span>
              </span>
              <span className="text-gray-400 text-sm">
                Total deposits:{" "}
                <span className="text-black font-semibold">
                  {item.totalDeposits}
                </span>
              </span>
            </div>
            <button className="w-full py-3 bg-gradient-to-b from-[#F9D660] to-[#ECAD4B] font-semibold text-xl rounded-xl shadow-inner shadow-white">
              Earn
            </button>
          </div>
        );
        break;
      case "Highest APY":
        return (
          <div className="w-full h-full rounded-xl border-2 border-gray-400 p-2 flex flex-col gap-3 shadow-md shadow-black">
            <div className="w-[50%] px-3 py-2 gap-3 text-[#4B9E8D] bg-[#EBF5F3] rounded-full text-sm flex items-center">
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.standard}</span>
            </div>
            <div className="w-full h-[40%] flex flex-col justify-center">
              <div className="flex">
                <img
                  src={item.token1.icon}
                  alt={item.token1.name}
                  className="w-10 h-10 rounded-full block"
                />
                <img
                  src={item.token2.icon}
                  alt={item.token2.name}
                  className="w-10 h-10 rounded-full block -translate-x-3"
                />
              </div>
              <span className="text-xl font-semibold">
                {item.token1.name} - {item.token2.name}
              </span>
              <span className="text-3xl font-bold">{item.profit}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">
                Pool:{" "}
                <span className="text-black font-semibold">{item.pool}</span>
              </span>
              <span className="text-gray-400 text-sm">
                Total deposits:{" "}
                <span className="text-black font-semibold">
                  {item.totalDeposits}
                </span>
              </span>
            </div>
            <button className="w-full py-3 bg-gradient-to-b from-[#F9D660] to-[#ECAD4B] font-semibold text-xl rounded-xl shadow-inner shadow-white">
              Earn
            </button>
          </div>
        );
        break;
      case "Lastest Farm":
        return (
          <div className="w-full h-full rounded-xl border-2 border-gray-400 p-2 flex flex-col gap-3 shadow-md shadow-black">
            <div className="w-[50%] px-3 py-2 gap-3 text-[#EDAE51] bg-[#FDF7EE] rounded-full text-sm flex items-center">
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.standard}</span>
            </div>
            <div className="w-full h-[40%] flex flex-col justify-center">
              <div className="flex">
                <img
                  src={item.token1.icon}
                  alt={item.token1.name}
                  className="w-10 h-10 rounded-full block"
                />
                <img
                  src={item.token2.icon}
                  alt={item.token2.name}
                  className="w-10 h-10 rounded-full block -translate-x-3"
                />
              </div>
              <span className="text-xl font-semibold">
                {item.token1.name} - {item.token2.name}
              </span>
              <span className="text-3xl font-bold">{item.profit}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">
                Pool:{" "}
                <span className="text-black font-semibold">{item.pool}</span>
              </span>
              <span className="text-gray-400 text-sm">
                Total deposits:{" "}
                <span className="text-black font-semibold">
                  {item.totalDeposits}
                </span>
              </span>
            </div>
            <button className="w-full py-3 bg-gradient-to-b from-[#F9D660] to-[#ECAD4B] font-semibold text-xl rounded-xl shadow-inner shadow-white">
              Earn
            </button>
          </div>
        );
        break;
      case "Colaboration":
        return (
          <div className="w-full h-full rounded-xl border-2 border-gray-400 p-2 flex flex-col gap-3 shadow-md shadow-black">
            <div className="w-[50%] px-3 py-2 gap-3 text-[#AA63C5] bg-[#F3E8F7] rounded-full text-sm flex items-center">
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.standard}</span>
            </div>
            <div className="w-full h-[40%] flex flex-col justify-center">
              <div className="flex">
                <img
                  src={item.token1.icon}
                  alt={item.token1.name}
                  className="w-10 h-10 rounded-full block"
                />
                <img
                  src={item.token2.icon}
                  alt={item.token2.name}
                  className="w-10 h-10 rounded-full block -translate-x-3"
                />
              </div>
              <span className="text-xl font-semibold">
                {item.token1.name} - {item.token2.name}
              </span>
              <span className="text-3xl font-bold">{item.profit}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">
                Pool:{" "}
                <span className="text-black font-semibold">{item.pool}</span>
              </span>
              <span className="text-gray-400 text-sm">
                Total deposits:{" "}
                <span className="text-black font-semibold">
                  {item.totalDeposits}
                </span>
              </span>
            </div>
            <button className="w-full py-3 bg-gradient-to-b from-[#F9D660] to-[#ECAD4B] font-semibold text-xl rounded-xl shadow-inner shadow-white">
              Earn
            </button>
          </div>
        );
        break;
      default:
        break;
    }
  }, [item]);
  return handleContextCard;
}

export default Card;