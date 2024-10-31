import { transactionHeader } from "@/const/menu.const";
import { useStore } from "@/store/useStore";
import { Transaction } from "@/types";
import React from "react";

function TransactionTable() {
  const { transactionList } = useStore();
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {transactionHeader.map((item) => (
              <th scope="col" className="px-6 py-3">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactionList.map((item: Transaction) => (
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item.hash}
              </th>
              <td className="px-6 py-4">{item.sender}</td>
              <td className="px-6 py-4">{item.receiver}</td>
              <td className="px-6 py-4">{item.symbol}</td>
              <td className="px-6 py-4">{item.amount}</td>
              <td className="px-6 py-4">{item.to_smart_contract}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
