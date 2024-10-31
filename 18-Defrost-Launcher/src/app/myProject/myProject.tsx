"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import axios from "axios";
import {
  useAddress,
  useChain,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { DBProject } from "@/interfaces/interface";
import { ProjectStatus } from "@/interfaces/interface";
import { format } from "date-fns";
import { ethers } from "ethers";
import { chainConfig } from "@/config";
import { IERC20ABI, ProjectPoolABI, ProjectPoolFactoryABI } from "@/abi";

function MyProjectPage() {
  const [showMoreEnded, setShowMoreEnded] = useState<boolean>(false);
  const [showMorePending, setShowMorePending] = useState<boolean>(false);
  const [endedProjects, setEndedProjects] = useState<DBProject[]>([]);
  const [pendingProjects, setPendingProjects] = useState<DBProject[]>([]);
  const [factoryContract, setFactoryContract] = useState<ethers.Contract>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isCallingContract, setIsCallingContract] = useState<boolean>(false);
  const [txSuccessToastVisible, setTxSuccessToastVisible] =
    useState<boolean>(false);
  const [txErrorToastVisible, setTxErrorToastVisible] =
    useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [withdrawType, setWithdrawType] = useState<1 | 2>(1);
  const [withdrawProject, setWithdrawProject] = useState<DBProject | undefined>(
    undefined
  );
  const projectOwnerAddress = useAddress();
  const chain = useChain();
  const userAddress = useAddress();

  /**
   * @dev these states are for TopUpModal
   */
  const showTxSuccessToast = async (duration?: number) => {
    setTxSuccessToastVisible(true);
    await new Promise((resolve) =>
      setTimeout(resolve, !!duration ? duration : 2500)
    );
    setTxSuccessToastVisible(false);
  };

  const showAlertWithText = (text: string) => {
    setAlertText(text);
    (document.getElementById("alertDialog") as HTMLDialogElement).showModal();
  };

  const showTxErrorToast = async (duration?: number) => {
    setTxErrorToastVisible(true);
    await new Promise((resolve) =>
      setTimeout(resolve, !!duration ? duration : 2500)
    );
    setTxErrorToastVisible(false);
  };

  // debug-only
  useEffect(() => {
    console.log(`Project owner address is: ${projectOwnerAddress}`);
    console.log(`User address is: ${userAddress}`);
  }, [projectOwnerAddress, userAddress]);

  useEffect(() => {
    if (!chain) {
      console.log(`chain is ${chain}`);
      return;
    }

    console.log(`chain is ${chain}`);

    const address: string =
      chainConfig[chain.chainId.toString() as keyof typeof chainConfig]
        ?.contracts?.ProjectPoolFactory?.address;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(
      address,
      ProjectPoolFactoryABI,
      provider
    );
    setFactoryContract(factoryContract);
  }, [chain]);

  useEffect(() => {
    console.log(`factory contract is ${factoryContract}`);
    if (!factoryContract) {
      console.log(`nevermind, factory contract is not ready`);
      return;
    }
    console.log(`project owner address is ${projectOwnerAddress}`);
    if (!projectOwnerAddress) {
      return;
    }

    const fetchProjects = async () => {
      if (!window.ethereum) {
        console.log(`User hasn't connected their wallet`);
        return;
      }

      try {
        setIsFetching(true);
        const response = await axios.post("/api/myProject", {
          projectOwnerAddress,
        });
        const projects: DBProject[] = response.data.projectsInfo;
        console.log(projects);

        // Dùng for...of để xử lý tuần tự
        console.log("projects len:" + projects.length);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        for (const project of projects) {
          console.trace(`fetching info for project ${project.projectID}`);
          console.log(`projectID here is fine: ${project.projectID}`);
          console.log(`factory address is : ${factoryContract.address}`);
          console.log(`current chain id is: ${chain?.chainId}`);
          const currentProjectId = await factoryContract.getCurrentProjectId();
          console.log(`currentProjectId is: ${currentProjectId}`);
          const poolAddress = await factoryContract!.getProjectPoolAddress(
            project.projectID
          );
          console.trace(`pool address of project is: ${poolAddress}`);
          const contract = new ethers.Contract(
            poolAddress,
            ProjectPoolABI,
            provider
          );
          console.trace("initialized pool contract object");
          const raisedAmount = await contract.getProjectRaisedAmount();
          console.trace(`got project raised amount: ${raisedAmount}`);
          const isProjectSoftCapReached =
            await contract.getProjectSoftCapReached();
          console.trace(
            `has project reached softcap?: ${isProjectSoftCapReached}`
          );
          const isProjectFullyToppedUp =
            await contract.isProjectFullyToppedUp();
          console.trace(
            `has project been fully topped up: ${isProjectFullyToppedUp}`
          );
          project.raisedAmount = raisedAmount;
          project.isProjectSoftcapReached = isProjectSoftCapReached;
          project.isProjectFullyToppedUp = isProjectFullyToppedUp;
        }

        const ended = projects.filter(
          (project: DBProject) => project.status === "ended"
        );
        const pending = projects.filter(
          (project: DBProject) => project.status === "pending"
        );
        console.debug(`ended project len: ${ended.length}`);
        console.debug(`pending project len: ${pending.length}`);
        console.debug(`project len: ${projects.length}`);

        setEndedProjects(ended);
        setPendingProjects(pending);
        setIsFetching(false);
        console.debug(`endedProjects is: ${endedProjects}`);
        console.debug(`pendingProjects is: ${pendingProjects}`);
        console.trace("setEndedProjects() and setPendingProjects()");
      } catch (error) {
        console.error("Error fetching projects:\n", error);
      }
    };

    fetchProjects();
  }, [projectOwnerAddress, factoryContract]);

  const handleTopUp = async (e: any, project: DBProject) => {
    e.preventDefault();

    setIsCallingContract(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const poolAddr = await factoryContract!.getProjectPoolAddress(
      project.projectID
    );
    const poolContract = new ethers.Contract(
      poolAddr,
      ProjectPoolABI,
      provider
    );
    console.trace(`got poolAddr: ${poolAddr}`);

    const projectTokenAddr = await poolContract.getProjectTokenAddress();
    const topUpAmount = await poolContract.getAmountToTopUp();
    console.trace(`got top up amount from contract: ${topUpAmount}`);

    const signer = provider.getSigner();
    console.trace(
      `metamask provided signer with address ${await signer.getAddress()}`
    );
    const projectTokenContract = new ethers.Contract(
      projectTokenAddr,
      IERC20ABI,
      signer
    );
    console.trace("init projectTokenContract obj");

    try {
      const txRec = await projectTokenContract.transfer(
        poolAddr,
        BigInt(topUpAmount)
      );
      console.trace(`ERC20 transfer() finished with receipt: ${txRec}`);

      await showTxSuccessToast();

      let updatedProject = pendingProjects.find(
        (p) => p.projectID === project.projectID
      );
      updatedProject!.isProjectFullyToppedUp = true;
    } catch (err) {
      showTxErrorToast();
      console.error(`error when calling ERC20.transfer():\n${err}`);
    } finally {
      setIsCallingContract(false);
    }
  };

  const handleRefund = async (e: any, project: DBProject) => {
    showAlertWithText("Coming soon!");
  };

  const makeWithdrawTransaction = async (e?: any) => {
    e.preventDefault();

    if (!withdrawProject) {
      console.trace(`withdrawProject is empty`);
    }

    console.trace(
      `Boutta make withdraw tx. project ID is: ${withdrawProject?.projectID}`
    );
    setIsCallingContract(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.trace(
      `metamask provided signer with address ${await signer.getAddress()}`
    );
    console.trace(`projectID is ${withdrawProject?.projectID}`);
    const poolAddr = await factoryContract!.getProjectPoolAddress(
      withdrawProject?.projectID
    );
    console.trace(`got poolAddr: ${poolAddr}`);
    const poolContract = new ethers.Contract(poolAddr, ProjectPoolABI, signer);
    console.trace("connected to to poolContract");

    if (withdrawType === 1) {
      try {
        console.trace("calling withdrawFund()");
        const resp = await poolContract.withdrawFund();
        console.trace(
          `contract call withdrawFund() succeed! here is the tx resp:\n${resp}`
        );
        const response = await fetch("/api/myProject/withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId: withdrawProject!.projectID }),
        });
        if (response.ok) {
          showTxSuccessToast();
        } else {
          throw new Error(
            `fetching api /api/myProject/withdraw returned an error response:\n${response}`
          );
        }
      } catch (err) {
        console.error(`Error when sending withdrawFund() tx:\n${err}`);
        showTxErrorToast();
      }
    } else if (withdrawType === 2) {
      console.trace("calling slpxWithdrawFund()");
      showAlertWithText("Coming soon!");
      return;
    }

    setIsCallingContract(false);
    (document.getElementById("withdrawDialog") as HTMLDialogElement).close();
  };

  const handleWithdraw = async (e: any, project: DBProject) => {
    e?.preventDefault();
    (
      document.getElementById("withdrawDialog") as HTMLDialogElement
    ).showModal();
    setWithdrawProject(project);
    console.trace(`setWithdrawProject to ${project}`);
  };

  const displayedEndedProjects = showMoreEnded
    ? endedProjects
    : endedProjects.slice(0, 3);
  const displayedPendingProjects = showMorePending
    ? pendingProjects
    : pendingProjects.slice(0, 3);

  return (
    <div className="relative flex flex-col justify-start items-start min-h-screen bg-primary px-14">
      {/* this modal is hidden unless we call modal.showModal() */}
      <dialog id="alertDialog" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-primary text-primary-content">
          <h3 className="font-bold text-lg">Alert</h3>
          <p id="alertText" className="py-4">
            {alertText}
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn hover:text-black">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Withdraw dialog (hidden by default) */}
      <dialog
        id="withdrawDialog"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-primary text-primary-content">
          <h3 className="font-bold text-lg">Choose withdraw token</h3>
          {/* <p id="" className="py-4">{alertText}</p> */}
          <div className="flex w-full mt-10 mb-10 p-4">
            <div
              className={`card bg-secondary rounded-box grid h-20 flex-grow place-items-center backdrop-blur-sm
              hover:cursor-pointer select-none
              shadow-lg ${withdrawType == 1
                  ? "font-bold brightness-100 border-dashed border-t-4 border-indigo-500"
                  : "brightness-75"
                }`}
              onClick={() => setWithdrawType(1)}
            >
              <img
                src="https://www.stakingrewards.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstakingrewards-static%2Fimages%2Fassets%2Fproduction%2Fbifrost-voucher-astr_logo.png%3Fv%3D1717150606436&w=3840&q=75"
                width={24}
                height={24}
              ></img>
              Voucher asset
            </div>
            <div className="divider divider-horizontal">OR</div>
            <div
              className={`card bg-secondary rounded-box grid h-20 flex-grow  backdrop-blur-sm 
            hover:cursor-pointer select-none
            shadow-lg place-items-center ${withdrawType == 2
                  ? "font-bold brightess-100 border-dashed border-t-4 border-indigo-500"
                  : "brightness-75"
                }`}
              onClick={() => setWithdrawType(2)}
            >
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/200x200/12885.png"
                width={24}
                height={24}
              ></img>
              Normal asset
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog" className="gap-x-3">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost ml-4 my-auto">Close</button>
              <button
                className="btn btn-outline hover:text-black btn-success mx-auto my-auto"
                onClick={(e) => makeWithdrawTransaction(e)}
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="mt-20 mb-6 text-2xl font-bold text-white">
        Ended Project{" "}
        {isFetching ? (
          <span className="loading loading-spinner display-block ml-3 loading-xs text-white mx-auto my-auto"></span>
        ) : (
          ""
        )}
      </div>
      {displayedEndedProjects.map((project) => (
        <div
          key={project.id}
          className="w-full bg-secondary rounded-lg shadow-lg p-4 text-white flex items-center mt-5"
        >
          <div className="flex items-center flex-grow space-x-4 p-3">
            <div className="w-14 h-14 rounded-full overflow-hidden mr-5">
              <img
                src={project.projectLogoImageUrl[0]}
                alt={project.projectTitle}
                width={52}
                height={52}
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="w-48">
              <h3 className="text-xl font-bold">{project.projectTitle}</h3>
              <p className="text-sm">{project.shortDescription}</p>
            </div>

            <div className="flex space-x-20 p-5">
              <div className="text-center">
                <p className="font-semibold">End Date</p>
                <p>
                  {format(new Date(project.endDate), "dd/MM/yyyy HH:mm:ss")}
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Start Date</p>
                <p>
                  {format(new Date(project.startDate), "dd/MM/yyyy HH:mm:ss")}
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Raised amount</p>
                <p>{project.raisedAmount!.toString()}</p>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            {project.isProjectSoftcapReached === true ? (
              <button
                className="mr-4 rounded-lg btn btn-success"
                onClick={(e) => handleWithdraw(e, project)}
                disabled={project.isWithdrawn === true}
              >
                Withdraw fund
              </button>
            ) : (
              <button
                className="mr-4 rounded-lg btn btn-ghost"
                onClick={(e) => handleRefund(e, project)}
                disabled={project.isWithdrawn === true}
              >
                Refund
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="mt-4 flex justify-center w-full">
        {!showMoreEnded ? (
          <Button
            className="bg-neutral text-white px-4 py-2 rounded-full transition duration-300 hover:shadow-lg hover:bg-opacity-80"
            onClick={() => setShowMoreEnded(true)}
          >
            More Ended Projects
          </Button>
        ) : (
          <Button
            className="bg-neutral text-white px-4 py-2 rounded-full transition duration-300 hover:shadow-lg hover:bg-opacity-80"
            onClick={() => setShowMoreEnded(false)}
          >
            Less Ended Projects
          </Button>
        )}
      </div>

      <div className="mt-20 mb-6 text-2xl font-bold text-white">
        Pending Project{" "}
        {isFetching ? (
          <span className="loading loading-spinner loading-xs ml-3 text-white display-block mx-auto my-auto"></span>
        ) : (
          ""
        )}
      </div>
      {displayedPendingProjects.map((project) => (
        <div
          key={project.id}
          className="w-full bg-secondary rounded-lg shadow-lg p-4 text-white flex items-center mt-5"
        >
          <div className="flex items-center flex-grow space-x-4 p-3">
            <div className="w-14 h-14 rounded-full overflow-hidden mr-5">
              <img
                src={project.projectLogoImageUrl[0]}
                alt={project.projectTitle}
                width={52}
                height={52}
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="w-48">
              <h3 className="text-xl font-bold">{project.projectTitle}</h3>
              <p className="text-sm">{project.shortDescription}</p>
            </div>

            <div className="flex space-x-20 p-5">
              <div className="text-center">
                <p className="font-semibold">End Date</p>
                <p>
                  {format(new Date(project.endDate), "dd/MM/yyyy HH:mm:ss")}
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Start Date</p>
                <p>
                  {format(new Date(project.startDate), "dd/MM/yyyy HH:mm:ss")}
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Raised amount</p>
                <p>{project.raisedAmount!.toString()}</p>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            {project.isProjectFullyToppedUp !== true ? (
              <button
                className="btn btn-outline rounded-lg mr-4 text-white"
                onClick={(e) => handleTopUp(e, project)}
              >
                {isCallingContract ? (
                  <span className="loading loading-spinner ml-3 loading-xs text-white mr-2"></span>
                ) : (
                  "Top Up"
                )}
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}

      <div className="mt-4 mb-4 flex justify-center w-full">
        {!showMorePending ? (
          <Button
            className="bg-neutral text-white px-4 py-2 rounded-full transition duration-300 hover:shadow-lg hover:bg-opacity-80"
            onClick={() => setShowMorePending(true)}
          >
            More Pending Projects
          </Button>
        ) : (
          <Button
            className="bg-neutral text-white px-4 py-2 rounded-full transition duration-300 hover:shadow-lg hover:bg-opacity-80"
            onClick={() => setShowMorePending(false)}
          >
            Less Pending Projects
          </Button>
        )}
      </div>

      {/* hidden toast */}
      <div className="toast toast-end">
        <div
          id="txSuccessToast"
          role="alert"
          className={`alert alert-success ${txSuccessToastVisible ? "" : "hidden"
            } `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Success! Your transaction was processed</span>
        </div>
      </div>
      <div className="toast toast-end">
        <div
          id="txErrorToast"
          role="alert"
          className={`alert alert-error ${txErrorToastVisible ? "" : "hidden"
            } `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>An error occurred! Your transaction did not succeed</span>
        </div>
      </div>
    </div>
  );
}

export default MyProjectPage;
