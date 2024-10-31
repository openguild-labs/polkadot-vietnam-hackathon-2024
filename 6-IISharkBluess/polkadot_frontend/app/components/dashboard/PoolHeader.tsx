import { FarmsList } from "@/types";
import React from "react";

function PoolHeader({
  lendToken,
  collateralToken,
}: {
  lendToken: any,
  collateralToken: any,
}) {
  return (
    <div className="flex gap-5 p-5">
      <div className="flex items-center">
        <div className="flex">
          <img
            src={lendToken.icon}
            alt={lendToken.name}
            className="w-8 h-8 rounded-full block"
          />
          <img
            src={collateralToken.icon}
            alt={collateralToken.name}
            className="w-8 h-8 rounded-full block -translate-x-3"
          />
        </div>
        <span className="text-medium text-center font-semibold">
          {lendToken.name} - {collateralToken.name}
        </span>
      </div>
    </div>
  );
}

export default PoolHeader;
