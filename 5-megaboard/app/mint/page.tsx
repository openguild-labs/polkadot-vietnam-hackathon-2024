"use client";
import React, { useEffect } from "react";
import { Form, Input, message } from "antd";
import CustomButton from "@/components/Button/CustomButton";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import {
  CONTRACT_NFT_ADDRESS_MOONBEAM,
  BLOCK_EXPLORER_MOONBEAM,
  BLOCK_EXPLORER_BAOBAB,
  CHAINID,
 
} from "@/components/contract";
import { erc20Abi } from "@/components/erc20-abi";
import { readContract } from "@wagmi/core";
import { config } from "../config";

const MintPage = () => {
  const account = useAccount();
  const chainId = useChainId();
  const [form] = Form.useForm();
  const { data: hash, writeContract } = useWriteContract();

  let blockexplorer: string;
  let tokenAddress: `0x${string}`;
  console.log(chainId)

  switch (chainId) {
    case CHAINID.BAOBAB:
      tokenAddress = CONTRACT_NFT_ADDRESS_MOONBEAM;
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;
    case CHAINID.MOONBEAM:
      tokenAddress = CONTRACT_NFT_ADDRESS_MOONBEAM;
      blockexplorer = BLOCK_EXPLORER_MOONBEAM;
      break;
    default:
      throw new Error("Network not supported");
  }
 

  const onFinish = async (values: any) => {
    try {
      console.log("Form values: ", values);
      if (!hash) {
        await writeContract({
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "mint_OOH_NFT",
          args: [values.walletUrl, values.mintUrl],
        });
      }
      message.success("Mint success");
    } catch (error) {
      console.error("Error in minting NFT:", error);
      message.error("Failed to mint NFT. Please try again.");
    }
  };

  useEffect(() => {
    if (hash) {
      message.success("Transaction sent successfully!");
    }
  }, [hash]);

  const handleButtonClick = () => {
    form.submit();
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
      <Form
        form={form}
        name="mint_form"
        layout="vertical"
        onFinish={onFinish}
        style={{
          padding: "24px",
          color: "white",
        }}
        className="w-full max-w-lg shadow-lg rounded-xl bg-opacity-90 backdrop-blur-lg"
      >
        <span className="text-lg">Enter Wallet and Mint URLs</span>

        {/* Wallet URL */}
        <Form.Item
          name="walletUrl"
          label={<label style={{ color: "white" }}>Wallet URL</label>}
          rules={[{ required: true, message: "Please input the wallet URL!" }]}
        >
          <Input placeholder="Enter wallet URL" />
        </Form.Item>

        {/* Mint URL */}
        <Form.Item
          name="mintUrl"
          label={<label style={{ color: "white" }}>Mint URL</label>}
          rules={[{ required: true, message: "Please input the mint URL!" }]}
        >
          <Input placeholder="Enter mint URL" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBottom: "0px" }}>
          <CustomButton content="Mint" onclick={handleButtonClick} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default MintPage;
