'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ShitCoffee from '@/assets/two-guns.png'

const ImageDropEffect = () => {
  const [images, setImages] = useState<{ x: number; y: number; key: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newImage = {
        x: e.clientX,
        y: e.clientY,
        key: Date.now(),
      };
      setImages((prevImages) => [...prevImages, newImage]);

      setTimeout(() => {
        setImages((prevImages) => prevImages.filter((img) => img.key !== newImage.key));
      }, 1000);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const dropDuration = 2;

  return (
    <>
      {images.map((img) => (
        <Image
          key={img.key}
          src={ShitCoffee}
          alt="Dropping image"
          width={50}
          height={50}
          style={{
            position: 'fixed',
            left: img.x - 25,
            top: img.y - 25,
            pointerEvents: 'none',
            animation: `drop ${dropDuration}s linear`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes drop {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ImageDropEffect;