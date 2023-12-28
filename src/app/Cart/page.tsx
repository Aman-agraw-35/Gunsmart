"use client"
import React,{useState} from "react"
import "./cart.css" 
import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus ,faMinus } from "@fortawesome/free-solid-svg-icons"

export default function Cart (){
  const [isCart ,setIsCart] = useState(0)
  return (
    <>
  { isCart? <div className="bg-[#e4e4e4] h-[100vh] w-full "> 
    <div className="w-[70%] pl-36 pt-8 mr-4 ">
      <div className="h-48 bg-white p-8  ">
        <h1 className="text-3xl text-black border-b-[1px] border-black pb-8 ">Your Amazon Cart is empty.</h1>
        <h1 className="text-xl pt-2 text-black float-right  ">Subtotal (0 items)</h1>
      </div>
     <Link href="../mainpage" className="m-8 text-blue-500 hover:underline hover:text-blue-800 ">Visit the mainpage to buy some guns .</Link>
    </div>
    </div> :
      <div className="bg-[#e4e4e4] w-full h-[100vh] flex "> 


        <div className="w-[70%] pl-36 pt-8 mr-4 ">
          <div className="h-48 bg-white p-8 border-b-[0.001px] border-[#8f8f8f] ">
            <h1 className="text-3xl text-black border-b-[1px] border-black pb-8 ">Shopping Cart</h1>
            <h1 className="text-xl pt-2 text-black float-right  ">Subtotal (1 item)</h1>
          </div>
          <div className="h-48 bg-white p-8 border-b-[0.001px] border-[#8f8f8f] flex ">
            <div className="h-full w-[17%]  ">
            <Image 
      src="https://images.guns.com/prod/2021/07/01/60ddcca5538895e719efb521c5aef60d36b6d23f7737c.jpeg?imwidth=1200"
      alt="name"
      width={460}
      height={460}
      className='object-contain md:h-full w-full bg-[#ffffff] ima'
        />
            </div>
            <div className="w-[80%] h-full py-4 px-4 text-black ">
            <h1 className="text-lg pb-4">KELTEC P50 (HOLSTER PACKAGE)</h1>
            <div className="flex">
            <h1 className="text-lg pr-4 font-bold pb-2">$334</h1>
            <h1 className="text-sm pt-1 font-medium line-through text-[#8f8f8f] pb-2">$394</h1>
            </div>
            <div className="flex">
            <button className="btn-ghost btn btn-xs h-4 w-4 pr-5 "><FontAwesomeIcon icon={faMinus} /></button>
            <h1 className="text-md font-bold  border-[0.1px] px-2 border-[#8f8f8f] ">1</h1>
            <button className="btn-ghost btn-xs btn pl-4  "><FontAwesomeIcon icon={faPlus} /></button>
            <h1 className="text-md px-4 text-[#9f9f9f] cursor-pointer hover:text-[#6f6f6f] font-semibold ">Remove</h1>
            <button></button>
            </div>
            </div>
          </div>
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
        <h1 className="text-lg bg-[#fb641b] text-center py-3 hover:cursor-pointer  font-medium text-[#fff]">PLACE ORDER</h1>
        </div>
        </div>
      </div>
}
      </>
  )

};