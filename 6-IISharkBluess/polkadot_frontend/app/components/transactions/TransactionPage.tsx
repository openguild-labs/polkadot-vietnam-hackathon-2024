import React from "react";
import Pagination from "../common/Pagination";
import TransactionTable from "./transactionTable";

function TransactionPage() {
  return (
    <div className="w-full h-full p-5 flex flex-col items-end gap-5">
      <div className="w-full h-[95%]">
        <TransactionTable/>
      </div>
      <Pagination />
    </div>
  );
}

export default TransactionPage;
