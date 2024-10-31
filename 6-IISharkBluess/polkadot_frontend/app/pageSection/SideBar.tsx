import { Menu } from "@/types/common.type";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { menuList,  } from "@/const";
import { socialList } from "@/const/menu.const";

function SideBar({
  selectedPage,
  setSelectedPage,
}: {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}) {
  return (
    <div className="w-[20%] h-full flex flex-col justify-between p-5 border-r-[1px] border-white">
      <div className="w-full h-[60%] justify-between flex flex-col">
        {menuList.map((item: Menu) => (
          <div
            onClick={() => setSelectedPage(item.name)}
            className={`h-[20%] w-full flex items-center gap-3 rounded-xl text-white p-5 cursor-pointer ${selectedPage === item.name ? "transition ease-in-out delay-150 bg-green-400 duration-300" : ""}`}
          >
            <img src={item.icon} alt={item.name} className="w-10 h-10" />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <div className="w-full h-[35%] flex flex-col gap-2">
        <div className="w-full h-[80%] relative">
          <img
            src="./images/nft_n0vagen.png"
            alt="nft_n0vagen"
            className="w-full h-full object-cover rounded-xl"
          />
          <div
            className="absolute h-full top-0 left-0 px-5 py-2 flex flex-col justify-between cursor-pointer"
            onClick={() => setSelectedPage("NFT")}
          >
            <span className="font-semibold">NFT Lastest</span>
            <div className="h-[60%]">
              <img
                src="./images/IISharkBluess_logo_v2.png"
                alt="SharkBluess_logo"
                className="w-[82%] h-16 object-cover rounded-full"
              />
              <span className="font-semibold text-3xl">32.5%</span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-400">Follow us</span>
          <ul className="flex gap-3">
            {
              socialList.map((item) => (
                <FontAwesomeIcon icon={item} className="text-gray-500"/>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
