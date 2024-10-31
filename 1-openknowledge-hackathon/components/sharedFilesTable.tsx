import { Button } from "@nextui-org/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { useEffect, useState } from "react";

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "uuid",
    label: "UUID",
  },
  {
    key: "date",
    label: "Date",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export default function SharedFilesTable() {

  
  const [acc, setAcc] = useState("");
  console.log(acc,"acc")

  useEffect(() => {
    const getAccounts = async () => {
      const allInjected = await web3Enable('filesharing dapp');
      const allAccounts = await web3Accounts();
      setAcc(allAccounts[0].address);
    };

    getAccounts();
  }, []);


  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>([]); // [] as initial value
  useEffect(() => {
    setLoading(true);
    readSharedFiles();
  }, []);

  const readSharedFiles = async () => {
    const formData = new FormData();
    formData.append("walletAddress", acc as string);

    try {
      const response = await fetch("/api/apillon/read/shared-files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to read shared file");
      }

      const data = await response.json();

      const tableRows = data.data.items.map((file: any) => {
        return {
          key: file.uuid,
          name: file.name,
          uuid: file.uuid,
          date: new Date(file.createTime).toDateString(),
          actions: (
            <div className="flex gap-4">
              <Button onClick={() => window.open(file.link, "_blank")}>
                View{" "}
              </Button>
            </div>
          ),
        };
      });
      setRows(tableRows);
      setLoading(false);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center w-full mt-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table aria-label="my files table">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.key}>
                {(columnKey: any) => (
                  <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
