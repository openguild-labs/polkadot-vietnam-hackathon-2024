"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, Tab } from "@nextui-org/react";
import { Key } from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { DBProject } from "@/interfaces/interface";
import { format } from "date-fns";
import {
  useChain,
  useAddress,
} from "@thirdweb-dev/react";
import { chainConfig } from "@/config";
import { ethers } from "ethers";
import { ProjectPoolABI, ProjectPoolFactoryABI, IERC20ABI } from "@/abi";
import {
  convertNumToOffchainFormat,
  convertNumToOnChainFormat,
} from "@/utils/decimals";
import { shorten } from "@/utils/display";

const ProjectDetailPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Key>("description");
  const [projectDetails, setProjectDetails] = useState<DBProject[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [factoryContract, setFactoryContract] = useState<ethers.Contract>();
  const [poolContract, setPoolContract] = useState<ethers.Contract | undefined>(undefined);
  const [poolAddress, setPoolAddress] = useState<string | undefined>(undefined);
  const [tokenPrice, setTokenPrice] = useState<bigint>(BigInt(0));
  const [softCap, setSoftCap] = useState<bigint>(BigInt(0));
  const [hardCap, setHardCap] = useState<bigint>(BigInt(0));
  const [minInvestment, setMinInvestment] = useState<bigint>(BigInt(0));
  const [maxInvestment, setMaxInvestment] = useState<bigint>(BigInt(0));
  const [vAsssetDecimals, setVAssetDecimals] = useState<number | undefined>(
    undefined
  );
  const [vAssetAddress, setVAssetAddress] = useState<string | undefined>(
    undefined
  );
  const [userWhitelisted, setUserWhitelisted] = useState<boolean>(false);
  const [userDepositedAmount, setUserDepositedAmount] = useState<bigint>(BigInt(0));
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false);
  const [txSuccessToastVisible, setTxSuccessToastVisible] =
    useState<boolean>(false);
  const [txErrorToastVisible, setTxErrorToastVisible] =
    useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [isSendingTx, setIsSendingTx] = useState<boolean>(false);
  const [isProjectFullyToppedUp, setIsProjectFullyToppedUp] = useState<boolean>(false);

  const route = useRouter();
  const chain = useChain();
  const userAddress = useAddress();
  const pageParam = useParams();

  /**
   *
   * @dev bunch of showToasts functions
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

  useEffect(() => {
    if (!poolContract) {
      console.trace(`poolContract is not ready`);
      return;
    }

    console.trace(`chain mounted: ${chain}`);
    if (!chain) {
      console.trace("chain is not ready");
      return;
    }

    const getVAssetInfo = async () => {
      const vAssetAddress = await poolContract.getAcceptedVAsset();
      console.trace(`vAssetAddress is: ${vAssetAddress}`);
      if (!vAssetAddress) {
        console.trace("vAssetDecimals is empty");
        return;
      }
      const chainId = chain.chainId.toString() as keyof typeof chainConfig;
      const vAsset = chainConfig[chainId].vAssets.find(
        (asset) => asset.address === vAssetAddress
      );
      console.debug(`vAsset from config is : ${vAsset}`);
      const decimals = vAsset?.decimals;
      console.debug(`decimals is ${decimals}`);
      setVAssetDecimals(decimals);
      setVAssetAddress(vAsset?.address);
      console.trace("call setVAssetDecimals()");
    };

    getVAssetInfo();
  }, [poolContract, chain]);

  /**
   * @dev check if user has invested in project on poolContract mount
   */
  useEffect(() => {
    console.trace(`fetching user's whitelist status`);

    if (!userAddress) {
      console.trace("nevermind, user hasn't connected their damn wallet");
      return;
    }

    const checkUserWhitelisted = async () => {
      if (!poolContract) {
        console.trace("nevermind, poolContract is not ready");
        return;
      }
      const isWhitelisted: boolean = await poolContract.isWhitelisted(
        userAddress
      );
      console.debug(`is user whitelisted? : ${isWhitelisted}`);
      setUserWhitelisted(isWhitelisted);
      console.trace(`call setUserWhitelisted()`);
    };

    checkUserWhitelisted();
  }, [poolContract]);

  useEffect(() => {
    if (!chain) {
      return;
    }
    const address: string =
      chainConfig[chain.chainId.toString() as keyof typeof chainConfig]
        ?.contracts?.ProjectPoolFactory?.address;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("Provider: " + provider);
    const factoryContract = new ethers.Contract(
      address,
      ProjectPoolFactoryABI,
      provider
    );

    setFactoryContract(factoryContract);
  }, [chain]);

  useEffect(() => {
    if (isSendingTx) {
      console.trace(
        "hold'on, tx is being sent, im not gonna fetch project info"
      );
      return;
    }

    console.trace("fetching project info");
    const fetchProjectDetails = async () => {
      const { projectId } = pageParam;
      console.log("Project id: " + projectId);

      const response = await axios.post("/api/projectDetail", projectId);
      console.log("Respnse data: " + response.data);
      const { projectDetailsData } = response.data;

      if (projectDetailsData) {
        const images = projectDetailsData[0].projectImageUrls;
        setImages(images);
        // console.log("This is image" + images);

        console.log(projectDetailsData);
        setProjectDetails(projectDetailsData);
      } else {
        route.push("/404");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("Factory contract: " + factoryContract);
      if (!factoryContract) {
        console.log("Factory contract is not ready");
        return;
      }
      console.trace(`WHAT THE FUCK, THIS IS PROJECTID: ${projectDetailsData[0].projectID}`);
      const poolAddress = await factoryContract!.getProjectPoolAddress(
        BigInt(projectDetailsData[0].projectID)
      );
      console.log("Got pool address: " + poolAddress);
      setPoolAddress(poolAddress);
      console.trace(`call setPoolAddress()`);

      const code = await provider.getCode(poolAddress);
      if (code === "0x") {
        console.error("Contract not found at address:", poolAddress);
        return;
      }
      console.log("Code: " + code);

      const poolContract = new ethers.Contract(
        poolAddress,
        ProjectPoolABI,
        provider
      );

      console.log("Got pool contract: " + poolContract);

      const tokenPrice = await poolContract!.getPricePerToken(); //chua co
      console.log(`tokenPrice is: ${tokenPrice}`);

      const softcap = await poolContract!.getProjectSoftCapAmount();
      const hardcap = await poolContract!.getProjectHardCapAmount();
      const minInvestment = await poolContract!.getProjectMinInvest();
      const maxInvestment = await poolContract!.getProjectMaxInvest();
      const depositedAmount = await poolContract!.getUserDepositAmount(userAddress);
      const isFullyToppedUp = await poolContract!.isProjectFullyToppedUp()
      const projectOwner = await poolContract.getProjectOwner();

      console.log(`softCap is: ${softCap}`);
      console.log(`hardCap is: ${hardCap}`);
      console.log(`minInvestment is: ${minInvestment}`);
      console.log(`maxInvestment is: ${maxInvestment}`);
      console.log(`depositedAmount is: ${depositedAmount}`);
      console.log(`user is projectOwner?: ${projectOwner === userAddress}`);

      setTokenPrice(BigInt(tokenPrice));
      setSoftCap(BigInt(softcap));
      setHardCap(BigInt(hardcap));
      setMinInvestment(BigInt(minInvestment));
      setMaxInvestment(BigInt(maxInvestment));
      setUserDepositedAmount(BigInt(depositedAmount));
      setIsProjectOwner(projectOwner === userAddress);
      setIsProjectFullyToppedUp(isFullyToppedUp);

      console.trace(`setPoolContract to ${poolContract}`);
      setPoolContract(poolContract);
      console.trace("set vars complete");
    };

    fetchProjectDetails();
  }, [factoryContract, isSendingTx]);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? images.length - 1 : prevImage - 1
    );
  };

  const [isFullscreen, setIsFullscreen] = useState(false); // Trạng thái full màn hình

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleWhitelist = async (e?: any) => {
    if (e) {
      e?.preventDefault();
    }

    const { projectId } = pageParam;
    if (!projectId) {
      console.trace(`projectId when switching page is empty`);
      return;
    }
    console.debug(`project id is ${projectId}`);
    route.push(`/whitelist/${projectId}`);
  };

  const handleInvest = async () => {
    (document.getElementById("investDialog") as HTMLDialogElement).showModal();
  };

  const makeInvestTransaction = async (amount: number) => {
    if (!poolContract) {
      console.trace(`poolContract doesn't look ready for invest tx`);
      return;
    }

    const onchainAmount: string = convertNumToOnChainFormat(
      amount,
      vAsssetDecimals!
    ) as string;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.trace(
      `metamask provided a signer with address: ${await signer.getAddress()}`
    );

    if (!vAssetAddress) {
      console.trace(
        `cannot make ERC20 approve tx because vAssetAddress is not ready`
      );
      return;
    }
    const vAssetContract = new ethers.Contract(
      vAssetAddress,
      IERC20ABI,
      signer
    );
    console.trace(`got vAsset contract: ${vAssetContract}`);

    const poolContractWithSigner = poolContract.connect(signer);
    console.trace(`got poolContractWithSigner: ${poolContractWithSigner}`);

    setIsSendingTx(true);
    try {
      // require user to make ERC20 allowance to pool contract
      await vAssetContract.approve(poolContract.address, onchainAmount);
      console.trace(`ERC20 approve tx done`);

      await poolContractWithSigner.investProject(onchainAmount);
      console.trace(`invest tx done`);

      // manually save event data, which is discouraged (IMPROVE LATER)
      const resp = await fetch("/api/projectDetail/invest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: pageParam.projectId,
          userAddress: userAddress,
          amount: onchainAmount,
          chainId: chain?.chainId.toString(),
          poolAddress: poolAddress,
        })
      });
      if (!resp.ok) {
        console.error(
          `request to save invest event failed with resp:\n${resp}`
        );
        showTxErrorToast();
        return;
      }

      console.log("successfully saved invest event");
      (document.getElementById("InvestBtn") as HTMLInputElement).disabled = true;
      showTxSuccessToast();
    } catch (err) {
      showTxErrorToast();
      console.error(`error when sending investment tx:\n${err}`);
    } finally {
      (document.getElementById("investDialog") as HTMLDialogElement).close();
      setIsSendingTx(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-primary min-h-screen ">
      {/* Alert dialog (only shown when called) */}
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
        id="investDialog"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-primary text-primary-content backdrop-blur-xl shadow-lg">
          <h3 className="font-bold text-lg">Choose investment amount</h3>
          {/* <p id="" className="py-4">{alertText}</p> */}
          <div className="flex flex-col w-full mt-10 mb-5 p-4 gap-y-4">
            <p className="flex flex-row gap-x-2 mb-3">
              <img
                src="https://www.stakingrewards.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstakingrewards-static%2Fimages%2Fassets%2Fproduction%2Fbifrost-voucher-astr_logo.png%3Fv%3D1717150606436&w=3840&q=75"
                width={24}
                height={24}
              ></img>
              <span className="text-info font-bold">
                Voucher asset (
                {shorten(
                  convertNumToOffchainFormat(
                    userDepositedAmount,
                    vAsssetDecimals!
                  )
                )}{" "}
                deposited)
              </span>
            </p>
            <label
              id="investAmountInputCont"
              className="input input-bordered flex items-center gap-2 bg-[#1d232a] shadow-lg"
            >
              <input
                type="number"
                id="investAmountInput"
                className="grow text-[#99a0ad] font-bold input-bordered input-info"
                placeholder="input amount"
                disabled={userDepositedAmount >= maxInvestment}
                onChange={(e) => {
                  const amount: bigint = convertNumToOnChainFormat(
                    Number(e.target.value),
                    vAsssetDecimals!,
                    false
                  ) as bigint;
                  const adjustedMinInvestment: bigint =
                    minInvestment - userDepositedAmount; // can be negative
                  const adjustedMaxInvestment: bigint =
                    maxInvestment - userDepositedAmount; // can be negative
                  if (amount < adjustedMinInvestment) {
                    console.debug(`invalid input amount: ${amount.toString()}`);
                    document.getElementById("investAmountAlert")!.innerText =
                      "MINIMUM INVESTMENT AMOUNT NOT REACHED!";
                  } else if (amount > adjustedMaxInvestment) {
                    console.debug(`invalid input amount: ${amount.toString()}`);
                    document.getElementById("investAmountAlert")!.innerText =
                      "MAXIMUM INVESTMENT AMOUNT EXCEEDED!";
                  } else {
                    document.getElementById("investAmountAlert")!.innerHTML =
                      "&nbsp";
                  }
                }}
              />
              <kbd className="kbd kbd-sm bg-pink-400 text-white">⌘</kbd>
              <kbd className="kbd kbd-sm bg-accent text-white">K</kbd>
            </label>
            <p id="investAmountAlert" className="select-none my-auto ml-4 text-red-600 font-bold" >&nbsp;</p>
            <div id="optionContainer" className="flex flex-row gap-x-2 mt-2">
              <div
                id="minimumOpt"
                className={`card bg-secondary rounded-box grid h-20 flex-grow  backdrop-blur-lg
            hover:cursor-pointer select-none border border-opacity-20 bg-opacity-10 
            shadow-lg place-items-center "font-bold brightess-75"`}
                onClick={(e) => {
                  e.preventDefault();
                  const thisOpt = document.getElementById("minimumOpt");
                  const maximumOptBtn = document.getElementById("maximumOpt");

                  // Reset brightness classes
                  maximumOptBtn?.classList.remove("brightness-75", "brightness-125");
                  thisOpt?.classList.remove("brightness-125");

                  // Set the new brightness classes
                  maximumOptBtn?.classList.add("brightness-75");
                  thisOpt?.classList.add("brightness-125");
                  console.debug(`thisOpt is ${thisOpt}`);

                  let amtTillMinInvest: bigint;
                  if (userDepositedAmount > minInvestment) {
                    amtTillMinInvest = BigInt(0);
                  } else {
                    amtTillMinInvest = minInvestment - userDepositedAmount;
                  }
                  (
                    document.getElementById(
                      "investAmountInput"
                    ) as HTMLInputElement
                  ).value = convertNumToOffchainFormat(
                    amtTillMinInvest,
                    vAsssetDecimals!
                  );
                }}
              >
                <img
                  src="https://s2.coinmarketcap.com/static/img/coins/200x200/12885.png"
                  width={24}
                  height={24}
                ></img>
                Minimum amount
              </div>
              <div
                id="maximumOpt"
                className={`card bg-secondary rounded-box grid h-20 flex-grow  backdrop-blur-lg
            hover:cursor-pointer select-none border border-opacity-20 bg-opacity-10
            shadow-lg place-items-center font-bold`}
                onClick={(e) => {
                  e.preventDefault();
                  const thisOpt = document.getElementById("maximumOpt");
                  const minimumOptBtn = document.getElementById("minimumOpt");

                  // Reset brightness classes
                  minimumOptBtn?.classList.remove("brightness-75", "brightness-125");
                  thisOpt?.classList.remove("brightness-125");

                  // Set the new brightness classes
                  minimumOptBtn?.classList.add("brightness-75");
                  thisOpt?.classList.add("brightness-125");
                  console.debug(`thisOpt is ${thisOpt}`);

                  let investAmtLeft: bigint;
                  if (userDepositedAmount > maxInvestment) {
                    investAmtLeft = BigInt(0);
                  } else {
                    investAmtLeft = maxInvestment - userDepositedAmount;
                  }
                  (
                    document.getElementById(
                      "investAmountInput"
                    ) as HTMLInputElement
                  ).value = convertNumToOffchainFormat(
                    investAmtLeft,
                    vAsssetDecimals!
                  );
                }}
              >
                <div className="flex flex-row gap-x-0 justify-center">
                  <img
                    src="https://s2.coinmarketcap.com/static/img/coins/200x200/12885.png"
                    width={24}
                    height={24}
                  ></img>
                  <img
                    src="https://s2.coinmarketcap.com/static/img/coins/200x200/12885.png"
                    width={24}
                    height={24}
                  ></img>
                </div>
                Maximum amount
              </div>
            </div>
          </div >
          <div className="modal-action">
            <form method="dialog" className="gap-x-3">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost ml-4 my-auto">Close</button>
              <button
                className="btn btn-outline hover:text-black btn-success mx-auto my-auto"
                onClick={(e) => {
                  e.preventDefault();
                  const investAmt: number = Number(
                    (
                      document.getElementById(
                        "investAmountInput"
                      ) as HTMLInputElement
                    ).value
                  );
                  console.trace(
                    `retrieved investAmt from input field: ${investAmt}`
                  );
                  makeInvestTransaction(investAmt);
                }}
              >
                {isSendingTx ? (
                  <span className="loading loading-spinner display-block loading-xs text-white mx-auto my-auto"></span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          </div>
        </div >
      </dialog >

      <div
        className="absolute top-0 left-0 w-full h-[800px] bg-cover bg-center blur-md"
        style={{
          // backgroundImage: `url('https://i.pinimg.com/736x/4d/79/b4/4d79b4275d26861880c4dea267ecbfd2.jpg')`,

          backgroundImage: `url('https://www.hdwallpapers.in/download/dragon_dark_blue_background_4k_hd_horizon_forbidden_west-3840x2160.jpg')`,
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 to-primary opacity-70"></div>

      {
        projectDetails.map((project) => (
          <div
            className="relative w-full lg:w-3/5 flex flex-col text-white mt-28"
            key={project.id}
          >
            <div className="flex items-center text-left mb-8">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-5">
                <Image
                  src={project.projectLogoImageUrl[0]}
                  alt="Profile Icon"
                  width={52}
                  height={52}
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{project.projectTitle}</h1>
                <p className="text-lg text-gray-400">
                  {project.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden w-full lg:gap-x-8">
              <div className="lg:w-2/3 p-6 flex flex-col justify-center">
                <div className="relative mb-4 h-96" onClick={toggleFullscreen}>
                  <Image
                    src={images[currentImage]}
                    alt="Main Image"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover w-full h-full cursor-pointer"
                  />

                  <Button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white text-5xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    &#8249;
                  </Button>

                  <Button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white text-5xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    &#8250;
                  </Button>
                </div>

                <div className="flex space-x-4">
                  {images.map((image: string, index: number) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className={`cursor-pointer rounded-lg object-cover ${currentImage === index ? "ring-4 ring-blue-500" : ""
                        }`}
                      onClick={() => setCurrentImage(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="lg:w-1/3 flex flex-col justify-start pt-6 pb-6">
                <div className="rounded-lg bg-secondary w-full h-72 p-5 flex flex-col">
                  <p className="text-xl font-semibold text-white">
                    Fundraise Goal
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {project.projectTitle}
                  </p>
                  <p className="text-gray-400 mt-8">{project.shortDescription}</p>
                  {
                    userWhitelisted === true
                      ? <button
                        id="InvestBtn"
                        className="btn btn-info mt-5 mx-auto w-full"
                        onClick={handleInvest}
                        disabled={userDepositedAmount >= maxInvestment || isProjectOwner === true}
                      >
                        INVEST
                      </button>
                      : <button
                        className="btn btn-info mt-5 w-full"
                        onClick={handleWhitelist}
                        disabled={userWhitelisted || !isProjectFullyToppedUp || isProjectOwner}
                      >
                        JOIN WHITELIST
                      </button>
                  }
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-9 border-b-2 border-gray-700">
              <Tabs
                variant="underlined"
                aria-label="Tabs variants"
                onSelectionChange={(tabKey) => setActiveTab(tabKey)}
              >
                <Tab
                  key="description"
                  title={
                    <span
                      className={`${activeTab === "description"
                          ? "text-white border-b-2 border-blue-500"
                          : "text-gray-600 hover:text-gray-300 transition-colors duration-200"
                        } pb-[11px]`}
                    >
                      Description
                    </span>
                  }
                />
                <Tab
                  key="tokensale"
                  title={
                    <span
                      className={`${activeTab === "tokensale"
                          ? "text-white border-b-2 border-blue-500"
                          : "text-gray-600 hover:text-gray-300 transition-colors duration-200"
                        } pb-[11px]`}
                    >
                      Token Sale
                    </span>
                  }
                />
              </Tabs>
            </div>

            <div className="p-4 mb-10">
              {activeTab === "description" && (
                <div>
                  <h2 className="text-2xl font-semibold">Description Content</h2>
                  <p className=" mt-2">{project.description}</p>
                </div>
              )}

              {activeTab === "tokensale" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-5">
                    Token Sale Content
                  </h2>
                  <div className="rounded-[15px] bg-[#18181B]">
                    <table className="w-full border-collapse rounded-[15px] text-white">
                      <thead>
                        <tr className="bg-[#27272A] text-left text-sm text-[#aeaeae]">
                          <th className="p-4 rounded-tl-[15px] text-[#00FFFF]">Token Sale</th>
                          <th className="p-4 rounded-tr-[15px]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {tokenSaleData.map((data) => {
                        const value = combinedData.promotionData[data.key];
                        const formattedValue =
                          value instanceof Date
                            ? value.toLocaleDateString("en-GB")
                            : value || "...";

                        return (
                          <tr key={data.id}>
                            <td className="p-4 text-[#aeaeae]">{data.title}</td>
                            <td className="p-4 text-right">{formattedValue}</td>
                          </tr>
                        );
                      })} */}
                        <tr>
                          <td className="p-4 text-[#aeaeae]">
                            Token exchange rate
                          </td>
                          <td className="p-4 text-right">{
                            !!tokenPrice && !!vAsssetDecimals
                              ? convertNumToOffchainFormat(tokenPrice, vAsssetDecimals)
                              : "NaN"
                          }</td>
                        </tr>
                        <tr>
                          <td className="p-4 text-[#aeaeae]">Sale Start Time</td>
                          <td className="p-4 text-right">
                            {format(
                              new Date(project.startDate),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 text-[#aeaeae]">Sale End Time</td>
                          <td className="p-4 text-right">
                            {format(
                              new Date(project.endDate),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 text-[#aeaeae]">Softcap</td>
                          <td className="p-4 text-right">{
                            !!softCap && vAsssetDecimals
                              ? convertNumToOffchainFormat(softCap, vAsssetDecimals!)
                              : ""
                          }</td>
                        </tr>
                        <tr>
                          <td className="p-4 text-[#aeaeae]">Hardcap</td>
                          <td className="p-4 text-right">{
                            !!hardCap && !!vAsssetDecimals
                              ? convertNumToOffchainFormat(hardCap, vAsssetDecimals)
                              : "NaN"
                          }</td>
                        </tr>
                        <tr>
                          <td className="p-4 text-[#aeaeae]">
                            Minimum investment
                          </td>
                          <td className="p-4 text-right">{
                            !!minInvestment && !!vAsssetDecimals
                              ? convertNumToOffchainFormat(minInvestment, vAsssetDecimals)
                              : "NaN"
                          }</td>
                        </tr>
                        <tr>
                          <td className="p-4 text-[#aeaeae]">
                            Maximum investment
                          </td>
                          <td className="p-4 text-right">{
                            !!maxInvestment && !!vAsssetDecimals
                              ? convertNumToOffchainFormat(maxInvestment, vAsssetDecimals)
                              : "NaN"
                          }</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {isFullscreen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                onClick={toggleFullscreen}
              >
                <Image
                  // src={combinedData.generalDetailData[1][1]}
                  src={images[currentImage]}
                  alt="Fullscreen Image"
                  width={1200}
                  height={800}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        ))
      }
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
    </div >
  );
};

export default ProjectDetailPage;
