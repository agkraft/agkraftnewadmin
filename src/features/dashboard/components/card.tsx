import React from "react";

interface CardProps {
  title: string;
  count: number;
  bgImage: string;
}

const CardComponent: React.FC<CardProps> = ({ title, count, bgImage }) => {
  return (
    <div
      className="relative flex flex-col justify-between p-4 h-40 w-full rounded-lg shadow-md"
      style={{
        backgroundColor: "#FDF5F5", // Base soft background color
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          
        }}
      ></div>

      {/* Count */}
      <div className="relative z-10 text-2xl text-gray-800 ml-32">{count}</div>

      {/* Title */}
      <div className="relative z-10 text-lg font-medium text-gray-600 ml-4">{title}</div>
    </div>
  );
};

export default CardComponent;
