"use client"
import React from 'react'
import FilterNft from './FilterNft'
import NftGrid from './NftGrid'
import { sampleData } from '@/lib/SampleData'
import { Billboard } from '@/lib/type'
const DisplayNft = ({data}:{data:Billboard[]}) => {
    const handleFilter = (filters: any) => {

    }
  return (
    <div className="w-full min-h-screen flex">
    <div className="w-[20%] backdrop-blur-lg">
      <FilterNft onFilter={handleFilter} />
    </div>
    <div className="w-[80%]">
      <NftGrid  dataCard={data}/>
    </div>
  </div>
  )
}

export default DisplayNft
