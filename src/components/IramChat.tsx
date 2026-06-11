import React from 'react';
import iramAvatar from '../assets/images/iram-avatar.png.png';

export default function IramChat() {
  return (
    <button
      aria-label="Iram"
      title="Iram"
      className="fixed bottom-8 left-6 z-50 bg-[#E69500] p-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
    >
      <img
        src={iramAvatar}
        alt="Iram"
        className="w-14 h-14 rounded-full object-cover"
      />
    </button>
  );
}
