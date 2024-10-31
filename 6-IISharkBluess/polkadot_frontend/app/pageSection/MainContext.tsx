import React, { useMemo } from 'react'
import { DashboardPage, FarmsPage, HomePage, NFTPage, TransactionPage } from '../components';

function MainContext({selectedPage}: {selectedPage: string}) {
  const handleSelectedContext = useMemo(() => {
    switch (selectedPage) {
      case "Home":
          return <HomePage/> 
        break;
      case "Farms":
          return <FarmsPage/>
        break;
      case "Dashboard":
          return <DashboardPage/>
        break;
      case "Transactions":
          return <TransactionPage/>
        break;
      case "NFT":
          return <NFTPage/>
        break;
      default:
        return <HomePage/> 
        break;
    }
  }, [selectedPage])
  return (
    handleSelectedContext
  )
}

export default MainContext