import React from 'react'
import Image from 'next/image';

const Upper = () => {
  return (
    <div className='w-full h-[30rem]'>
    <Image 
    className="absolute opacity-60 w-full md:h-[500px] h-[320px] object-cover " 
    src="/images/gun.jpg" 
    width={1530}
    height={600} alt='img'/>
    <div className='relative w-[100%]  h-[300px] lg:pl-[10%] pl-[15%] pr-[10%] lg:pt-[8%] pt-[15%] '>
    <h1 className='lg:text-8xl  md:text-7xl sm:text-6xl text-5xl  ' >
      50% discount on <br />all Guns.</h1>
    <h1 className=' sm:text-4xl text-3xl pt-[2%] ' >Pick your favourite now.</h1>
    </div>
    </div>
  )
}

export default Upper