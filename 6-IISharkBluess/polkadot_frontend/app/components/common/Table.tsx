import { pool_abis } from "@/common/abi/pool_abi";
import { token_abis } from "@/common/abi/token_abi";
import { readContractTemplalte } from "@/common/blockchain/ethereum/eth_template";
import { body, header } from "@/const";
import { headerLendPool, moonbeamIndex } from "@/const/menu.const";
import { standard_uint } from "@/const/pool.const";
import { DialogStyle } from "@/public/styles/styles";
import { useStore } from "@/store/useStore";
import { Pair, Pool } from "@/types";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { sepolia } from "viem/chains";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

function LendAmountData({ index, pairList }: { index: any, pairList: Pair[] }) {
  return (
    <td className="px-6 py-4">
      {pairList[index] !== undefined ? Number(pairList[index].lend_amount) : ""}
    </td>
  );
}

function PoolPair({ index, pairList }: { index: any, pairList: Pair[] }) {
  return (
    <div className="flex justify-center items-center">
      {pairList[index] !== undefined ? (
        <React.Fragment>
          <img
            src={pairList[index].lend_icon}
            alt={pairList[index].lend_token_symbol}
            className="w-6 h-6 rounded-full block"
          />
          <img
            src={pairList[index].collateral_icon}
            alt={pairList[index].collateral_token_symbol}
            className="w-6 h-6 rounded-full block -translate-x-3"
          />
        </React.Fragment>
      ) : null}
    </div>
  );
}

function Table({ poolLists, role }: { poolLists: any; role: string }) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { contractAddress, poolList } = useStore();
  const { pairList } = useStore();
  const pairs = [pairList[1], pairList[5], pairList[4], pairList[0], pairList[2], pairList[3]];
  const [profit, setProfit] = useState<number>(0);
  const [isOpen, setOpen] = useState<boolean>(false);
  const isMoonbeam =
    contractAddress === process.env.NEXT_PUBLIC_MOONBEAM_SMART_CONTRACT;

  const handleWithdraw = async (pool: any, index: number) => {
    if (address !== undefined) {
      const id = isMoonbeam ? moonbeamIndex : pool.pairId;
      const execute = await writeContractAsync({
        abi: pool_abis,
        address: `0x${contractAddress}`,
        functionName: "withdraw",
        args: [
          `0x${pairs[id].lend_token.substring(2)}`,
          BigInt(pairs[id].lend_amount * 10 ** standard_uint),
        ],
      });
    } else {
      alert("Please log in Metamask");
    }
  };

  const handleBorrow = async (pool: any, index: number) => {
    if (address !== undefined) {
      const id = isMoonbeam ? moonbeamIndex : pool.pairId;
      const execute = await writeContractAsync({
        abi: pool_abis,
        address: `0x${contractAddress}`,
        functionName: "borrow",
        args: [index, pool.collateral_amount],
      });

      const approve = await writeContractAsync({
        abi: token_abis,
        address: `0x${pairs[id].collateral_token.substring(2)}`,
        functionName: "approve",
        args: [`0x${contractAddress}`, pool.collateral_amount],
      });

      const lenderDeposite = await writeContractAsync({
        abi: pool_abis,
        address: `0x${contractAddress}`,
        functionName: "deposite",
        args: [
          `0x${pool.lender.substring(2)}`,
          `0x${pairs[id].lend_token.substring(2)}`,
          BigInt(pairs[id].lend_amount * 10 ** standard_uint),
        ],
      });

      const borrowerDeposite = await writeContractAsync({
        abi: pool_abis,
        address: `0x${contractAddress}`,
        functionName: "deposite",
        args: [
          `0x${address.substring(2)}`,
          `0x${pairs[id].collateral_token.substring(2)}`,
          pool.collateral_amount,
        ],
      });
    } else {
      alert("Please log in Metamask");
    }
  };

  const handleRepay = async (pool: any, index: number) => {
    if (address !== undefined) {
      const execute = await writeContractAsync({
        abi: pool_abis,
        address: `0x${contractAddress}`,
        functionName: "repay",
        args: [index],
      });
    } else {
      alert("Please log in Metamask");
    }
  };

  const handleEdit = async (pool: any, index: number) => {
    if (address !== undefined) {
      const execute = await writeContractAsync({
        abi: pool_abis,
        address: `0x${contractAddress}`,
        functionName: "editPool",
        args: [index],
      });
    } else {
      alert("Please log in Metamask");
    }
  };

  const handleCancelPool = async (pool: any, index: number) => {
    if (address !== undefined) {
      const execute = await writeContractAsync({
        abi: pool_abis,
        address: `0x${contractAddress}`,
        functionName: "cancelPool",
        args: [index],
      });
    } else {
      alert("Please log in Metamask");
    }
  };
  const poolTable = useMemo(() => {
    switch (role) {
      case "LendPool":
        if (poolLists !== undefined) {
          return poolLists.map((item: any, index: number) => (
            <React.Fragment>
              {!item.isDeleted ? (
                <React.Fragment>
                  <tr
                    className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 ${
                      item.lender === address ? " visible" : "hidden"
                    }`}
                  >
                    <th className="flex justify-center items-center px-3 pt-5">
                      <PoolPair index={isMoonbeam ? moonbeamIndex : item.pairId} pairList={pairs} />
                    </th>
                    <td className="px-6 py-4">
                      {item.borrower === process.env.NEXT_PUBLIC_ZERO_ADDRESS
                        ? "Waiting borrower"
                        : item.borrower}
                    </td>
                    <LendAmountData index={isMoonbeam ? moonbeamIndex : item.pairId} pairList={pairs} />
                    <td className="px-6 py-4">{Number(item.profit)}</td>
                    <td className="px-6 py-4">
                      {Number(item.expire) / 60} Minutes
                    </td>
                    <td className="px-6 py-4">
                      {item.borrower ===
                      process.env.NEXT_PUBLIC_ZERO_ADDRESS ? (
                        <div className="flex gap-2">
                          <button
                            className="py-[2px] px-1 bg-gradient-to-b from-[#9067e1] to-[#7f7fec] font-semibold rounded-md shadow-inner shadow-white"
                            onClick={() => setOpen(true)}
                          >
                            Edit
                          </button>
                          <button
                            className="py-[2px] px-1 bg-gradient-to-b from-[#ec828d] to-[#c75161] font-semibold rounded-md shadow-inner shadow-white"
                            onClick={() => handleCancelPool(item, index)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="py-[2px] px-1 bg-gradient-to-b from-[#82ecaf] to-[#42eb66] font-semibold rounded-md shadow-inner shadow-white"
                          onClick={() => handleWithdraw(item, index)}
                        >
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                  <Modal
                    open={isOpen}
                    onClose={setOpen}
                    className="w-[100vw] h-[100vh] opacity-80"
                  >
                    <Box sx={DialogStyle}>
                      <Box
                        sx={{
                          width: "100%",
                          height: "10%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="text-end w-full text-red-500 font-semibold text-xl cursor-pointer"
                          onClick={() => setOpen(false)}
                        >
                          X
                        </span>
                        <Typography
                          id="modal-modal-description"
                          sx={{ pb: 1, mr: 1 }}
                        >
                          Select new interest rate:
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          label={`Current interest rate: ${item.profit}`}
                          variant="outlined"
                          onChange={(item) =>
                            setProfit(Number(item.target.value))
                          }
                          size="small"
                          required
                        />
                      </Box>
                      <Button onClick={() => handleEdit(item, index)}>
                        Confirm changes
                      </Button>
                    </Box>
                  </Modal>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ));
        }
      case "BorrowPool":
        if (poolLists !== undefined) {
          return poolLists.map((item: any, index: number) => (
            <tr
              className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 ${
                item.borrower === address ? "visible" : "hidden"
              }`}
            >
              <th className="flex justify-center items-center px-3 py-4">
                <PoolPair index={isMoonbeam ? moonbeamIndex : item.pairId} pairList={pairs} />
              </th>
              <td className="px-6 py-4">{item.borrower}</td>
              <LendAmountData index={isMoonbeam ? moonbeamIndex : item.pairId} pairList={pairs}/>
              <td className="px-6 py-4">{Number(item.profit)}</td>
              <td className="px-6 py-4">{Number(item.expire) / 60} Minutes</td>
              <td className="px-6 py-4">
                <button
                  className="py-[2px] px-1 bg-gradient-to-b from-[#fba869] to-[#df7d43] font-semibold rounded-md shadow-inner shadow-white"
                  onClick={() => handleRepay(item, index)}
                >
                  Repay
                </button>
              </td>
            </tr>
          ));
        }
      case "EarnPool":
        if (poolLists !== undefined) {
          return poolLists.map((item: any, index: number) => (
            <tr
              className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 ${
                item.lender !== address && item.borrower !== address
                  ? " visible"
                  : " hidden"
              }`}
            >
              <th className="flex justify-center items-center px-3 py-4">
                <PoolPair index={isMoonbeam ? moonbeamIndex : item.pairId} pairList={pairs} />
              </th>
              <td className="px-6 py-4">{item.lender}</td>
              <LendAmountData index={isMoonbeam ? moonbeamIndex : item.pairId} pairList={pairs}/>
              <td className="px-6 py-4">{Number(item.profit)}</td>
              <td className="px-6 py-4">{Number(item.expire) / 60} Minutes</td>
              <td className="px-6 py-4">
                <button
                  className="py-[2px] px-1 bg-gradient-to-b from-[#F9D660] to-[#ECAD4B] font-semibold rounded-md shadow-inner shadow-white"
                  onClick={() => handleBorrow(item, index)}
                >
                  Earn
                </button>
              </td>
            </tr>
          ));
        }
      default:
        break;
    }
  }, [address]);

  const headerList = useMemo(() => {
    switch (role) {
      case "LendPool":
        return headerLendPool;
      case "BorrowPool":
        return header;
      default:
        return header;
    }
  }, [role]);

  return (
    <div className="relative h-full overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headerList.map((item) => (
              <th scope="col" className="px-6 py-3">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="h-full overflow-y-auto">{poolTable}</tbody>
      </table>
    </div>
  );
}

export default Table;
