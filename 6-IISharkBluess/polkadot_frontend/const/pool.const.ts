import { Token } from "@/types";
import * as dotenv from "dotenv";
dotenv.config();

export const chainList = [
  {
    label: "solana",
    symbol: "SOL",
    decimals: 18,
  },
  {
    label: "ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  {
    label: "tether",
    symbol: "USDT",
    decimals: 6,
  },
  {
    label: "usd-coin",
    symbol: "USDC",
    decimals: 6,
  },
];

export const standard_uint: number = 18;
export const health_ratio_thread: number = 1.2;
export const lendingTimeList = [
  { label: "1 Hour", value: "1800" },
  { label: "1 Day", value: "3600" },
  { label: "5 Days", value: "18000" },
  { label: "15 Days", value: "54000" },
  { label: "1 Month", value: "108000" },
];
