"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Button } from "@/components/ui/button";

async function fetchActionData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
}

export default function ActionPage() {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const placeholders = [
    "Enter an AssetLinks to unfurl it into a Blink",
    "Provide an AssetLinks to expand it into a Blink",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue) {
      try {
        const encodedInputValue = encodeURIComponent(inputValue);

        router.push(`/assetlinks/api-action=${encodedInputValue}`);
      } catch (error) {
        console.error("Error processing request:", error);
        setErrorMessage("Error processing request");
      }
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="w-[80%] xl:w-[55%] h-[9%] flex items-center justify-center mb-8">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
