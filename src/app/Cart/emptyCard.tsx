import React from 'react'
import Link from "next/link"

const EmptyCard = () => {
  return (
    <div className="bg-[#e4e4e4] h-[100vh] w-full "> 
    <div className="w-[70%] pl-36 pt-8 mr-4 ">
      <div className="h-44 bg-white p-6  ">
        <h1 className="text-3xl text-[#287480] font-semibold border-b-[1px] border-black pb- ">Your Amazon Cart is empty.</h1>
        <h1 className="text-xl pt-2 text-black float-right  ">0 items</h1>
      </div>
     <Link href="../mainpage" className="m-8 text-blue-500 hover:underline hover:text-blue-800 ">Visit the mainpage to buy some guns .</Link>
    </div>
    </div> 
  )
}

export default EmptyCard ;