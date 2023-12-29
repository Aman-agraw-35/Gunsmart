"use client"
import React,{useState,useEffect} from "react"
import "./cart.css" 
import axios from "axios"
import Image from "next/image"
import EmptyCard from "./emptyCard"
import Data from '../mainpage/Data';
import Loader from "../helpers/loader"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus ,faMinus } from "@fortawesome/free-solid-svg-icons"

export default function Cart (){
  const [isLoading, setIsLoading] = useState(1);
  const [isCart ,setIsCart] = useState(0)
  const [dataFromCart, setDataFromCart] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('../api/cart')
        console.log(res.data)
        setDataFromCart(res.data)
        setIsLoading(0);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return <Loader/>;
  }
  if (!dataFromCart || !dataFromCart.idProduct || dataFromCart.idProduct.length === 0) {
    return <EmptyCard />;
  }
  if (dataFromCart && dataFromCart.idProduct) {
    var sortedData = dataFromCart.idProduct.map((cardId:any , index) => {
      const item = Data.find((item) => item.id == cardId);
      const quantity = dataFromCart.Quantity[index] || 0;
      return { ...item, quantity };    })
    console.log(sortedData);
  }
  
  return (
    <>
      <div className="bg-[#e4e4e4] w-full h-[max] flex "> 
        <div className="w-[70%] pl-36 pt-8 mr-4 ">
          <div className="h-48 bg-white p-8 border-b-[0.001px] border-[#8f8f8f] ">
            <h1 className="text-3xl text-black border-b-[1px] border-black pb-8 ">Shopping Cart</h1>
            <h1 className="text-xl pt-2 text-black float-right  ">1 item</h1>
          </div>
          {sortedData?.map( (cartItem:any) => (
          <div key={cartItem.id} className="h-48 bg-white p-8 border-b-[0.001px] border-[#8f8f8f] flex ">
            <div className="h-full w-[17%]  ">
            <Image 
            src={cartItem.image}
            alt={cartItem.name}
            width={460}
            height={460}
            className='object-contain md:h-full w-full bg-[#ffffff] '
            />
            </div>
            <div className="w-[80%] h-full py-4 px-4 text-black ">
            <h1 className="text-lg font-semibold pb-4">{cartItem.name}</h1>
            <div className="flex">
            <h1 className="text-lg pr-4 font-bold pb-2">{cartItem.salePrice}</h1>
            <h1 className="text-sm pt-1 font-medium line-through text-[#8f8f8f] pb-2">{cartItem.retailPrice}</h1>
            </div>
            <div className="flex">
            <button className="btn-ghost btn btn-xs h-4 w-4 pr-5 "><FontAwesomeIcon icon={faMinus} /></button>
            <h1 className="text-md font-bold  border-[0.1px] px-2 border-[#8f8f8f] ">{cartItem.quantity}</h1>
            <button className="btn-ghost btn-xs btn pl-4  "><FontAwesomeIcon icon={faPlus} /></button>
            <h1 className="text-md px-4 text-[#9f9f9f] cursor-pointer hover:text-[#6f6f6f] font-semibold ">Remove</h1>
            <button></button>
            </div>
            </div>
          </div>))}
        </div>

        <div className="w-[30%] pt-8 mr-4 pr-36 ">
        <div className="h-60 bg-white   ">
          <div className="border-b-[0.1px] border-[#8f8f8f] p-3">
        <h1 className="text-lg  font-medium text-[#8f8f8f]">PRICE DETAILS</h1>
        </div>
        <div className="">
        <table className="table text-black font-medium pb-8 ">
        <tbody>
        <tr >
         <td>Price</td>
         <td>$2222</td>
        </tr>
        <tr>
         <td>Discount</td>
         <td>$233</td>
        </tr>
        <tr className='border-b-[1px] border-black border-dashed'>      
         <td>Delivery Charges</td>
         <td>$10</td>
        </tr>
        <tr className='text-bold text-lg '>      
         <td>Total Amount</td>
         <td>$1000</td>
        </tr>
        </tbody>
        </table>
        </div>
        <h1 onClick={() =>alert("Buying guns online in India  is a crime. Thanks for visiting my site. Hope you liked my work.")} className="text-lg bg-[#fb641b] text-center py-3 hover:cursor-pointer  font-medium text-[#fff]">PLACE ORDER</h1>
        </div>
        </div>
      </div>
      </>
  )

};