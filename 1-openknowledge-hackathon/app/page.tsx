"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

export default function Home() {
  const router = useRouter();
  const [acc, setAcc] = useState("");
  console.log(acc,"acc")

  useEffect(() => {
    const getAccounts = async () => {
      const allInjected = await web3Enable('filesharing dapp');
      const allAccounts = await web3Accounts();
      setAcc(allAccounts[0].address);
    };

    getAccounts();
  }, []);

  useEffect(() => {
  if(acc) {
      router.push("/dashboard");
    }
  }, [ acc, router]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Share knowledge on &nbsp;</h1>
        <h1 className={title({ color: "violet" })}>Polkadot&nbsp;</h1>
        <br />
        <h1 className={title()}>effortlessly</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Built using Apillon SDK.
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Connect to SubWallet
          </span>
        </Snippet>
      </div>
    </section>
  );
}
