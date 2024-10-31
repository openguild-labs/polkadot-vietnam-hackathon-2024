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
import { DBProject, ProjectStatus } from "@/interfaces/interface";
import { format } from "date-fns";
import { ethers } from "ethers";
import { chainConfig } from "@/config";
import { IERC20ABI, ProjectPoolABI, ProjectPoolFactoryABI } from "@/abi";
import { convertNumToOffchainFormat } from "@/utils/decimals";

function InvesmentPage() {
  const [showMoreEnded, setShowMoreEnded] = useState<boolean>(false);
  const [showMorePending, setShowMorePending] = useState<boolean>(false);
  // const [availableProjects, setAvailableProjects] = useState<DBProject[]>([]);
  const [endedProjects, setEndedProjects] = useState<DBProject[]>([]);
  const [pendingProjects, setPendingProjects] = useState<DBProject[]>([]);
  const [isCallingContract, setIsCallingContract] = useState<boolean>(false);
  const [txSuccessToastVisible, setTxSuccessToastVisible] =
    useState<boolean>(false);
  const [txErrorToastVisible, setTxErrorToastVisible] =
    useState<boolean>(false);
  const [factoryAddress, setFactoryAddress] = useState<string | undefined>(
    undefined
  );
  const [factoryContract, setFactoryContract] = useState<ethers.Contract>();
  const [alertText, setAlertText] = useState<string>("");
  const userAddress = useAddress();
  const chain = useChain();
  const [redeemProject, setRedeemProject] = useState<DBProject | undefined>(
    undefined
  );
  const [vAssetDecimals, setVAssetDecimals] = useState<number | undefined>(undefined);
  const [projectTokenDecimals, setProjectTokenDecimals] = useState<number | undefined>(undefined);
  const [isFetchingRedeemInfo, setIsFetchingRedeemInfo] = useState<boolean>(false);
  const [userDepositAmount, setUserDepositAmount] = useState<string | undefined>(undefined);
  const [withdrawAmount, setUserWithdrawAmount] = useState<string | undefined>(undefined);
  const [isFetchingProject, setIsFetchingProjects] = useState<boolean>(false);

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


  useEffect(() => {
    if (!chain) {
      return;
    }

    const address: string =
      chainConfig[chain.chainId.toString() as keyof typeof chainConfig]
        ?.contracts?.ProjectPoolFactory?.address;

    setFactoryAddress(address);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(
      address,
      ProjectPoolFactoryABI,
      provider
    );
    setFactoryContract(factoryContract);
  }, [chain]);

  useEffect(() => {
    if (!userAddress) {
      console.debug(`not fetching project bcuz userAddress is empty`);
      return;
    }

    if (!factoryContract) {
      console.debug(`not fetching project bcuz factoryContract is empty`);
      return;
    }

    const fetchProjects = async () => {
      setIsFetchingProjects(true);
      try {
        const response = await axios.post("/api/myInvestment", {
          address: userAddress,
        });

        let { investedProjects }: {
          investedProjects: DBProject[]
        } = response.data;
        console.log(investedProjects);

        console.log("len:" + investedProjects.length);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        for (const project of investedProjects) {
          console.log(`WTF: project id is ${project.projectID}`);
          const poolAddress = await factoryContract!.getProjectPoolAddress(
            project.projectID
          );
          // const signer = provider.getSigner();
          const poolContract = new ethers.Contract(
            poolAddress,
            ProjectPoolABI,
            provider
          );
          const raisedAmount = await poolContract.getProjectRaisedAmount();
          const rewardRate = BigInt(50);
          const isProjectSoftCapReached =
            await poolContract.getProjectSoftCapReached();
          console.log(`isProject softcap reached?: ${isProjectSoftCapReached}`);
          investedProjects = investedProjects.map((project) => {
            project.isProjectSoftcapReached = isProjectSoftCapReached;
            project.raisedAmount = raisedAmount.toString();
            project.rewardRate = rewardRate.toString();
            return project;
          })
        }

        const ended = investedProjects.filter(
          (project: DBProject) => project.status === "ended"
        );
        const pending = investedProjects.filter(
          (project: DBProject) => project.status === "pending"
        );

        setEndedProjects(ended);
        setPendingProjects(pending);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsFetchingProjects(false);
      }
    };

    fetchProjects();

  }, [userAddress, factoryContract]);

  useEffect(() => {
    if (!redeemProject) {
      console.trace(`redeemProject is not ready`);
      return;
    }

    if (!factoryContract) {
      console.trace(`nevermind, factoryContract is not ready!`);
      return;
    }

    const fetchRedeemInfo = async () => {
      setIsFetchingRedeemInfo(true);
      const poolAddress = await factoryContract.getProjectPoolAddress(redeemProject.projectID);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const poolContract = new ethers.Contract(
        poolAddress,
        ProjectPoolABI,
        provider
      );
      // const vAssetAddress = await poolContract.getAcceptedVAsset();
      // const projectTokenAddress = await poolContract.getProjectTokenAddress();
      // const vAssetContract = new ethers.Contract(
      //   vAssetAddress,
      //   IERC20ABI,
      //   provider
      // );
      // const projectTokenContract = new ethers.Contract(
      //   projectTokenAddress,
      //   IERC20ABI,
      //   provider
      // );
      // const vDecimals = await vAssetContract.decimals();
      // const pDecimals = await projectTokenContract.decimals();

      setVAssetDecimals(Number(18));
      setProjectTokenDecimals(Number(18));

      const _depositAmount: bigint = await poolContract.getUserDepositAmount(userAddress);
      const _withdrawAmount: bigint = await poolContract.getWithdrawAmount();
      console.log(`depositAmount is ${_depositAmount}`);
      console.log(`withdrawAmount is: ${_withdrawAmount}`);

      // setUserDepositAmount(convertNumToOffchainFormat(_depositAmount, vAssetDecimals!));
      // setUserWithdrawAmount(convertNumToOffchainFormat(_withdrawAmount, projectTokenDecimals!));
      setUserDepositAmount(_depositAmount.toString());
      setUserWithdrawAmount(_withdrawAmount.toString());
      // (document.getElementById("userDepositInput") as HTMLInputElement).value = convertNumToOffchainFormat(BigInt(depositAmount), vAssetDecimals!);
      // (document.getElementById("withdrawAmountInput") as HTMLInputElement).value = convertNumToOffchainFormat(BigInt(withdrawAmount), projectTokenDecimals!);

      setIsFetchingRedeemInfo(false);
    }

    fetchRedeemInfo();
  }, [redeemProject, factoryContract]);

  const handleRedeem = async (project: DBProject) => {
    setRedeemProject(project);
    (document.getElementById("redeemDialog") as HTMLDialogElement).showModal();
  }

  const makeRedeemTransaction = async () => {
    if (!redeemProject) {
      console.error("no project selected for redeem!");
      return;
    }

    if (!factoryContract) {
      console.error("factory contract not initialized!");
      return;
    }

    setIsCallingContract(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const poolAddress = await factoryContract.getProjectPoolAddress(redeemProject.projectID!);
    const poolContract = new ethers.Contract(
      poolAddress,
      ProjectPoolABI,
      signer
    );

    try {
      const tx = await poolContract.redeemTokens();
      showTxSuccessToast();
      // index Redeemed event in databaase (TODO)
      showTxSuccessToast();
      (document.getElementById("redeemDialog") as HTMLDialogElement).close();
      redeemProject.isRedeemed = true;
      console.log(`tx successful:\n${tx}`);
    } catch (err) {
      console.error(`error while redeeming:\n${err}`);
      showTxErrorToast();
      return;
    } finally {
      setIsCallingContract(false);
    }
  }

  const handleRefund = async (project: DBProject) => {
    showAlertWithText("Coming soon!");
  }

  const displayedEndedProjects = showMoreEnded
    ? endedProjects
    : endedProjects.slice(0, 3);
  const displayedPendingProjects = showMorePending
    ? pendingProjects
    : pendingProjects.slice(0, 3);

  return (
    <div className="relative flex flex-col justify-start items-start min-h-screen bg-primary px-14">
      {/* Alert dialog (not shown unless called) */}
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
        id="redeemDialog"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-primary text-primary-content">
          <h3 className="font-bold text-lg">Redeem purchased token</h3>
          {/* <p id="" className="py-4">{alertText}</p> */}
          {isFetchingRedeemInfo ? <span className="loading loading-spinner display-block ml-3 loading-xs text-white mx-auto my-auto"></span>
            : <div className="w-full flex-col mt-10 mb-10 p-4 gap-y-8">
              <label className="form-control w-full mb-7">
                <div className="label">
                  <span className="label-text">
                    <div className="flex flex-row gap-x-2">
                      {/* <img width={20} height={15} src='https://www.stakingrewards.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstakingrewards-static%2Fimages%2Fassets%2Fproduction%2Fbifrost-voucher-astr_logo.png%3Fv%3D1717150606436&w=3840&q=75'></img> */}
                      <span className="font-bold text-cyan-300 mb-3 mx-auto my-auto">Voucher Asset deposited:</span>
                    </div>
                  </span>
                </div>
                <input type="text" id="userDepositInput" value={userDepositAmount} placeholder="0" className="input input-bordered w-full max-w-xs bg-[#1d232a] shadow-lg" />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    <div className="flex flex-row gap-x-2 mx-auto my-auto">
                      {/* <img width={20} height={15} src='https://www.stakingrewards.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstakingrewards-static%2Fimages%2Fassets%2Fproduction%2Fbifrost-voucher-astr_logo.png%3Fv%3D1717150606436&w=3840&q=75'></img> */}
                      <span className="font-bold text-cyan-300 mb-3">Token receive:</span>
                    </div>
                  </span>
                </div>
                <input type="text" id="withdrawAmountInput" value={withdrawAmount}
                  placeholder="0" className="input input-bordered w-full max-w-xs bg-[#1d232a] shadow-lg" />
              </label>
            </div>
          }
          <div className="modal-action">
            <form method="dialog" className="gap-x-3">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost ml-4 my-auto">Close</button>
              <button
                className="btn btn-outline hover:text-black btn-success mx-auto my-auto"
                onClick={(e) => {
                  e.preventDefault();
                  makeRedeemTransaction()
                }}
              >
                {isCallingContract ? <span className="loading loading-spinner display-block ml-3 loading-xs text-white mx-auto my-auto"></span> : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </dialog>


      <div className="mt-20 mb-6 text-2xl font-bold text-white">
        Ended Project {isFetchingProject && <span className="loading loading-spinner display-block ml-3 loading-xs text-white mx-auto my-auto"></span>}
      </div>
      {displayedEndedProjects.map((project) => (
        <div
          key={project.id}
          className="w-full bg-secondary rounded-lg shadow-lg p-4 text-white flex items-center mt-5"
        >
          <div className="flex items-center flex-grow space-x-4 p-3">
            <div className="w-14 h-14 rounded-full overflow-hidden mr-5">
              <Image
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

            <div className="flex space-x-9 p-5">
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
                <p className="font-semibold">Amount</p>
                <p>{project.raisedAmount?.toString()}</p>
              </div>
              <div className="ml-20 mx-auto my-auto text-center">
                <p className="font-semibold">Reward</p>
                <p className="text-cyan-300">+{Number(convertNumToOffchainFormat(BigInt(project.rewardRate!), 4))}%</p>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            {
              project.isProjectSoftcapReached ?
                <button
                  className="mr-4 rounded-lg btn btn-success"
                  disabled={project.isRedeemed === true}
                  onClick={(e) => { e.preventDefault(); handleRedeem(project) }}
                >
                  Redeem tokens
                </button> :
                <button
                  className="mr-4 rounded-lg btn btn-ghost mx-auto my-auto px-4 py-2"
                  onClick={(e) => {
                    console.log(`IS PROJECT SOFTCAP REACHED AGAIN?: ${project.isProjectSoftcapReached}`);
                    e.preventDefault();
                    handleRefund(project)
                  }}
                >
                  Refund tokens
                </button>
            }
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
        Pending Project {isFetchingProject && <span className="loading loading-spinner display-block ml-3 loading-xs text-white mx-auto my-auto"></span>}
      </div>
      {displayedPendingProjects.map((project) => (
        <div
          key={project.id}
          className="w-full bg-secondary rounded-lg shadow-lg p-4 text-white flex items-center mt-5"
        >
          <div className="flex items-center flex-grow space-x-4 p-3">
            <div className="w-14 h-14 rounded-full overflow-hidden mr-5">
              <Image
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

            <div className="flex space-x-7 p-5">
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
                <p className="font-semibold">Amount</p>
                <p>{project.raisedAmount?.toString()}</p>
              </div>
            </div>
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

      {/* hidden toasts (not shown unless called) */}
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
      l
    </div>
  );
}

export default InvesmentPage;
