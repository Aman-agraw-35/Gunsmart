"use client"
import React,{useState,useEffect} from "react"
import "./cart.css" 
import axios from "axios"
import Image from "next/image"
import Header from "../../helpers/header"
import EmptyCard from "./emptyCard"
import Loader from "../../helpers/loader"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus ,faMinus } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from 'next/navigation';

    const Cartpage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [saleTotal ,setSaleTotal] = useState("0")
  const [retailTotal ,setRetailTotal] = useState("0")
  const [dataFromCart, setDataFromCart] = useState<any[]>([])
  const [itemLoading, setItemLoading] = useState<Record<string, boolean>>({})
  const [pendingDeltas, setPendingDeltas] = useState<Record<string, number>>({})
  const timersRef = React.useRef<Record<string, NodeJS.Timeout | number | null>>({})
  const router = useRouter();

  
    const fetchData = async () => {
      try {
        const res = await axios.get('../api/cart', { withCredentials: true })
        if (res.data?.error) {
          console.warn('cart fetch error', res.data.error)
          setIsLoading(false)
          setDataFromCart([])
          return
        }
        console.log('cart fetch', res.data)
        setDataFromCart(res.data.data || [])
        setSaleTotal(String(res.data.salePriceTotal ?? "0"))
        setRetailTotal(String(res.data.retailPriceTotal ?? "0"))
        setIsLoading(false)
      } catch (err:any) {
        console.log(err.message || err)
        setIsLoading(false)
      }
    };



    const handlePayment = () => {
      try {
        router.push(`/checkout?saleTotal=${saleTotal}`);
      } catch (err) {
        console.log(err);
      }
    };
    
  const sendPlusRequest = async (db: string, amount: number) => {
    try {
      setItemLoading(prev => ({ ...prev, [db]: true }))
      const response = await axios.post("../api/cartPlus", { plus: db, amount }, { withCredentials: true })
      if (response.data?.error) throw new Error(response.data.error)
      await fetchData()
    } catch (err:any) {
      console.error('sendPlusRequest failed', err.message)
      await fetchData()
    } finally {
      setItemLoading(prev => ({ ...prev, [db]: false }))
    }
  }

  const handlePlusClick = (db: any) => {
    if (!db) return
    setPendingDeltas(prev => ({ ...prev, [db]: (prev[db] || 0) + 1 }))
    const existing = timersRef.current[db]
    if (existing) clearTimeout(existing as any)
    timersRef.current[db] = setTimeout(() => {
      const amount = pendingDeltas[db] ?? 0
      setPendingDeltas((latest) => {
        const finalAmount = latest[db] ?? 0
        if (finalAmount !== 0) sendPlusRequest(db, finalAmount)
        const copy = { ...latest }
        delete copy[db]
        return copy
      })
      timersRef.current[db] = null
    }, 500)
  }
  
  const sendMinusRequest = async (db: string, amount: number) => {
    try {
      setItemLoading(prev => ({ ...prev, [db]: true }))
      const response = await axios.post("../api/cartMinus", { minus: db, amount }, { withCredentials: true })
      if (response.data?.error) throw new Error(response.data.error)
      await fetchData()
    } catch (err:any) {
      console.error('sendMinusRequest failed', err.message)
      await fetchData()
    } finally {
      setItemLoading(prev => ({ ...prev, [db]: false }))
    }
  }

  const handleMinusClick = (db: any) => {
    if (!db) return
    setPendingDeltas(prev => ({ ...prev, [db]: (prev[db] || 0) - 1 }))
    const existing = timersRef.current[db]
    if (existing) clearTimeout(existing as any)
    timersRef.current[db] = setTimeout(() => {
      setPendingDeltas((latest) => {
        const finalAmount = latest[db] ?? 0
        if (finalAmount !== 0) {
          if (finalAmount > 0) sendPlusRequest(db, finalAmount)
          else sendMinusRequest(db, Math.abs(finalAmount))
        }
        const copy = { ...latest }
        delete copy[db]
        return copy
      })
      timersRef.current[db] = null


    }, 500)
  }
  const handleRemoveClick = async (d: any) => {
    if (!d) return
    setItemLoading(prev => ({ ...prev, [d]: true }))
    try {
      const response = await axios.post("../api/cartMinus", { remove: d }, { withCredentials: true })
      if (response.data?.error) throw new Error(response.data.error)
      await fetchData()
    } catch (err:any) {
      console.error('remove failed', err.message)
      await fetchData()
    } finally {
      setItemLoading(prev => ({ ...prev, [d]: false }))
    }
  }
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
      <Header/>
      <div className="cart-page w-full  min-h-screen pt-20 flex xl:px-32 lg:px-6 lg:items-start items-center lg:flex-row flex-col-reverse"> 
        <div className="md:w-[70%] w-[90%] ml-4 py-8 mr-4 ">
          <div className="h-44 bg-white p-6 border-b-[0.001px] border-[#8f8f8f] ">
            <h1 className="sm:text-4xl text-2xl sm:mt-4 bg-white text-[#287480] font-semibold border-b-[1px] border-black pb-5 ">Shopping Cart</h1>
            <h1 className="text-xl bg-white pt-2 text-black float-right  ">{dataFromCart.length}&nbsp;{dataFromCart.length == 1 ? "Item":"Items"}</h1>
          </div>
          {dataFromCart?.filter(Boolean).map((cartItem:any, idx:number) => (
          <div key={cartItem?.id ?? `cart-item-${idx}`} className="h-44 bg-white lg:p-6 pl-1 py-6 pr-2  border-b-[0.001px] border-[#8f8f8f] flex ">
            <div className="h-full lg:w-[17%] w-[33%]  ">
            {cartItem?.image ? (
            <Image 
            src={cartItem.image}
            alt={cartItem.name || 'Product image'}
            width={460}
            height={460}
            className='object-contain object-center h-full w-full  bg-[#ffffff] '
            />) : (
              <div className="h-full w-full bg-[#f3f3f3] flex items-center justify-center text-gray-500">No image</div>
            )}
            </div>
            <div className="md:w-[80%] w-[70%] bg-white h-full md:py-4  md:px-4 pr-2 pl-4 text-black ">
            <h1 className="sm:text-lg bg-white font-semibold pb-4">{cartItem.name}</h1>
            <div className="flex bg-white">
            <h1 className="sm:text-lg text-md pr-2 sm:pr-4 bg-white font-bold pb-2">{cartItem.salePrice}</h1>
            <h1 className="text-sm pt-[0.15rem] bg-white font-medium line-through text-[#8f8f8f] pb-2">{cartItem.retailPrice}</h1>
            </div>
            <div className="flex bg-white">
            {<button 
            onClick={() =>{handleMinusClick(cartItem.id)}}  
            className="btn-ghost bg-white  btn-xs h-4 w-4 pr-5 "><FontAwesomeIcon className="bg-white" icon={faMinus} />
            </button> }
            <h1 className="text-md bg-white font-bold  border-[0.1px] px-2 border-[#8f8f8f] ">{cartItem.quantity}</h1>
            <button
            onClick={() =>{handlePlusClick(cartItem.id)}}  
            className="btn-ghost bg-white btn-xs  pl-2 "><FontAwesomeIcon className="bg-white" icon={faPlus} />
            </button>
            <h1 
            onClick={() =>{handleRemoveClick(cartItem.id)}}  
            className="sm:text-md text-sm sm:px-4 bg-white text-[#9f9f9f] cursor-pointer hover:text-[#6f6f6f] font-semibold ">Remove</h1>
            </div>
            </div>
          </div>))}
        </div>

        <div className="lg:w-[30%] md:w-[70%] w-[90%] pt-8 pb-8 mb-4 ">
        <div className="h-60 bg-white   ">
          <div className="border-b-[0.1px] border-[#8f8f8f] bg-white  p-3">
        <h1 className="text-lg bg-white  font-medium text-[#8f8f8f]">PRICE DETAILS</h1>
        </div>
        <div className=" bg-white ">
        <table className="table bg-white  text-black font-medium pb-8 ">
        <tbody>
        <tr >
         <td className="bg-white">Price</td>
         <td className="bg-white">&nbsp;${retailTotal}</td>
        </tr>
        <tr>
         <td className="bg-white" >Discount</td>
         <td className="text-[#388e3c] bg-white">-${(Number(retailTotal) - Number(saleTotal)).toFixed(2)}</td>
        </tr>
        <tr className='border-b-[1px] bg-white border-black border-dashed'>      
         <td className="bg-white">Delivery Charges</td>
         <td className=" text-[#388e3c] bg-white"><span className="line-through bg-white text-black">&nbsp;$10&nbsp;</span >&nbsp;&nbsp;Free</td>
        </tr>
        <tr className='font-bold bg-white xl:text-lg lg:text-md '>      
         <td className="bg-white" >Total Amount</td>
         <td className="bg-white">&nbsp;${saleTotal}</td>
        </tr>
        </tbody>
        </table>
        </div>
        <h1
         onClick={() => handlePayment()}
         className="text-lg bg-[#fb641b] text-center py-3 hover:cursor-pointer  font-medium text-[#fff]">PLACE ORDER</h1>
        </div>
        </div>
      </div>
      </>
  )}
    

export default Cartpage ;