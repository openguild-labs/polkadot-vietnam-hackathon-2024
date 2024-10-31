import React, { useEffect, useState } from "react";
import Link from "next/link";
import logo from "../../public/Logo/DL_Logo.png";
import {
  RectangleStackIcon,
  CommandLineIcon,
  XMarkIcon,
  Bars3Icon,
  FireIcon,
} from "@heroicons/react/24/solid";
import { DollarCircleOutlined } from "@ant-design/icons";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import Image from "next/image";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Link href={href || "#"} passHref>
        <span className="flex items-center gap-2 font-medium">{children}</span>
      </Link>
    </li>
  );
}

interface NavbarProps {
  backgroundColor?: string;
  isOwner?: boolean;
}

export function Navbar({
  backgroundColor = "transparent",
  isOwner,
}: NavbarProps) {
  const [NAV_MENU, SET_NAV_MENU] = useState([
    {
      name: "My investment",
      icon: RectangleStackIcon,
      href: "/investment",
    },
    {
      name: "Swap",
      icon: DollarCircleOutlined,
      href: "/swap",
    },
    {
      name: "Launchpad",
      icon: CommandLineIcon,
      href: "/launchpad",
    },
  ]);

  const userAddress = useAddress();

  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleOpen = () => setOpen((cur) => !cur);

  useEffect(() => {
    const checkProjectOwner = async () => {
      const owner = (await axios.post("/api/identity", { userAddress })).data;
      console.log(owner);
      if (owner) {
        SET_NAV_MENU((prevMenu) => [
          {
            name: "My project",
            icon: FireIcon,
            href: "/myProject",
          },
          ...prevMenu,
        ]);
      }
    };
    checkProjectOwner();
  }, [userAddress]);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    // Đăng ký sự kiện scroll khi component được mount
    window.addEventListener("scroll", handleScroll);

    // Cleanup sự kiện khi component bị unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolling ? "bg-[#0b162d] bg-opacity-100" : "bg-transparent"
        }`}
    // style={{ backgroundColor }}
    >
      <div className="container mx-auto flex items-center justify-between py-2 ">
        <Link href="/" passHref>
          <span className="flex items-center text-lg font-bold text-white  transition-transform transform hover:-translate-y-1 duration-300">
            <Image src={logo} alt="logo" width={32} height={32} />
            <span className="ml-2">Defrost Launcher</span>
          </span>
        </Link>
        <ul className="ml-10 hidden items-center gap-6 lg:flex text-white">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <div className="flex items-center transition-transform transform hover:-translate-y-1 duration-300">
                <Icon className="h-5 w-5 mr-2" />
                <span>{name}</span>
              </div>
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-4 lg:flex">
          <ConnectWallet />
        </div>
        <button
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden text-white"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </button>
      </div>
      {open && (
        <div className="container mx-auto mt-2 rounded-lg bg-white px-6 py-5 mb-5">
          <ul className="flex flex-col gap-4 text-gray-900">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
