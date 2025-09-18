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
    // Prefer finding the item locally using params.id. This avoids relying on a fragile global API state.
    const findItem = () => {
      const numericId = Number(params.id);
      const found = items.find((it: any) => Number(it.id) === numericId);
      if (found) {
        setId(found);
        setOffPercentage(((1 - Number(found.salePrice.substring(1)) / Number(found.retailPrice.substring(1))) * 100).toFixed(2));
        setOffPrice((Number(found.retailPrice.substring(1)) - Number(found.salePrice.substring(1))).toFixed(2));
      } else {
        console.warn('Item not found locally for id', params.id);
      }
      setIsLoading(false);
    }

    findItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleClick = async (db: any) => {
    try {
      // ensure credentials are sent so backend can read token cookie
      const response = await axios.post("../api/cart", db, { withCredentials: true })
      console.log(db + '  ' + response.data);
      router.push("/cartpage");
    } catch (error:any) {
      console.log("Process failed", error.message);
      // if unauthorized, redirect to login
      if (error.response?.status === 401) {
        router.push('/login')
      }
    } 
  }
  
  if (isLoading) {
    return <Loader/>;
  }

  return (
    <div className='h-full w-full '>
      <Header/>
      <div className="flex md:flex-row flex-col md:h-[648px] h-min items-center xl:mx-[280px] lg:mx-24 sm:mx-16 mx-4 pt-36 pb-24">
        <div className="md:w-[50%] w-[90%] md:h-full bg-[#ffffff] image">
          <Image 
            src={id.image} 
            alt={id.name}
            width={460}
            height={460}
            className='object-contain md:h-full w-full bg-[#ffffff] ima'
          />
        </div>
        <div className="md:w-[50%] w-[90%] h-full mt-8 md:mt-0 md:ml-6  ">
          <div className={inter.className}>
            <h1 className="text-4xl sm:text-5xl font-bold text-black  ">{id.name}</h1>
          </div>
          <div className="flex ">
            <h1 className="text-3xl pt-6 font-bold text-[#b5865d] ">{id.salePrice}</h1>
            <h1 className="text-xl pt-7 pl-2 font-semibold line-through font-sans text-[#b5865d] ">{id.retailPrice}</h1>
            <h1 className="text-lg pt-7 pl-3 font-bold text-[#388e3c] ">{offPercentage}%&nbsp;off</h1>
          </div>
          <label className="font-bold m text-[#388e3c] " htmlFor="h1">Special Sale Price</label>
          <br/>
          <h1 className="text-2xl pt-4 font-semibold text-[#388e3c] ">Save ${offPrice} in this order if you order now. </h1>
          <button 
            onClick={() => handleClick(id.id)} 
            className="btn btn-warning mt-4 w-48 rounded-md text-white text-xl "
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <div className="h-max xl:mx-[280px] lg:mx-24 mx-12 sm:mx-16 ">
        <h1 className="text-3xl w-full h-min pb-3 font-bold text-[#b5865d] border-b-2 border-black">SPECIFICATIONS</h1>
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
        <div className="h-max w-full mt-16">
          <h1 className="text-3xl w-full h-min pb-3 font-bold text-[#b5865d] border-b-2 border-black">DESCRIPTION</h1>
          <h1 className="py-8 border-b-2 border-black text-black text-lg ">{id.specs}</h1>
          <br/>
        </div>
      </div>
    </div>
  );
};

export default ParticularItem;
