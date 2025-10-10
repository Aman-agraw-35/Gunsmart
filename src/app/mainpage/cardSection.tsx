"use client";
import React, { useState } from "react";
import Data from "./Data";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export const CardSection: React.FC = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleClick = async (d: any) => {
    try {
      await axios.post("../api/card", d, { withCredentials: true });
      router.push(`/itempage/${d}`);
    } catch (error: any) {
      console.log("Process failed", error.message);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(Data.length / itemsPerPage);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex flex-wrap justify-center gap-6 bg-black md:py-32 py-8 xl:px-32 px-4">
        {currentItems.map((x) => (
          <div
            key={x.id}
            onClick={() => handleClick(x.id)}
            className="bg-white border border-white rounded-lg overflow-hidden 
                       hover:cursor-pointer transition-transform duration-200 hover:scale-105
                       w-[90%] sm:w-[280px] md:w-[320px] lg:w-[360px] xl:w-[400px]"
          >
            <h1 className="text-base md:text-lg bg-black text-white p-2 truncate">{x.name}</h1>

            <div className="bg-white flex justify-center items-center">
              <Image
                src={x.image}
                alt={x.name}
                width={400}
                height={300}
                className="w-full aspect-[4/3] object-contain bg-center"
              />
            </div>

            <div className="flex items-center justify-start bg-black p-2 space-x-2">
              <h1 className="text-xl md:text-2xl text-[#b5865d] font-bold">
                {x.salePrice}
              </h1>
              <h1 className="text-sm md:text-lg text-[#b5865d] font-bold line-through">
                {x.retailPrice}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap gap-3 justify-center mt-8 mb-12">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            currentPage === 1
              ? "bg-gray-600 cursor-not-allowed text-white"
              : "bg-[#b5865d] hover:bg-[#d2aa7a] text-black"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              currentPage === page
                ? "bg-[#d2aa7a] text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed text-white"
              : "bg-[#b5865d] hover:bg-[#d2aa7a] text-black"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
