"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Data from '../mainpage/Data';
import  "../itempage/itempage.css";
import { Quantico } from 'next/font/google'
const inter = Quantico({   weight: '700', subsets: ['latin'] })

const ParticularItem = () => {
  const [id, setId] = useState({})
  const [offPercentage , setOffPercentage] = useState("");
  const [offPrice , setOffPrice] = useState("");
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
        setOffPercentage((( 1 - Number(newwe?.salePrice.substring(1))/Number(newwe?.retailPrice.substring(1)))*100).toFixed(2))
        setOffPrice(Number(newwe?.retailPrice.substring(1)) - Number(newwe?.salePrice.substring(1)))
       console.log(offPercentage);
       
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
   
  return (
    <div className='h-full w-ful '>
   <div className="flex md:flex-row flex-col md:h-[648px] h-min items-center   xl:mx-[280px]  lg:mx-24 sm:mx-16 mx-4  pt-36 pb-24">
    <div className="md:w-[50%] w-[90%] md:h-full bg-[#ffffff]  image">
      <Image 
      src={id.image} 
      alt={id.name}
      width={460}
      height={460}
      className='object-contain md:h-full w-full bg-[#ffffff] ima'
      />
    </div>
    <div className="md:w-[50%] w-[90%] h-full  mt-8  md:mt-0 md:ml-6  ">
      <div className={inter.className}>
      <h1 className=" text-4xl sm:text-5xl font-bold  text-black pt-4 ">{id.name}</h1>
      </div>
      <div className="flex pt-4">
      <h1 className="text-3xl  pt-8 font-bold  text-[#b5865d] ">{id.salePrice}</h1>
      <h1 className="text-xl  pt-9 pl-2 font-semibold line-through  font-sans
       text-[#b5865d] ">{id.retailPrice}</h1>
      <h1 className="text-lg  pt-9 pl-3 font-bold 
       text-[#388e3c] ">{offPercentage}%&nbsp;off</h1>
      </div>
      <label  className=" font-bold mt-4  text-[#388e3c] " htmlFor="h1">Special Sale Price</label>
      <br/>
      <h1 className="text-2xl pt-8 font-semibold  text-[#388e3c] ">Save ${offPrice} in this order if
      you order now. </h1>

      <button className="btn btn-warning mt-8 w-48 rounded-md text-white text-xl ">ADD TO CART</button>

    </div>
   </div>
   <div className="  h-max  xl:mx-[280px] lg:mx-24 mx-12 sm:mx-16 ">
   <h1 className="text-3xl w-full h-min pb-3 font-bold  text-[#b5865d] border-b-2
    border-black">SPECIFICATIONS</h1>
   <br />
   <table className="table text-black font-semibold ">

    <tbody>
      <tr >
        <td>Caliber</td>
        <td>{id.caliber}</td>
      </tr>
      <tr>
        <td>Capacity</td>
        <td>{id.capacity}</td>
      </tr>
      <tr className='border-b-2 border-black'>      
        <td>Weight</td>
        <td>{id.weight}</td>
      </tr>
    </tbody>
  </table>
  <div className="h-max  w-full mt-16">
  <h1 className="text-3xl w-full h-min pb-3 font-bold  text-[#b5865d] border-b-2
   border-black">DESCRIPTION</h1>
  <h1 className="py-8 border-b-2 border-black text-black text-lg  ">{id.specs}</h1>
  <br/>
  </div>
   </div>
    </div>
  );
};

export default ParticularItem;
