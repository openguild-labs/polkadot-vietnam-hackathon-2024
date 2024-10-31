"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, Tab } from "@nextui-org/react";
import { Key } from "react";
import { Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  useContract,
  useContractRead,
  useContractWrite,
  useChain,
  useAddress,
  useContractEvents,
} from "@thirdweb-dev/react";
import { chainConfig } from "@/config";
import { ProjectPoolFactoryABI } from "@/abi";
import { convertNumToOnChainFormat, countDecimals } from "@/utils/decimals";
import { FaPen } from "react-icons/fa";

const tokenSaleData = [
  {
    id: 1,
    title: "Token exchange rate",
    key: "tokenExchangeRate", // Kết nối với trường 'tokenExchangeRate'
  },
  {
    id: 2,
    title: "Sale Start Time",
    key: "startDate", // Kết nối với trường 'startDate'
  },
  {
    id: 3,
    title: "Sale End Time",
    key: "endDate", // Kết nối với trường 'endDate'
  },
  // {
  //   id: 4,
  //   title: "Amount token release",
  //   key: "amountTokenRelease", // Kết nối với trường 'amountTokenRelease'
  // },
  {
    id: 4,
    title: "Softcap",
    key: "softcap", // Kết nối với trường 'softcap'
  },
  {
    id: 5,
    title: "Hardcap",
    key: "hardcap", // Kết nối với trường 'hardcap'
  },
  {
    id: 6,
    title: "Minimum investment",
    key: "minInvestment", // Kết nối với trường 'minInvestment'
  },
  {
    id: 7,
    title: "Maximum investment",
    key: "maxInvestment", // Kết nối với trường 'maxInvestment'
  },
];

const PreviewPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Key>("description");
  const [alertText, setAlertText] = useState<string>("");
  const [factoryAddress, setFactoryAddress] = useState<string | undefined>(
    undefined
  );
  const [txHashWatching, setTxHashWatching] = useState<string | null>(null);
  const [isSendingHTTPRequest, setIsSendingHTTPRequest] =
    useState<boolean>(false);

  const formDataVerifyToken = useSelector((state: any) => {
    console.log(state);
    return state.form.verifyTokenData;
  });
  const formDataGeneralDetail = useSelector(
    (state: any) => state.form.generalDetailData
  );
  const formDataPromotion = useSelector(
    (state: any) => state.form.promotionData
  );
  const route = useRouter();
  const combinedData = {
    verifyTokenData: formDataVerifyToken,
    generalDetailData: formDataGeneralDetail,
    promotionData: formDataPromotion,
    eventData: {},
  };

  const images = combinedData.generalDetailData.selectedImages;
  console.log(combinedData);
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

  /**
   * @notice contract section
   */
  const chain = useChain();
  const userAddress = useAddress();

  useEffect(() => {
    if (!chain) {
      return;
    }

    const address: string =
      chainConfig[chain.chainId.toString() as keyof typeof chainConfig]
        ?.contracts?.ProjectPoolFactory?.address;

    setFactoryAddress(address);
  }, [chain]);

  const { contract: factoryContract, error: factoryConnErr } = useContract(
    factoryAddress, // Contract address
    ProjectPoolFactoryABI // Contract abi
  );

  const { contract: VTContract, error: VTConnErr } = useContract(
    formDataGeneralDetail.selectedCoin, //selectedVToken
    "token"
  );

  // const { contract: PTContract, error: PTConnErr } = useContract(
  //   formDataVerifyToken,
  //   "token",
  // )

  // const {
  //   mutateAsync: callApprove,
  //   isLoading: isCallingApprove,
  //   error: approveError,
  // } = useContractWrite(
  //   PTContract,
  //   "approve",
  // )

  const {
    mutateAsync: callCreateProject,
    isLoading: isCallingCreateProject,
    error: createProjectError,
  } = useContractWrite(factoryContract, "createProjectPool");

  const { data: VTDecimals, error: VTDecimalsReadErr } = useContractRead(
    VTContract,
    "decimals"
  );

  // const { data: PTDecimals, error: PTDecimalsReadErr } = useContractRead(
  //   PTContract,
  //   "decimals",
  // )

  const [hasMounted, setHasMounted] = useState(false);

  let {
    data: poolCreatedEvt,
    isLoading: isWaitingForPoolCreated,
    error: eventListenerError,
  } = useContractEvents(factoryContract, "ProjectPoolCreated", {
    queryFilter: {
      filters: {
        projectOwner: userAddress,
      },
      order: "desc",
    },
    subscribe: true,
  });

  /**
   * @notice handle when ProjectPoolCreated event occurred
   */
  useEffect(() => {
    if (!txHashWatching) {
      console.trace(
        `Not looking forward to any event from any contract at this moment`
      );
      return;
    }

    const justDoIt = async () => {
      if (eventListenerError) {
        console.trace("Lmao, eventListenerError");
        showAlertWithText(`Contract event error occurred`);
        console.error(
          `Co event from smart contract due to error:\n${eventListenerError}`
        );
      }

      if (poolCreatedEvt && !eventListenerError) {
        console.trace("Processing events");
        console.debug(`isWaitingForEvent = ${isWaitingForPoolCreated}`);
        console.debug(`eventData = ${poolCreatedEvt}`);
        console.debug(`eventListenerError = ${eventListenerError}`);

        const wantedEvent = poolCreatedEvt.find((evt) => {
          return evt.transaction.transactionHash === txHashWatching;
        });

        if (!wantedEvent) {
          console.trace("Wanted event not found in list of emitted events");
        }

        let wantedData = wantedEvent?.data;
        if (!wantedData) {
          console.trace("wantedEvent.data is undefined! what the F?");
          return;
        }

        wantedData.projectOwner = wantedData.projectOwner.toString();
        wantedData.projectId = Number(wantedData.projectId as bigint);
        wantedData.txnHashCreated = wantedEvent!.transaction.transactionHash;
        combinedData.eventData = wantedData;

        setIsSendingHTTPRequest(true);
        try {
          const response = await axios.post("/api/addProject", combinedData);
          if (response.status === 200) {
            showAlertWithText("Success! Your transaction was processed");
            cleanup();
            route.push("/myProject");
          }
        } catch (err) {
          setIsSendingHTTPRequest(false);
          console.error(`error while calling POST api:\n${err}`);
          if (err instanceof AxiosError) {
            if (err.response) {
              console.error(`error status code: ${err.response.statusText}`);
            }
            showAlertWithText("Transaction finished but failed to be saved");
            setTxHashWatching(null);
          }
        }
      }
    };

    const cleanup = () => {
      setTxHashWatching(null);
      poolCreatedEvt = undefined;
      isWaitingForPoolCreated = false;
      eventListenerError = undefined;
      setIsSendingHTTPRequest(false);
    };

    justDoIt();

    // cleanup
    return cleanup;
  }, [txHashWatching]);

  const showAlertWithText = (text: string) => {
    setAlertText(text);
    (document.getElementById("alertDialog") as HTMLDialogElement).showModal();
  };

  useEffect(() => {
    if (!createProjectError) {
      return;
    }
    showAlertWithText(`Error occurred! Could not create project`);
    console.error(`Cannot create project due to error:\n${createProjectError}`);
  }, [createProjectError]);

  // verifyToken: string, tokenExchangeRate: string, unixTime: Date, unixTimeEnd: Date,
  //   minInvest: number, maxInvest: number, softCap: number, hardCap: number,
  //     reward: number, selectedVToken: string) => {

  if (factoryConnErr) {
    alert("failed to connect to factory contract");
  }

  const handleSubmit = async () => {
    if (VTConnErr) {
      console.error(`Failed to connect to vToken contract:\n${VTConnErr}`);
      return;
    }

    console.log("Success Smartcontract");

    if (VTDecimalsReadErr) {
      showAlertWithText("Failed to read vToken decimals");
      console.error(VTDecimalsReadErr);
      return;
    }

    console.trace(`VTDecimals is ${VTDecimals}`)
    console.trace(`VTDecimals is ${VTDecimals}`);
    console.debug(`factoryAddress is : ${factoryAddress}`);
    console.debug(`user address is :${userAddress}`);

    console.debug(
      `factory contract address is ${factoryContract?.getAddress()}`
    );

    const resp = await callCreateProject({
      args: [
        formDataVerifyToken, //verifyToken
        convertNumToOnChainFormat(
          Number(formDataPromotion.tokenExchangeRate),
          VTDecimals
        ), //tokenExchangeRate
        new Date(formDataPromotion.startDate).getTime() / 1000, //startDate
        new Date(formDataPromotion.endDate).getTime() / 1000, //endDate
        convertNumToOnChainFormat(
          Number(formDataPromotion.minInvestment),
          VTDecimals
        ), //minInvestment
        convertNumToOnChainFormat(
          Number(formDataPromotion.maxInvestment),
          VTDecimals
        ), //maxInvestment
        convertNumToOnChainFormat(
          Number(formDataPromotion.hardcap),
          VTDecimals
        ), //hardcap
        convertNumToOnChainFormat(
          Number(formDataPromotion.softcap),
          VTDecimals
        ), //softcap
        convertNumToOnChainFormat(Number(formDataPromotion.reward) / 100, 4), //reward percentage
        formDataGeneralDetail.selectedCoin, //selectedVToken
      ],
    });

    if (createProjectError) {
      console.error(
        `cannot create project due to error:\n${createProjectError}`
      );
      return;
    }

    if (!resp) {
      console.error("resp is undefined");
      return;
    }

    const receipt = resp.receipt;
    const txHash = receipt.transactionHash;
    console.debug("Transaction Hash watching:", txHash);
    setTxHashWatching(txHash);
    console.trace("Set txHash watching");
  };

  return (
    <div className="flex justify-center items-center bg-primary min-h-screen relative">
      <dialog id="alertDialog" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-primary text-primary-content">
          <h3 className="font-bold text-lg">Alert</h3>
          <p id="alertText" className="py-4">
            {alertText}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn hover:text-black">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div
        className="absolute top-0 left-0 w-full h-[720px] bg-cover bg-center blur-md"
        style={{
          backgroundImage: `url(${(images && images?.length > 0) ? images[0] : "https://www.hdwallpapers.in/download/dragon_dark_blue_background_4k_hd_horizon_forbidden_west-3840x2160.jpg"})`,
        }}
      ></div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 to-primary opacity-70"></div>

      <div className="relative w-full lg:w-3/5 flex flex-col text-white mt-28 p-4">
        <div className="flex items-center text-left mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden mr-5">
            <img
              src={combinedData.generalDetailData.selectedLogo}
              alt="Profile Icon"
              width={52}
              height={52}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">
              {combinedData.generalDetailData.projectTitle}
            </h1>
            <p className="text-lg text-gray-400">
              {combinedData.generalDetailData.shortDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden w-full lg:gap-x-8">
          <div className="lg:w-2/3 p-6 flex flex-col justify-center">
            <div className="relative mb-4 h-96" onClick={toggleFullscreen}>
              <Image
                src={(images && images?.length > currentImage) ? images[currentImage] : ""}
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
              {images && images.map((image: string, index: number) => (
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
              <p className="text-xl font-semibold text-white">Fundraise Goal</p>
              <p className="text-3xl font-bold text-white mt-2">
                {combinedData.generalDetailData.projectTitle}
              </p>
              <p className="text-gray-400 mt-8">
                {combinedData.generalDetailData.shortDescription}
              </p>

              <Button
                className="bg-neutral hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-auto w-full"
                onClick={() => route.push("/addProject/generalDetail")}
              >
                <span className="flex flex-row gap-x-2 my-auto">
                  <FaPen className="mt-0.5" />
                  <span>
                    Edit info
                  </span>
                </span>
              </Button>
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
              <p className=" mt-2">
                {combinedData.generalDetailData.longDescription}
              </p>
            </div>
          )}

          {activeTab === "tokensale" && (
            <div>
              <h2 className="text-2xl font-semibold mb-5">
                Token sale info
              </h2>
              <div className="rounded-[15px] bg-[#18181B]">
                <table className="backdrop-blur-sm shadow-lg w-full border-collapse rounded-[15px] text-white">
                  <thead>
                    <tr className="bg-[#27272A] text-left text-sm text-[#aeaeae]">
                      <th className="p-4 rounded-tl-[15px] text-[#00FFFF]">Token Sale</th>
                      <th className="p-4 rounded-tr-[15px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenSaleData.map((data) => {
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
                    })}
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
        <Button
          className="font-bold text-lg mt-2 mb-8 bg-neutral text-[#ffffff] py-2 px-4 rounded-full"
          disabled={isCallingCreateProject === true || txHashWatching !== null}
          onClick={handleSubmit}
        >
          {(txHashWatching !== null
            || isCallingCreateProject === true
            || isSendingHTTPRequest === true)
            ? <span className="loading loading-dots loading-md"></span>
            : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default PreviewPage;
