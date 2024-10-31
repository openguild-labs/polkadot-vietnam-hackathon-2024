"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import MyFilesTable from "@/components/myFilesTable";
import SharedFilesTable from "@/components/sharedFilesTable";
import DragAndDrop from "@/components/dragAndDrop";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

export default function DashboardPage() {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [uploading, setUploading] = useState(false);

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
              <ModalHeader className="flex flex-col gap-1">
                Upload your file
              </ModalHeader>
              <ModalBody>
                {uploading ? (
                  <div className="flex flex-col items-center gap-4 justify-center">
                    <Spinner />
                    <p>Uploading file...</p>
                  </div>
                ) : (
                  <>
                    <p>Please select your file to upload.</p>
                    <DragAndDrop
                      walletAddress={acc as string}
                      setUploading={setUploading}
                    />
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="flex justify-end px-8">
        <Button color="primary" onPress={onOpen}>
          + Upload File
        </Button>
      </div>

      <div className="flex w-full flex-col justify-end">
        <Tabs aria-label="Options">
          <Tab key="my_files" title="My Files">
            <MyFilesTable walletAddress={acc as string} />
          </Tab>
          <Tab key="shared_with_me" title="Shared with me">
            <SharedFilesTable />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
