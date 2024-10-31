import { useStore } from "@/store/useStore";
import { useMemo } from "react";
import axios from 'axios';

export default async function updatePriceFeeds(token: any) {
  let price = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
  )
    .then((response) => response.json())
    .then((data) => {
      switch (token) {
        case "ethereum":
          const eth_price = Number(data.ethereum.usd);
          return eth_price;
          break;
        case "solana":
          const sol_price = Number(data.solana.usd);
          return sol_price;
          break;
        case "tether":
          const usdt_price = Number(data.tether.usd);
          return usdt_price;
          break;
        case "usd-coin":
          const usdc_price = Number(data.tether.usd);
          return usdc_price;
          break;
        default:
          return Number(0);
          break;
      }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });

  return price;
}

export const updatePriceList = (token: string) => {
  fetch(
    `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=usd&days=1`
  )
    .then((response) => response.json())
    .then((data) => {
      const price_list = data.prices.map((item: any) => {
        item[1];
      });
      return price_list;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};


// Define the API URL

// Function to fetch and log the Ethereum price
export async function fetchEthPrice(name: string) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${name}&vs_currencies=usd`;
    try {
        const response = await axios.get(url);
        const ethPrice = response.data.ethereum.usd;
        console.log(`The current price of Ethereum is $${ethPrice}`);
    } catch (error) {
        console.error("Error fetching price:", error);
    }
}

// Set an interval to fetch the price every 10 seconds