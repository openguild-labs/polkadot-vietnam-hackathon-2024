"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NFTModel, UpdatedIMG } from "@/components";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";  // Import axios

function Index() {
  const router = useRouter();
  const [nftList, setNFTS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Managing loading state

  // Function to fetch NFT data from the API using axios
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/get-tokens', {
          params: {
            collectionId: 4122,  // Sending collectionId as query parameter
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        // Setting the fetched NFTs data to state
        setNFTS(response.data.tokens); 
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching NFT data:', error);
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchNFTs();
  }, []); // Runs once when the component mounts

  const backClick = () => {
    router.back();
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white">
      <p
        onClick={() => backClick()}
        className="absolute left-5 top-5 hover:-translate-x-2 w-[40px] h-[40px] bg-[#E2EAB0] rounded-xl flex justify-center items-center"
      >
        &#8592;
      </p>
      <div className="w-full h-[500px] bg-white">
        <UpdatedIMG name={"Background"} />
        <div className="flex w-full h-[250px] max-sm:pt-10 gap-2 items-end px-[10%] -translate-y-40">
          <UpdatedIMG name={"Avatar"} />
          <div className="h-[50px] flex justify-center items-center rounded-xl bg-gradient-to-br from-[#E55D87] to-[#5FC3E4]">
            <span className="text-black font-bold text-3xl max-sm:text-sm px-[10px] flex items-end">
              {`GNFT's Collection`}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full px-[5%] py-[5%] flex flex-col gap-10 justify-center items-center bg-white">
        <div className="text-black font-semibold w-[100%] justify-between flex items-center">
        </div>
        {loading === true && nftList === undefined ? (
          <CircularProgress color="success" />
        ) : (
          <div className="w-full flex flex-wrap px-20 gap-10 justify-center items-center">
            {nftList.map((e: any, index: number) => (
              <NFTModel key={index} nfts={e} isSell={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
