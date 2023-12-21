"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Data from '../mainpage/Data';
const ParticularItem = () => {
  const [id, setId] = useState({})
  const items = Data ;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('../api/card')
        const number = res.data.data
         console.log(number);
        const newwe =  items[number - 1] ;
         console.log(newwe);
        setId(newwe)
    
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='h-full w-ful '>
   <div className="flex  h-[400px]  mx-[300px] my-36 ">
    <div className="w-[50%] h-full bg-white">
      <Image 
      src={id.image} 
      alt={id.name}
      width={460}
      height={460}
      className='object-contain h-full w-full'
      />
    </div>
    <div className="w-[50%] h-full p-4 bg-[#e9e9e9] font-serif  ">
      <h1 className="text-4xl text-bold  text-black ">{id.name}</h1>
      <h1 className="text-3xl text-bold  text-[#b5865d] ">{id.retailPrice}</h1>

    </div>
   </div>
    </div>
  );
};

export default ParticularItem;
