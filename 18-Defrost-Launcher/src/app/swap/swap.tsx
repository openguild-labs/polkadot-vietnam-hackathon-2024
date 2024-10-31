"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { MdOutlineSwapVert } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

interface Token {
  id: string;
  name: string;
  balance: string;
  icon: string;
}

const tokens: Token[] = [
  {
    id: "bnc",
    name: "BNC",
    balance: "0.0000",
    icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/8705.png",
  },
  {
    id: "vDOT",
    name: "vDOT",
    balance: "0.0000",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYQ9K6zFSwvIkdn8d68FcOJBynds95nZ5OVw&s",
  },
  {
    id: "vsDOT",
    name: "vsDOT",
    balance: "0.0000",
    icon: "https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/wwwnotionso-image-s3-us-west-2amazonawscom-securenotion-staticcom-115d1241-1f80-4ddf-95b9-86f13a0f04c4-capture_decran_2023-03-05_a_160004png/public",
  },
  {
    id: "usdt",
    name: "USDT",
    balance: "0.0000",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
];

const SwapPage = () => {
  const [selectedTokenPay, setSelectedTokenPay] = useState<Token>(tokens[1]);
  const [selectedTokenReceive, setSelectedTokenReceive] = useState<Token>(
    tokens[1]
  );
  const [amountIn, setAmountIn] = useState<number>(0);
  const [amountOut, setAmountOut] = useState<number>(0);
  const onTokenPayChange = (token: Token) => {
    setSelectedTokenPay(token);
  };
  const onTokenReceiveChange = (token: Token) => {
    setSelectedTokenReceive(token);
  };

  return (
    <div className="flex justify-center min-h-screen bg-primary">
      <div className="mt-14 w-11/12 md:w-3/5 mx-auto">
        <div className="border rounded-xl bg-white shadow-lg">
          <h1 className="pl-7 pt-4 pb-4 text-xl md:text-2xl font-semibold border-b-2">
            Swap
          </h1>

          <div className="pl-4 md:pl-16 pt-10 text-lg ">
            Pay
            <div className="flex justify-center">
              <div className="relative border border-[#EEEEEE] rounded-full w-full md:w-3/5 h-12 shadow-sm">
                <div className="flex items-center absolute left-0 pt-2 pl-5">
                  <Image
                    src={selectedTokenPay.icon}
                    alt={selectedTokenPay.name}
                    width={24}
                    height={24}
                    className="mr-2 rounded-full"
                  />
                </div>
                <div className="absolute left-4 pl-24 pb-4 ml-4">
                  <input
                    placeholder="input"
                    type="number"
                    className="border-none focus:outline-none focus:ring-0 w-15 h-11 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="absolute right-0 pt-1 mr-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">
                        {selectedTokenPay.name}
                        <IoMdArrowDropdown />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu className="absolute right-0 top-full w-64 max-h-48 overflow-y-auto border rounded-lg shadow-lg bg-white">
                      {tokens.map((token) => (
                        <DropdownItem
                          key={token.id}
                          className="flex items-center justify-between px-4 hover:bg-gray-100 cursor-pointer"
                          onClick={() => onTokenPayChange(token)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="">
                              <Image
                                src={token.icon}
                                alt={token.name}
                                width={24}
                                height={24}
                                className="mr-2 rounded-full"
                              />
                              <span>{token.name}</span>
                            </div>
                            <span>{token.balance}</span>
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="pt-8 ">
                <MdOutlineSwapVert />
              </span>
            </div>
            Receive
            <div className="flex justify-center">
              <div className="relative border border-[#EEEEEE] rounded-full w-full md:w-3/5 h-12 shadow-sm">
                <div className="flex items-center absolute left-0 pt-2 pl-5">
                  <Image
                    src={selectedTokenReceive.icon}
                    alt={selectedTokenReceive.name}
                    width={24}
                    height={24}
                    className="mr-2 rounded-full"
                  />
                </div>
                <div className="absolute left-4 pl-24 pb-4 ml-4">
                  <div className="border-none focus:outline-none focus:ring-0 w-72 h-11 mt-2">
                    ${amountOut}
                  </div>
                </div>
                <div className="absolute right-0 pt-1 mr-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">
                        {selectedTokenReceive.name}
                        <IoMdArrowDropdown />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu className="absolute right-0 top-full w-64 max-h-48 overflow-y-auto border rounded-lg shadow-lg bg-white">
                      {tokens.map((token) => (
                        <DropdownItem
                          key={token.id}
                          className="flex items-center justify-between px-4 hover:bg-gray-100 cursor-pointer"
                          onClick={() => onTokenReceiveChange(token)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="">
                              <Image
                                src={token.icon}
                                alt={token.name}
                                width={24}
                                height={24}
                                className="mr-2 rounded-full"
                              />
                              <span>{token.name}</span>
                            </div>
                            <span>{token.balance}</span>
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            {/* Swap summary */}
            <div className="py-9 flex justify-center">
              <Button className="rounded-[10px] w-32 bg-primary text-[#fefefe] transition duration-300 ease-in-out hover:bg-[#203e6a] hover:text-[#fefefe] ">
                Swap
              </Button>
            </div>
            <div className="border bg-[#f1f1f1] rounded-xl p-5 mx-4 md:mx-0 md:mr-16 mb-10">
              <div className="flex justify-between pl-5 pr-5">
                <span>Price</span>
                <span>5 DOT</span>
              </div>
              <div className="flex justify-between pl-5 pr-5 pt-5">
                <span>Price</span>
                <span>5 VDOT</span>
              </div>

              <div className="flex justify-between pl-5 pr-5 pt-5">
                <span>Price Impact</span>
                <span>0.8917489</span>
              </div>

              <div className="flex justify-between pl-5 pr-5 pt-5">
                <span>Liquidity Provider Fee</span>
                <span>5 VDOT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
