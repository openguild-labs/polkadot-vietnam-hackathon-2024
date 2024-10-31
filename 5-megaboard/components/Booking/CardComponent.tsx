import React, { useState } from 'react';
import { Billboard } from '@/lib/type';
import BookingModal from './BookingModal'; // Import BookingModal

interface CardProps {
  billboard: Billboard;
  onBooking: () => void;
}

const CardComponent: React.FC<CardProps> = ({ billboard, onBooking }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    setIsModalVisible(false);
    onBooking();
  };

  return (
    <div className="bg-white/60 text-black shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 h-[290px] w-[300px]">
      <img
        alt="billboard"
        src={billboard.imageUrl}
        className="w-full h-40 object-cover bg-transparent"
      />
      <div className="p-4">
        <h3 className="text-sm overflow-hidden h-[22px]">{billboard.address}</h3>
        <p className="">Rental Price: {billboard.price}/day</p>
        <button
          className="mt-4 bg-black text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
          onClick={showModal}
        >
          Booking
        </button>
      </div>

      <BookingModal
        billboard={billboard}
        isVisible={isModalVisible}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CardComponent;
