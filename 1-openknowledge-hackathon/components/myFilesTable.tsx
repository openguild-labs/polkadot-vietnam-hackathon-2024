import { Button } from "@nextui-org/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { SuccessIcon } from "./icons";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

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

export default function MyFilesTable({ walletAddress }: any) {
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState({ file_name: "", file_uuid: "" });
  const [rows, setRows] = useState<any>([]); // [] as initial value
  const [wallet, setWallet] = useState("");
  useEffect(() => {
    setLoading(true);
    readFiles();
  }, []);

  async function handleShare() {
      setSharing(true);

      const formData = new FormData();
      formData.append("sharedBy", acc as string);
      formData.append("sharedWith", wallet);
      formData.append("fileUuid", file.file_uuid);

      try {
        const response = await fetch("/api/apillon/share", {
          method: "POST",
          body: formData,
        });
        console.log("response", response);
        if (!response.ok) {
          throw new Error("Failed to share file");
        }

        const data = await response.json();
        console.log("File share successful:", data);

        setSharing(false);
        setWallet("");
        setIsSuccess(true);
      } catch (error) {
        console.error("Error sharing file:", error);
        setSharing(false);
      }
  }

  const readFiles = async () => {
    const formData = new FormData();
    const directoryUuid = localStorage.getItem(walletAddress);
    formData.append("directoryUuid", directoryUuid as string);
    formData.append("walletAddress", "0x");

    try {
      const response = await fetch("/api/apillon/read", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("File read successfully:", data);
      const tableRows = data.data.items.map((file: any) => {
        return {
          key: file.uuid,
          name: file.name,
          uuid: file.uuid,
          date: new Date(file.createTime).toDateString(),
          actions: (
            <div className="flex gap-4">
              <Button
                onPress={() => {
                  setFile({ file_name: file.name, file_uuid: file.uuid });
                  setIsSuccess(false);
                  onOpen();
                }}
                color="primary"
              >
                Share with others{" "}
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

  
  const [acc, setAcc] = useState("");
  
  console.log(acc,"acc")

  useEffect(() => {
    const getAccounts = async () => {
      const allInjected = await web3Enable('my cool dapp');
      const allAccounts = await web3Accounts();
      setAcc(allAccounts[0].address);
    };

    getAccounts();
  }, []);


  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: any) => (
            <>
              {!isSuccess ? (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Share your file
                  </ModalHeader>
                  <ModalBody>
                    {loading ? (
                      <div className="flex flex-col items-center gap-4 justify-center">
                        <Spinner />
                        <p>Please wait...</p>
                      </div>
                    ) : (
                      <>
                        {sharing ? (
                          <div className="flex flex-col items-center gap-4 justify-center w-full my-6">
                            <Spinner size="lg" />
                            <p>Sharing...</p>
                          </div>
                        ) : (
                          <>
                            <p>
                              File : {file.file_name + `(${file.file_uuid})`}
                            </p>
                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                              <Input
                                type="text"
                                label="Wallet Address"
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                placeholder="Enter receiver's wallet address"
                                required
                              />
                            </div>
                            <Button
                              color="secondary"
                              onClick={handleShare}
                              // isDisabled={!isAddress(wallet)}
                            >
                              Share
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </ModalBody>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 w-full p-4">
                  <div>
                    <SuccessIcon />
                  </div>
                  <p>Sharing Successful.</p>
                </div>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
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
