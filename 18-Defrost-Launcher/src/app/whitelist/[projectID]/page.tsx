"use client";

import React, { useState, useEffect } from "react";
import { WhitelistProps } from "@/app/whitelist/types";
import { SocialTask } from "@/app/whitelist/types";
import Image from "next/image";
import "@heroicons/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { CiCircleCheck } from "react-icons/ci";
import { useRouter } from "next/navigation";
import {
  useAddress,
  useChain,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import {
  useGetProjectPoolContract,
  useGetVTokenContract
} from "@/utils/contracts";

export default function Whitelist({ params }: { params: { projectID: string } }) {
  // Wallet-related states
  const router = useRouter();
  const address = useAddress();
  const projectID = params.projectID;
  const poolContract = useGetProjectPoolContract(projectID);
  const vTokenContract = useGetVTokenContract(poolContract!);

  const {
    mutateAsync: callJoinWhitelilst,
    isLoading: isCallingJoinWhitelist,
    error: joinWhitelistError,
  } = useContractWrite(poolContract, "joinWhitelist");

  const {
    mutateAsync: callApprove,
    isLoading: isCallingApprove,
    error: approveError,
  } = useContractWrite(vTokenContract, "approve");

  const { data: reserveAmt, error: readReserveAmtErr } = useContractRead(
    poolContract,
    "getReserveInvestment"
  );

  useEffect(() => {
    if (!poolContract) {
      return;
    }
    console.debug(
      "Found project pool contract! Fetchng project token contract"
    );
  }, [poolContract]);

  // Update the error state when the hook's error changes
  useEffect(() => {
    if (joinWhitelistError === null) {
      return;
    }
    showAlertWithText("An error occurred! Could not join whitelist.");
    console.error(
      `An error occurred! Could not join whitelist.\n${joinWhitelistError}`
    );
  }, [joinWhitelistError]);

  useEffect(() => {
    if (!approveError) {
      return;
    }

    showAlertWithText(`An error occurred! Could not approve ERC-20`);
    console.error(`Cannot approve due to error\n${approveError}`);
  }, [approveError]);

  const showAlertWithText = (text: string) => {
    setAlertText(text);
    (document.getElementById("alertDialog") as HTMLDialogElement).showModal();
  };

  // Social tasks states
  const [tasks, setTasks] = useState<SocialTask[]>([
    {
      id: "followTwitter",
      description: "Follow our project on Twitter",
      verified: false,
    },
    {
      id: "retweetPost",
      description: "Retweet our latest post on X",
      verified: false,
    },
    {
      id: "likeFacebook",
      description: "Like our Facebook page",
      verified: false,
    },
    {
      id: "joinDiscord",
      description: "Join our Discord server",
      verified: false,
    },
    {
      id: "telegramGroup",
      description: "Join our Telegram group",
      verified: false,
    },
  ]);

  const handleVerifyTasks = async (taskId: string) => {
    // call server-side api later
    // for now, we'll just simulate a successful verification
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, verified: true } : task
    );
    setTasks(updatedTasks);
  };

  const socialConnects = [
    {
      name: "Google",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
    },
    {
      name: "Facebook",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
    },
    {
      name: "X",
      icon: "https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1728172800&semt=ais_hybrid",
    },
    {
      name: "LinkedIn",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    },
  ];

  const handleSocialConnect = (socialName: string) => {
    // Implement social media connection logic here
    console.log(`Connecting to ${socialName}`);
  };

  // Full name states
  const [fullName, setFullName] = useState("");

  // Email & OTP states
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [isOTPVerifying, setIsVerifying] = useState<boolean>(false);
  const [OTP, setOTP] = useState<string>("");
  const [isOTPTimedOut, setIsOTPTimedOut] = useState<boolean | null>(null);
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState<string>("");

  /**
   *
   * @dev fetch project title
   *
   */
  useEffect(() => {
    console.trace(`projectID is: ${projectID}`);
    const fetchTitle = async () => {
      try {
        const response = await fetch("/api/project/title", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectID }),
        });

        if (response.ok) {
          const data = await response.json();
          const projectTitle = data["projectTitle"];
          if (!projectTitle) {
            showAlertWithText("Project title not found!");
            return;
          }
          setProjectTitle(projectTitle);
        } else {
          showAlertWithText("An error occurred!");
        }
      } catch (err) {
        console.error(`error when fetching project title:\n${err}`);
        showAlertWithText("An error occurred!");
      } finally {
        setIsVerifying(false);
      }
    };

    fetchTitle();
  }, []);

  const checkEmailVerified = async (): Promise<boolean> => {
    if (!email) {
      return false;
    }

    if (isEmailVerified) {
      return true;
    }

    let verified: boolean = false;
    try {
      const response = await fetch("/api/auth/email/verified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, address }),
      });

      if (response.ok) {
        const data = await response.json();
        verified =
          data["verified"].toLocaleLowerCase() === "true" ? true : false;
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
    }

    return verified;
  };

  const handleVerifyEmailClick = async () => {
    // validate input
    console.trace("wtf1");
    if (!address) {
      showAlertWithText("Please connect your wallet first");
      return;
    }

    console.trace("wtf2");
    if (!email || !fullName) {
      // TODO: show error message
      return;
    }

    console.trace("wtf3");
    console.debug(`isOTPTimedOut = ${isOTPTimedOut}`);
    if (isOTPTimedOut === null) {
      setIsSendingOTP(true);
      const sendSucceed: boolean = await sendOTPViaEmail();
      setIsSendingOTP(false);
      if (sendSucceed) {
        setIsOTPTimedOut(false);
        (
          document.getElementById("emailOTPModal") as HTMLDialogElement
        )?.showModal();
      }
      console.log("OTP sent");
    } else {
      (
        document.getElementById("emailOTPModal") as HTMLDialogElement
      )?.showModal();
    }
  };

  const handleResendOTP = () => {
    const OTPModal = document.getElementById("emailOTPModal") as any;
    OTPModal.close();
    setIsSendingOTP(true);
    setIsOTPTimedOut(null);
    sendOTPViaEmail();
    OTPModal.showModal();
  };

  const handleOTPSubmit = async (): Promise<boolean> => {
    if (!OTP) {
      return false;
    }

    setIsVerifying(true);

    // call server-side api
    try {
      const response = await fetch("/api/auth/email/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ OTP, email, address, }),
      });

      if (response.ok) {
        setIsEmailVerified(true);
        (document.getElementById("emailOTPModal") as HTMLDialogElement).close();
        showAlertWithText("Email verified");
      } else {
        showAlertWithText("OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showAlertWithText("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }

    return true;
  };

  // check email verification status on page load
  useEffect(() => {
    if (!email) {
      setIsEmailVerified(false);
      return;
    }

    if (isCheckingEmail) {
      return;
    }

    setIsCheckingEmail(true);

    (async () => {
      await new Promise<void>((resolve) => setInterval(resolve, 1000)); // 2 secs delay before checking
      const verified: boolean = await checkEmailVerified();
      setIsEmailVerified(verified);
    })();

    setIsCheckingEmail(false);
  }, [email]);

  const sendOTPViaEmail = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/email/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, address, projectID, fullName }),
      });

      if (response.ok) {
        console.log("OTP sent");
        return true;
      } else {
        const respBody = await response.json();
        const { error } = respBody;
        console.debug(`errMsg = ${error}`);
        showAlertWithText("Could not send OTP");
        return false;
      }
    } catch (error) {
      showAlertWithText("An error occurred! Could not send OTP.");
      console.error("Error sending OTP:", error);
      return false;
    }
  };

  // function to display OTP TTL:
  const OTPTimer = ({ minutes }: { minutes: number }) => {
    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(minutes);
    useEffect(() => {
      const intervalID = setInterval(() => {
        if (second <= 0 && minute <= 0) {
          setIsOTPTimedOut(true);
          return;
        }

        setSecond(second - 1);
        if (second <= 0) {
          setSecond(59);
          setMinute(minute - 1);
        }
      }, 1000);
      return () => clearInterval(intervalID);
    }, [second]);

    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    const formattedSecond = second < 10 ? `0${second}` : second;

    return (
      <p className="text-[#c2c5ca]">
        OTP expires in: {formattedMinute}:{formattedSecond}
      </p>
    );
  };

  const handleSubmitWhitelist = async (e: any) => {
    e?.preventDefault();

    // check email is verified
    const isEmailVerifiedAPI: boolean = await checkEmailVerified();
    if (!isEmailVerified && !isEmailVerifiedAPI) {
      showAlertWithText("Please verify your email first");
      return;
    }

    if (readReserveAmtErr) {
      console.error(`error reading reserve amount: ${readReserveAmtErr}`);
      return;
    }

    if (!reserveAmt) {
      console.error("reserveAmt is undefined");
      return;
    }

    console.trace(`reserve amount is ${reserveAmt}`);
    console.debug(
      `vToken contract address is: ${vTokenContract?.getAddress()}`
    );
    try {
      const approveResp = await callApprove({
        args: [poolContract?.getAddress(), reserveAmt],
      });
      if (!approveResp) {
        console.log("approveResp is undefined!");
        return;
      }
    } catch (err) {
      console.error(`error sending approve tx: ${err}`);
      return;
    }

    try {
      const joinWhitelistResp = await callJoinWhitelilst({ args: [] });
      if (!joinWhitelistResp) {
        console.log("whitelistResp is undefined!");
        return;
      }
      console.log(`whitelist response:\n${joinWhitelistResp}`);
      router.push(`/projectDetail/${projectID}`);
    } catch (err) {
      console.error(`error sending whitelist tx: ${err}`);
      return;
    }

    // if (joinWhitelistError === null) {
    // }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl relative overflow-hidden mt-16">
        <div className="fixed inset-0 w-full h-full bg-gradient-to-tr from-[#0f1b30] via-bg-transparent via-[#133c68] to-[#172756] -z-10"></div>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-bg-neutral/30 via-bg-secondary/30 to-bg-accent/30 opacity-10 animate-[pulse_7s_ease-in-out_infinite] blur-xl"></div>
        <div className="relative">
          <div className="shadow-full backdrop-blur-sm rounded-2xl p-6 bg-[#1E293B] border-2 border-opacity-20 border-white/20 bg-gradient-to-br from-white/10 to-white/5">
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-center mb-6 text-[#c8cbd0]">
                {projectTitle}
              </h1>
              <h2 className="text-center mb-7 mx-auto text-[#c8cbd0]">
                join Whitelist
              </h2>
              <p className="text-center mb-6 text-[#c8cbd0]">
                Fill in the form to be eligible for the whitelist
              </p>

              <form>
                <label className="bg-[#1E293B] mb-4 text-[#c8cbd0] input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                  </svg>
                  <input
                    type="text"
                    className="grow"
                    placeholder="Full name"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>

                <label className="bg-[#1E293B] mb-4 text-[#c8cbd0] input input-bordered flex items-center gap-2">
                  {isCheckingEmail === true ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                  )}
                  <input
                    type="text"
                    className="grow text-[#c8cbd0]"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                {/* this modal is hidden unless we call modal.showModal() */}
                <dialog
                  id="alertDialog"
                  className="modal modal-bottom sm:modal-middle"
                >
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

                <dialog id="emailOTPModal" className="modal">
                  {/* don't show OTP modal until isOTPTimedOut is not null (OTP has been sent) */}
                  {isOTPTimedOut !== null && (
                    <div
                      id="modalContent"
                      className="modal-box backdrop-blur-lg transition-all duration-300 bg-transparent"
                    >
                      <h3 className="font-bold text-lg text-[#c2c5ca]">
                        Email Verification
                      </h3>
                      <p className="py-1 text-sm">
                        {isOTPTimedOut === true ? (
                          "OTP timed out!"
                        ) : (
                          <OTPTimer
                            minutes={parseInt(
                              process.env.NEXT_PUBLIC_OTP_TTL_MINUTES || "5"
                            )}
                          />
                        )}
                      </p>
                      <br />
                      <p className="py-4 text-[#c2c5ca]">
                        Enter the 6-digit OTP sent to your email:
                      </p>
                      <form className="flex flex-col items-center">
                        <div className="flex space-x-3 mb-4">
                          {[...Array(6)].map((_, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength={1}
                              className="w-12 h-12 text-center text-2xl text-base-content border bg-base-300 rounded-md"
                              required
                              disabled={isOTPVerifying || isOTPTimedOut}
                              onKeyUp={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.value.length === 1) {
                                  const nextSibling =
                                    target.nextElementSibling as HTMLInputElement | null;
                                  let newOtp =
                                    OTP.slice(0, index) +
                                    target.value +
                                    OTP.slice(index + 1);
                                  newOtp = newOtp.trim();
                                  setOTP(newOtp);
                                  if (nextSibling) {
                                    nextSibling.focus();
                                  }
                                } else if (target.value.length === 0) {
                                  const previousSibling =
                                    target.previousElementSibling as HTMLInputElement | null;
                                  if (previousSibling) {
                                    previousSibling.focus();
                                  }
                                }
                              }}
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(
                                  /[^0-9a-zA-Z]/g,
                                  ""
                                );
                              }}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary text-[#061f2d] bg-[#38bdf8] hover:bg-[#0b729e]"
                          disabled={isOTPVerifying || isOTPTimedOut === true}
                          onClick={handleOTPSubmit}
                        >
                          Verify OTP
                        </button>
                      </form>

                      {/* Option to resend OTP after OTP has expired */}
                      {isOTPTimedOut === true && (
                        <p className="justify-between text-center py-4 text-sm">
                          Didnt receive OTP?
                          <a
                            onClick={handleResendOTP}
                            className="font-bold hover:underline text-success cursor-pointer"
                          >
                            {" "}
                            Resend OTP
                          </a>
                        </p>
                      )}
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn bg-[#0c1425] text-[#b7bac1] hover:text-black">
                            Close
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </dialog>

                <button
                  type="button"
                  onClick={handleVerifyEmailClick}
                  disabled={
                    isEmailVerified === true || isCheckingEmail === true
                  }
                  className={`mb-6 mt-2 px-4 py-2 rounded-md flex items-center justify-center border border-black ${isEmailVerified
                    ? "bg-white text-black"
                    : "bg-white text-black hover:bg-gray-100"
                    }`}
                >
                  {isEmailVerified ? (
                    <div className="flex items-center justify-center space-x-2">
                      <p className="mr-2">Email Verified</p>
                      <CiCircleCheck />
                    </div>
                  ) : isSendingOTP === true ? (
                    <span className="loading loading-ring loading-md">
                      sending OTP
                    </span>
                  ) : (
                    "Verify Email"
                  )}
                </button>
                <div className="mb-6">
                  <label className="block mb-2 font-bold text-lg text-[#c8cbd0]">
                    Connect your social accounts for identity verification:
                  </label>
                  <div className="flex flex-wrap justify-center gap-2">
                    {socialConnects.map((social) => (
                      <button
                        key={social.name}
                        type="button"
                        onClick={() => handleSocialConnect(social.name)}
                        className="flex items-center text-[#c8cbd0] justify-center p-2 border rounded-full hover:text-black hover:bg-gray-100 transition-colors w-[130px]"
                      >
                        <Image
                          src={social.icon}
                          alt={social.name}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                        <span className="ml-2 text-sm">{social.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium text-[#c8cbd0]">
                    Proof of engagement
                  </label>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-700 rounded-full p-2">
                            <XMarkIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white">{task.description}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleVerifyTasks(task.id)}
                          className={`px-4 py-2 rounded-md ${task.verified
                            ? "bg-gray-700 text-gray-400"
                            : "bg-white text-black"
                            }`}
                          disabled={task.verified}
                        >
                          {task.verified ? "Verified" : "Start"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#1E293B] text-[#c8cbd0] rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2dd4bf] hover:bg-[#388c82] text-[#0d473f] rounded-md"
                    onClick={handleSubmitWhitelist}
                  >
                    {isCallingJoinWhitelist || isCallingApprove
                      ? <span className="loading loading-spinner text-success"></span>
                      : <span>Continue</span>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div >
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-[#c2c5ca]">WHITELIST GUIDE</h2>
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-px bg-gray-300"></div>
            ))}
          </div>
        </div>
      </div >
    </>
  );
}
