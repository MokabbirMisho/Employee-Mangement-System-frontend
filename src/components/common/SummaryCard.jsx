import React from "react";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="flex bg-gray-300">
      <div
        className={`text-3xl flex justify-center items-center ${color} text-white px-4`}
      >
        {icon}
      </div>
      <div className="pl-4 py-1">
        <p className="text-lg font-light">{text}</p>
        <p className="text-xl ">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
