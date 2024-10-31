import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export default function DropDown({
  network,
  setNetwork,
}: {
  network: string;
  setNetwork: (network: string) => void;
}) {
  const [icon, setIcon] = useState<string>("./images/ethereum.png");

  const handleNetwork = (_network: string, _icon: string) => {
    setNetwork(_network);
    setIcon(_icon)
  }
  return (
    <div className="w-52 text-right">
      <Menu>
        {network ? (
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
            <img
              src={icon}
              alt="Ethereum_icon"
              className="size-4 fill-white/30"
            />
            {network}
          </MenuButton>
        ) : (
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
            Network
            <ChevronDownIcon className="size-4 fill-white/60" />
          </MenuButton>
        )}

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={() => handleNetwork("Ethereum", "./images/ethereum.png")}
            >
              <img
                src="./images/ethereum.png"
                alt="Ethereum_icon"
                className="size-4 fill-white/30"
              />
              Ethereum
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘E
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={() => handleNetwork("Moonbeam Alpha", "./images/moonbeam_logo.png")}
            >
              <img
                src="./images/moonbeam_logo.png"
                alt="Solana_icon"
                className="size-4 fill-white/30"
              />
              Moonbeam Alpha
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘M
              </kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
