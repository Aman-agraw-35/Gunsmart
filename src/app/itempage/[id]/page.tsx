"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/helpers/header';
import Image from 'next/image';
import axios from 'axios';
import Data from '@/app/mainpage/Data';
import  "../itempage.css";
import Loader from '@/helpers/loader';
import { Quantico } from 'next/font/google'
import { useRouter } from 'next/navigation';

const inter = Quantico({ weight: '700', subsets: ['latin'] })
interface Item{
    id: number;
    name: string;
    image: string;
    retailPrice: string;
    salePrice: string;
    caliber: string;
    capacity: string;
    weight: string;
    specs: string;
}

const ParticularItem = ({params}:any) => {
  const [id, setId] = useState<Item>({
    id: Number(params.id) || 0,
    name: "",
    image: "",
    retailPrice:"",
    salePrice: "",
    caliber: "",
    capacity:"",
    weight: "",
    specs: "",
  })
  const [offPercentage , setOffPercentage] = useState("");
  const [offPrice , setOffPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const items = Data;
  const router = useRouter();

  useEffect(() => {
    const findItem = () => {
      const numericId = Number(params.id);
      const found = items.find((it: any) => Number(it.id) === numericId);
      if (found) {
        setId({
          id: found.id,
          name: found.name || '',
          image: found.image || '',
          retailPrice: found.retailPrice || '',
          salePrice: found.salePrice || '',
          caliber: found.caliber || '',
          capacity: found.capacity || '',
          weight: found.weight || '',
          specs: found.specs || ''
        });
        setOffPercentage(((1 - Number(found.salePrice.substring(1)) / Number(found.retailPrice.substring(1))) * 100).toFixed(2));
        setOffPrice((Number(found.retailPrice.substring(1)) - Number(found.salePrice.substring(1))).toFixed(2));
      } else {
        console.warn('Item not found locally for id', params.id);
      }
      setIsLoading(false);
    }

    findItem();
  }, [params.id, items]);

  const handleClick = async (db: any) => {
    try {
      const response = await axios.post("../api/cart", db, { withCredentials: true })
      console.log(db + '  ' + response.data);
      router.push("/cartpage");
    } catch (error:any) {
      console.log("Process failed", error.message);
      if (error.response?.status === 401) {
        router.push('/login')
      }
    } 
  }
  
  if (isLoading) {
    return <Loader/>;
  }

  return (
    <div className='h-full w-full item-page'>
      <Header/>
      {/* MAIN ROW/STACK */}
      <div className="flex md:flex-row flex-col md:h-[648px] h-auto items-center xl:mx-[280px] lg:mx-24 sm:mx-16 mx-4 pt-24 sm:pt-36 pb-16 sm:pb-24 gap-6">
        {/* IMAGE */}
        <div className=" w-full md:h-full h-56 bg-[#ffffff] image flex justify-center items-center">
          <Image 
            src={id.image} 
            alt={id.name}
            width={460}
            height={460}
            className='object-contain w-[85%] sm:w-full h-full ima'
          />
        </div>

        {/* DETAILS */}
        <div className="md:w-[50%] w-full h-auto mt-6 md:mt-0 md:ml-6 px-2 sm:px-0">
          <div className={inter.className}>
            <h1 className="text-2xl sm:text-5xl font-bold text-black leading-tight break-words">{id.name}</h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline  gap-2 mt-3">
            <h1 className="text-xl sm:text-3xl font-bold text-[#b5865d]">{id.salePrice}</h1>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <h1 className="text-sm sm:text-xl font-semibold line-through font-sans text-[#b5865d]">{id.retailPrice}</h1>
              <h1 className="text-sm sm:text-lg font-bold text-[#388e3c]">{offPercentage}%&nbsp;off</h1>
            </div>
          </div>

          <label className="font-bold text-sm sm:text-base text-[#388e3c] mt-3 block">Special Sale Price</label>
          <p className="text-base sm:text-2xl pt-2 font-semibold text-[#388e3c]">Save ${offPrice} in this order if you order now.</p>

          <button 
            onClick={() => handleClick(id.id)} 
            className="btn btn-warning mt-4 w-40 sm:w-48 rounded-md text-white text-lg sm:text-xl mx-auto sm:mx-0"
          >
            ADD TO CART
          </button>
        </div>
      </div>

    
      <div className="h-max xl:mx-[280px] lg:mx-24 mx-6 sm:mx-16 mt-8">
        <h1 className="text-2xl sm:text-3xl w-full h-min pb-3 font-bold text-[#b5865d] border-b-2 border-black">SPECIFICATIONS</h1>
        <br />
        <table className="table-auto w-full text-black font-semibold text-sm sm:text-base">
          <tbody>
            <tr>
              <td className="py-2 w-[40%]">Caliber</td>
              <td className="py-2">{id.caliber}</td>
            </tr>
            <tr>
              <td className="py-2">Capacity</td>
              <td className="py-2">{id.capacity}</td>
            </tr>
            <tr className='border-b-2 border-black'>      
              <td className="py-2">Weight</td>
              <td className="py-2">{id.weight}</td>
            </tr>
          </tbody>
        </table>

        <div className="h-max w-full mt-8">
          <h1 className="text-2xl sm:text-3xl w-full h-min pb-3 font-bold text-[#b5865d] border-b-2 border-black">DESCRIPTION</h1>
          <p className="py-6 border-b-2 border-black text-black text-sm sm:text-lg leading-relaxed">{id.specs}</p>
          <br/>
        </div>
      </div>
    </div>
  );
};

export default ParticularItem;
