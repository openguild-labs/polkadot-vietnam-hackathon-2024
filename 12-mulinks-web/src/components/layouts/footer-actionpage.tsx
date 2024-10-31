import {
  IconBrandDiscordFilled,
  IconInfoCircleFilled,
  IconPuzzleFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function FooterActionpage() {
  return (
    <div className=" dark:bg-black pt-8 px-4">
      <div className="container ">
        <div className="flex flex-col-reverse items-center justify-between gap-6 truncate py-2 lg:flex-row lg:gap-4">
          <span className="text-subtext font-semibold text-tertiary">
            Made with ♥︎ by Weminal labs.
          </span>
          <div className="flex flex-col items-center justify-between gap-3 text-text font-semibold text-primary lg:flex-row lg:gap-10">
            <Link
              href={"#"}
              className="flex gap-1.5 transition-colors hover:text-primary/80"
            >
              <IconInfoCircleFilled />
              What are Assetlinks ?
            </Link>
            <Link
              href={"#"}
              className="flex gap-1.5 transition-colors hover:text-primary/80"
            >
              <IconPuzzleFilled />
              Try out the extension
            </Link>
            <Link
              href={"#"}
              className="flex gap-1.5 transition-colors hover:text-primary/80"
            >
              <IconBrandDiscordFilled />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
