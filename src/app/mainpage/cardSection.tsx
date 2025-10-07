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
      <div className="h-auto bg-black w-full flex md:py-32 py-0 xl:px-32 px-4 gap-6 justify-center flex-wrap">
        {currentItems.map((x) => (
          <div
            key={x.id}
            onClick={() => handleClick(x.id)}
            className="w-[400px] h-[393px] hover:cursor-pointer bg-white border-white border-[1px] mb-4"
          >
            <h1 className="text-lg bg-black p-2">{x.name}</h1>
            <Image
              src={x.image}
              alt={x.name}
              width={350}
              height={280}
              className="w-[350px] h-[299px] object-contain bg-center bg-white"
            />
            <div className="flex bg-white flex-row">
              <h1 className="text-2xl bg-black pl-4 p-2 text-[#b5865d] font-bold">
                {x.salePrice}
              </h1>
              <h1 className="text-lg text-center pt-3 bg-black pl-2 p-2 pr-2 text-[#b5865d] font-bold line-through">
                {x.retailPrice}
              </h1>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-8 mb-12">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200
      ${
        currentPage === 1
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-[#b5865d] hover:bg-[#d2aa7a] text-black"
      }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
        ${
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
          className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200
      ${
        currentPage === totalPages
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-[#b5865d] hover:bg-[#d2aa7a] text-black"
      }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
