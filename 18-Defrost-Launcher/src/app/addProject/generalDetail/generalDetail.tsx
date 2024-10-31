"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CiImageOn } from "react-icons/ci";
import { Button } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { updateGeneralDetailPageData } from "@/lib/store/formSlice";
import { useRouter } from "next/navigation";
import { useChain } from "@thirdweb-dev/react";
import { chainConfig } from "@/config";

const GeneralDetail = () => {
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [selectedCoinIdx, setSelectedCoinIdx] = useState<number>(0);
  const [imageByteArrays, setImageByteArrays] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRefLogo = useRef<HTMLInputElement | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const route = useRouter();
  const dispatch = useDispatch();
  const updateData = useSelector((state: any) => state.form.generalDetailData);
  const [vAssets, setVAssets] = useState<Record<string, any>[]>([]);
  const chain = useChain();

  const base64ToByteArray = (base64: string) => {
    const base64String = base64.split(",")[1];
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const formatByteArray = (byteArray: Uint8Array) => {
    return `{${Array.from(byteArray).join(", ")}}`;
  };

  useEffect(() => {
    if (!chain) {
      return;
    }
    const chainId: number = chain.chainId;
    const vAssets =
      chainConfig[chainId.toString() as keyof typeof chainConfig].vAssets;
    setSelectedCoin(vAssets[0].address);
    setVAssets(vAssets);
  }, [chain]);

  const handleSelectCoin = (coinAddr: string, idx: number) => {
    setSelectedCoinIdx(idx);
    setSelectedCoin(coinAddr);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const imageUrls: string[] = [];
    const byteArrays: string[] = [];

    const promises = Array.from(files).map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const base64 = reader.result as string;
            imageUrls.push(base64);

            const byteArray = base64ToByteArray(base64);
            const formattedByteArray = formatByteArray(byteArray);
            byteArrays.push(formattedByteArray);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(() => {
      setSelectedImages(imageUrls);
      setImageByteArrays(byteArrays);
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const imageUrls: string[] = [];
    const byteArrays: string[] = [];

    const promises = Array.from(files).map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const base64 = reader.result as string;
            imageUrls.push(base64);

            const byteArray = base64ToByteArray(base64);
            const formattedByteArray = formatByteArray(byteArray);
            byteArrays.push(formattedByteArray);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(() => {
      setSelectedLogo(imageUrls);
      setImageByteArrays(byteArrays);
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerFileInputLogo = () => {
    if (fileInputRefLogo.current) {
      fileInputRefLogo.current.click();
    }
  };

  const handleSubmit = () => {
    const formDatas = {
      selectedCoin,
      selectedImages,
      selectedLogo,
      projectTitle,
      shortDescription,
      longDescription,
    };
    setIsLoading(true);
    dispatch(updateGeneralDetailPageData(formDatas));
    setIsLoading(false);
    route.push("/addProject/promotion");
  };

  return (
    <div className="flex justify-center min-h-screen bg-primary px-4">
      {/* <div className="absolute left-3 top-20 w-[600px] h-[600px] bg-[#0047FF] rounded-full opacity-10 blur-3xl animate-pulse z-0"></div>
      <div className="absolute right-3 bottom-10 w-[600px] h-[600px] bg-[#0047FF] rounded-full opacity-10 blur-3xl animate-pulse z-0"></div> */}

      <div className="w-full lg:w-3/5 mx-auto z-10">
        <div className="mt-12 mb-6 text-2xl font-bold text-white">
          Choose accepted asset
        </div>
        <div className="border border-black rounded-2xl h-auto mb-12 bg-white p-2">
          <div className="flex flex-wrap items-center ml-3 mb-4 mt-4">
            {vAssets.map((vAsset, idx) => (
              <Button
                key={idx}
                className={`btn text-accent rounded-full mb-2 ${selectedCoinIdx === idx
                  ? "bg-gradient-to-r from-cyan-500 to-accent w-32 mr-4"
                  : "bg-gray w-32 mr-4"
                  }`}
                onClick={() => handleSelectCoin(vAsset.address, idx)}
              >
                <Image
                  src="https://www.stakingrewards.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstakingrewards-static%2Fimages%2Fassets%2Fproduction%2Fbifrost-voucher-astr_logo.png%3Fv%3D1717150606436&w=3840&q=75"
                  alt={`${vAsset.name} logo`}
                  width={24}
                  height={24}
                  className="mr-2 rounded-full"
                />
                <span className="text-black text-lg font-normal">
                  {vAsset.symbol}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-12 mb-6 text-2xl font-bold text-white">
          General Detail
        </div>

        <div className="border border-black rounded-2xl h-auto mb-12 bg-white p-4">
          <div className="flex items-center">
            <label className="cursor-pointer flex items-center space-x-2">
              <CiImageOn className="w-8 h-8" />
              {selectedImages.length > 0 ? (
                <span></span>
              ) : (
                <span className="text-gray-500">Upload your image</span>
              )}
            </label>
            <div className="flex space-x-2">
              {selectedImages.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Selected ${index + 1}`}
                  className="w-20 h-10"
                  width={40}
                  height={40}
                />
              ))}
            </div>

            <Button
              className="bg-neutral text-white py-2 px-4 rounded-full ml-auto"
              onClick={triggerFileInput}
            >
              Upload
            </Button>

            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <hr className="border border-black w-full my-5"></hr>
          <div className="flex items-center">
            <label className="cursor-pointer flex items-center space-x-2">
              <CiImageOn className="w-8 h-8" />
              {selectedLogo.length > 0 ? (
                <span></span>
              ) : (
                <span className="text-gray-500">Upload your Logo image</span>
              )}
            </label>
            <div className="flex space-x-2">
              {selectedLogo.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Selected ${index + 1}`}
                  className="w-20 h-10"
                  width={40}
                  height={40}
                />
              ))}
            </div>

            <Button
              className="bg-neutral text-white py-2 px-4 rounded-full ml-auto"
              onClick={triggerFileInputLogo}
            >
              Upload
            </Button>

            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRefLogo}
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>

          <hr className="border border-black w-full my-5"></hr>
          <div className="my-6 w-full flex flex-col space-y-4">
            <input
              type="text"
              className="border border-black rounded-2xl h-12 text-lg pl-5 w-full"
              placeholder="Project Title"
              onChange={(e) => setProjectTitle(e.target.value)}
            />
            <input
              type="text"
              className="border border-black rounded-2xl h-12 text-lg pl-5 w-full"
              placeholder="Short Description"
              onChange={(e) => setShortDescription(e.target.value)}
            />
            <textarea
              className="border border-black rounded-2xl h-[200px] text-lg pl-5 w-full resize-y textarea"
              placeholder="Long Description"
              onChange={(e) => setLongDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            className="mt-5 bg-neutral text-white w-full mx-auto p-3 text-lg rounded-2xl mb-10"
            type="submit"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralDetail;
