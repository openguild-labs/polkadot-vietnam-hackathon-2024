"use client";
import React from "react";
import { useRouter } from "next/navigation";

const InfoBar = () => {
  const route = useRouter();

  const toGeneralDetails = () => {
    route.push("/addProject/generalDetail");
  };

  const toPromotion = () => {
    route.push("/addProject/promotion");
  };

  const toPreview = () => {
    route.push("/addProject/preview");
  };

  return (
    <div className="mt-10 text-sm font-bold">
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-col md:flex-row divide-y md:divide-x w-full max-w-4xl shadow-lg">
          {/* General Details Button */}
          <button
            className="w-full md:w-1/3 text-center py-4 px-6 bg-white rounded-t-full md:rounded-t-none md:rounded-l-full  transition duration-300 hover:bg-gray-100"
            onClick={toGeneralDetails}
          >
            GENERAL DETAILS
          </button>

          {/* Promotion Button */}
          <button
            className="w-full md:w-1/3 text-center py-4 px-6 bg-white transition duration-300 hover:bg-gray-100"
            onClick={toPromotion}
          >
            PROMOTION
          </button>

          {/* Preview Button */}
          <button
            className="w-full md:w-1/3 text-center py-4 px-6 bg-white rounded-b-full md:rounded-b-none md:rounded-r-full transition duration-300 hover:bg-gray-100"
            onClick={toPreview}
          >
            PREVIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoBar;
