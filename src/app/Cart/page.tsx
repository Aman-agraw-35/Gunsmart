"use client"
import React,{useState,useEffect, useRef} from "react"
import "./cart.css" 
import axios from "axios"
import Image from "next/image"
import EmptyCard from "./emptyCard"
import Data from '../mainpage/Data';
import Loader from "../helpers/loader"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus ,faMinus } from "@fortawesome/free-solid-svg-icons"

export default function Cart (){
  const [isLoading, setIsLoading] = useState(1)
  const [saleTotal ,setSaleTotal] = useState("0")
  const [retailTotal ,setRetailTotal] = useState("0")
  const [dataFromCart, setDataFromCart] = useState([])

  
    const fetchData = async () => {
      try {
        const res = await axios.get('../api/cart')
        console.log(res.data)
        setDataFromCart(res.data.data)
        setSaleTotal((res.data.salePriceTotal))
        setRetailTotal(res.data.retailPriceTotal)
        setIsLoading(0);
      } catch (err) {
        console.log(err);
      }
    };
 
  
  const handlePlusClick = (async (db: any) => {
    try {
      const response = await axios.post("../api/cartPlus",  {plus:db})
      console.log(db + '  ' + response.data);
      fetchData();
    } catch (error:any) {
      console.log("Process failed", error.message);
    } 
  })
  
  const handleMinusClick = (async (db: any) => {
    try {
      const response = await axios.post("../api/cartMinus",  {minus:db });
      console.log(db + '  ' + response.data);
      fetchData();
    } catch (error:any) {
      console.log("Process failed", error.message);
    } 
  })
  const handleRemoveClick = (async (d: any) => {
    try {
      const response = await axios.post("../api/cartMinus",  {remove : d});
      console.log(d + '  ' + response.data);
      fetchData();
    } catch (error:any) {
      console.log("Process failed", error.message);
    } 
  })
    useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader/>;
  }
  if (!dataFromCart ||  dataFromCart.length === 0) {
    return <EmptyCard />;
  }

  return (
    <>
      <div className="bg-[#e4e4e4] w-full h-[max] flex xl:px-32 lg:px-6 lg:items-start items-center lg:flex-row flex-col-reverse"> 
        <div className="md:w-[70%] w-[90%] ml-4 py-8 mr-4 ">
          <div className="h-44 bg-white p-6 border-b-[0.001px] border-[#8f8f8f] ">
            <h1 className="text-4xl text-[#287480] font-semibold border-b-[1px] border-black pb-5 ">Shopping Cart</h1>
            <h1 className="text-xl pt-2 text-black float-right  ">{dataFromCart.length}&nbsp;{dataFromCart.length == 1 ? "Item":"Items"}</h1>
          </div>
          {dataFromCart?.map( (cartItem:any) => (
          <div key={cartItem.id} className="h-44 bg-white lg:p-6 pl-1 py-6 pr-2  border-b-[0.001px] border-[#8f8f8f] flex ">
            <div className="h-full lg:w-[17%] w-[33%]  ">
            <Image 
            src={cartItem.image}
            alt={cartItem.name}
            width={460}
            height={460}
            className='object-contain object-center h-full w-full  bg-[#ffffff] '
            />
            </div>
            <div className="md:w-[80%] w-[70%] h-full md:py-4  md:px-4 pr-2 pl-4 text-black ">
            <h1 className="text-lg font-semibold pb-4">{cartItem.name}</h1>
            <div className="flex">
            <h1 className="text-lg pr-4 font-bold pb-2">{cartItem.salePrice}</h1>
            <h1 className="text-sm pt-1 font-medium line-through text-[#8f8f8f] pb-2">{cartItem.retailPrice}</h1>
            </div>
            <div className="flex">
            {<button 
            onClick={() =>{handleMinusClick(cartItem.id)}}  
            className="btn-ghost  btn-xs h-4 w-4 pr-5 "><FontAwesomeIcon icon={faMinus} />
            </button> }
            <h1 className="text-md font-bold  border-[0.1px] px-2 border-[#8f8f8f] ">{cartItem.quantity}</h1>
            <button
            onClick={() =>{handlePlusClick(cartItem.id)}}  
            className="btn-ghost btn-xs  pl-4 "><FontAwesomeIcon icon={faPlus} />
            </button>
            <h1 
            onClick={() =>{handleRemoveClick(cartItem.id)}}  
            className="text-md px-4 text-[#9f9f9f] cursor-pointer hover:text-[#6f6f6f] font-semibold ">Remove</h1>
            </div>
            </div>
          </div>))}
        </div>

        <div className="lg:w-[30%] md:w-[70%] w-[90%] pt-8 pb-8   ">
        <div className="h-60 bg-white   ">
          <div className="border-b-[0.1px] border-[#8f8f8f] p-3">
        <h1 className="text-lg  font-medium text-[#8f8f8f]">PRICE DETAILS</h1>
        </div>
        <div className="">
        <table className="table text-black font-medium pb-8 ">
        <tbody>
        <tr >
         <td>Price</td>
         <td>&nbsp;${retailTotal}</td>
        </tr>
        <tr>
         <td>Discount</td>
         <td className="text-[#388e3c]">-${(Number(retailTotal) - Number(saleTotal)).toFixed(2)}</td>
        </tr>
        <tr className='border-b-[1px] border-black border-dashed'>      
         <td>Delivery Charges</td>
         <td className=" text-[#388e3c]"><span className="line-through text-black">&nbsp;$10&nbsp;</span>&nbsp;&nbsp;Free</td>
        </tr>
        <tr className='font-bold  xl:text-lg lg:text-md '>      
         <td>Total Amount</td>
         <td>&nbsp;${saleTotal}</td>
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