"use client"
import React, { useState } from 'react';
import HF1 from '@/assets/story/hackfi_1.png';
import HF2 from '@/assets/story/hackfi_2.png';
import HF3 from '@/assets/story/hackfi_3.png';
import HF4 from '@/assets/story/hackfi_4.png';

const images = [HF1, HF2, HF3, HF4];

const StoryPage: React.FC = () => {
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to handle navigation
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative">
        {/* Display the current image */}
        <img
          src={images[currentImageIndex].src}
          alt={`HackFi Story ${currentImageIndex + 1}`}
          className="h-[500px] w-auto object-contain rounded-lg shadow-lg"
        />
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center mt-4 space-x-2">
      <button
          onClick={() => handleImageChange(Math.max(0, currentImageIndex - 1))}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentImageIndex === 0}
        >
          Prev
        </button>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
            className={`px-4 py-2 border rounded ${
              currentImageIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black'
            }`}
          >
            {index + 1}
          </button>
        ))}
           <button
          onClick={() => handleImageChange(Math.min(images.length - 1, currentImageIndex + 1))}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentImageIndex === images.length - 1}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default StoryPage;