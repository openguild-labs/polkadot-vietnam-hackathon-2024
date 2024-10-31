'use client'
import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateNFTs } from "@/script/action/signer/signerAction";

function Banner() {
   const [nfts, setNFTs] = useState<any[]>([])
   const dispatch = useDispatch()

   const nftList = [
      "./images/bannerIMG/angle.png",
      "./images/bannerIMG/CHRISTIAN.png",
      "./images/bannerIMG/EvijanWatson.png",
      "./images/bannerIMG/darkMonkey.png",
      "./images/bannerIMG/Hedgie.png",
   ];

   const sponsorList = [
      {
         img: "./images/sponsorIMG/open-guild.png",
         name: "Open Guild",
      },
      {
         img: "./images/sponsorIMG/unique-network.png",
         name: "Unique network",
      },
      {
         img: "./images/sponsorIMG/VBI.png",
         name: "VBI",
      },
      {
         img: "./images/sponsorIMG/ethereum.png",
         name: "Ethereum",
      },
      {
         img: "./images/sponsorIMG/polkadot.png",
         name: "Polkadot",
      },
   ];
      
   return (
      <div id="Home" className=" w-full z-30 justify-center items-center flex flex-col text-white border-x-4 border-[#F7F7F9] p-[5%] gap-10 ">
         <p className=" text-5xl text-center px-[15%]">
            Your first step into the NFT world with zero fee.
         </p>
         <p className=" text-sm px-[30%] text-center">
            Explore a wide variety of unique and one-of-a-kind digital assets, verified on
            the blockchain for ownership and scarcity
         </p>
         <div className=" flex gap-5 text-xl justify-center items-center ">
            {/* add fetch nft collection by wallet address */}
            <Link href={`/nftCollection/`} className=" bg-[#2CAFBF] px-5 py-3 rounded-full"> 
               NFT Collection
            </Link>
            <Link href={"/nftCreation"} className=" cursor-pointer">Create NFT</Link>
         </div>
         <Wrapper>
            <Marquee>
               <MarqueeGroup>
                  {nftList.map((e, index) => (
                     <ImageGroup key={index}>
                        <Image src={e} />
                     </ImageGroup>
                  ))}
               </MarqueeGroup>
               <MarqueeGroup>
                  {nftList.map((e, index) => (
                     <ImageGroup key={index}>
                        <Image className=" rounded-lg" src={e} />
                     </ImageGroup>
                  ))}
               </MarqueeGroup>
            </Marquee>
         </Wrapper>
         <div className=" w-full flex p-2 gap-[10%] items-center">
            {sponsorList.map((e, index) => (
               <div
                  key={index}
                  className=" flex gap-2 text-xl font-semibold justify-center items-center "
               >
                  <div className=" h-full w-[3vw]">
                     <img src={e.img} alt="" />
                  </div>
                  <p className=" text-center">{e.name}</p>
               </div>
            ))}
         </div>
      </div>
   );
}

export default Banner;

const Wrapper = styled.div`
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-direction: column;
`;

const Marquee = styled.div`
   display: flex;
   width: 1200px;
   height: 40vh;
   overflow: hidden;
   user-select: none;

   mask-image: linear-gradient(
      to right,
      hsl(0 0% 0% / 0),
      hsl(0 0% 0% / 1) 10%,
      hsl(0 0% 0% / 1) 90%,
      hsl(0 0% 0% / 0)
   );
`;

const scrollX = keyframes`
  from {
    left: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const common = css`
   flex-shrink: 0;
   display: flex;
   align-items: center;
   justify-content: space-around;
   white-space: nowrap;
   width: 100%;
   height: 100%;
   animation: ${scrollX} 30s linear infinite;
`;

const MarqueeGroup = styled.div`
   ${common}
`;

const ImageGroup = styled.div`
   display: grid;
   place-items: center;
   width: clamp(20rem, 1rem + 80vmin, 30rem);
   height: 90%;
   padding: calc(clamp(10rem, 1rem + 10vmin, 15rem) / 15);
`;

const Image = styled.img`
   object-fit: contain;
   width: 100%;
   height: 100%;
   /* border: 1px solid black; */
   border-radius: 0.5rem;
   aspect-ratio: 16/9;
   padding: 5px 20px;
   box-shadow: rgba(18, 13, 13, 0.2) 0px 2px 8px 0px;
`;
