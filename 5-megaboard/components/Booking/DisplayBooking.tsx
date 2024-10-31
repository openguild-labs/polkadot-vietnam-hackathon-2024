"use client";
import React, { useState } from "react";
import BillboardGrid from "./BillboardGrid";
import FilterBillBoard from "./FilterBillBoard";
import { Billboard } from '@/lib/type';
import { sampleData } from "@/lib/SampleData"; // Assuming your sample data is imported here

const DisplayBooking = ({data}: {data: Billboard[]}) => {
  const [filteredData, setFilteredData] = useState<Billboard[]>(data);

  // Function to filter the billboard data
  const handleFilter = (filters: any) => {
    const { country, region, priceRange, sizeRange } = filters;

    const filtered = data.filter((billboard) => {
      const isCountryMatch = !country || billboard.country === country;
      const isCityMatch = !region || billboard.city === region;
      const isPriceMatch =
        !priceRange ||
        (billboard.price!>= priceRange[0] && billboard.price! <= priceRange[1]);
      //   const sizeInSqFt = parseInt(billboard.size.split('x').reduce((a, b) => a * b, 1)); // Calculate the size in square feet
      //   const isSizeMatch =
      //     !sizeRange
      //     ||
      //     (sizeInSqFt >= sizeRange[0] && sizeInSqFt <= sizeRange[1]);

      // Return true only when all the selected filters match, otherwise ignore the filter
      return isCountryMatch && isCityMatch && isPriceMatch;
    });

    setFilteredData(filtered);
  };

  return (
    <div className="w-full min-h-screen flex">
      <div className="w-[20%] backdrop-blur-lg">
        <FilterBillBoard onFilter={handleFilter} />
      </div>
      <div className="w-[80%]">
        <BillboardGrid dataCard={filteredData} />
      </div>
    </div>
  );
};

export default DisplayBooking;
