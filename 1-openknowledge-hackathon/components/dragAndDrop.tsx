import React, { useRef, useState } from "react";

const DragAndDrop = ({
  walletAddress,
  setUploading,
}: {
  walletAddress: string;
  setUploading: any;
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (selectedFile) {
      // Handle file upload here
      console.log("Uploading file:", selectedFile);
      setUploading(true);

      await uploadFile(selectedFile, walletAddress);
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div
          className="w-80 h-48 border-2 border-dashed border-gray-400 rounded-md flex justify-center items-center text-center p-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {selectedFile ? (
            //@ts-ignore
            <p>{selectedFile.name}</p>
          ) : (
            <p>Drag & drop a file here, or click to select one</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default DragAndDrop;

const uploadFile = async (file: File, walletAddress: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("walletAddress", walletAddress);

  try {
    const response = await fetch("/api/apillon/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    console.log("File uploaded successfully:", data.file);
    // fidn directoryUuid in localStorage
    const directoryUuid = localStorage.getItem(walletAddress);
    console.log("directoryUuid", directoryUuid);
    if (directoryUuid !== data.file.directoryUuid) {
      localStorage.setItem(walletAddress, data.file.directoryUuid);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
