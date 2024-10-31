// import { chainList } from "@/const";
// import React, { useMemo, useState } from "react";
// import PoolHeader from "./PoolHeader";
// import EditBoard from "./EditBoard";

// function Pool({ pool, index }: { pool: any, index: string }) {
//   const [isOpen, setOpen] = useState<boolean>(false);
//   const { lendToken, collateralToken, lendObject, collateralObject } = useMemo(() => {
//     const _index = Number(index)
//     const filteredLendToken = chainList.filter(
//       (item) => `0x${item.address}` === pool[_index].lend_token
//     );
//     const filteredCollateralToken = chainList.filter(
//       (item) => `0x${item.address}` === pool[_index].collateral_token
//     );
    
//     const lendProps = {
//       name: filteredLendToken[0].name,
//       icon: filteredLendToken[0].icon,
//       decimals: filteredLendToken[0].decimals,
//     };
//     const collateralProps = {
//       name: filteredCollateralToken[0].name,
//       icon: filteredCollateralToken[0].icon,
//       decimals: filteredCollateralToken[0].decimals,
//     };
//     return { lendToken: lendProps, collateralToken: collateralProps, lendObject: filteredLendToken[0], collateralObject: filteredCollateralToken[0]};
//   }, [pool]);
//   return (
//     <div className="w-full h-[25%] flex gap-3 p-3 rounded-xl items-center justify-between bg-[#F6F6F6]">
//       <PoolHeader lendToken={lendToken} collateralToken={collateralToken} />
//       <div className="w-full grid grid-flow-col grid-cols-4 items-center gap-5">
//         <span>
//           Pool <br /> <span className="font-semibold">{pool[index].name}</span>
//         </span>
//         <span>
//           Lend amount <br />
//           <span className="font-semibold">
//             {(Number(pool[index].lend_amount) / 10 ** lendToken.decimals).toFixed(
//               2
//             )}
//           </span>
//         </span>
//         <span>
//           Collateral amount <br />
//           <span className="font-semibold">
//             {(
//               Number(pool[index].collateral_amount) /
//               10 ** collateralToken.decimals
//             ).toFixed(2)}
//           </span>
//         </span>
//         <span>
//           Profit <br /> <span className="font-semibold">{pool[index].profit}%</span>
//         </span>
//       </div>
//       <button className="p-2 rounded-xl bg-blue-500 text-white font-semibold" onClick={() => setOpen(true)}>
//         Edit
//       </button>
//       {isOpen ? (
//         <EditBoard isOpen={isOpen} setOpen={setOpen} pool={pool[index]} index={Number(index)} lendObject={lendObject} collateralObject={collateralObject}></EditBoard>
//       ) : null}
//     </div>
//   );
// }

// export default Pool;
