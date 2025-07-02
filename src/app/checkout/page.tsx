"use client";
import Loader from "@/helpers/loader";
import React, { useState, useEffect } from "react";
import CheckoutPage from "@/app/checkout/checkoutpage";
import convertToSubcurrency from "@/helpers/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'next/navigation';
import "./checkout.css" ;
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const saleTotal = query.get('saleTotal');
    if (saleTotal) {
      setAmount(Number(saleTotal));
    }
  }, []);
  if(!amount){
    return <Loader/>
  }
  return (
    <main className="w-full h-[100vh]  px-[10%] py-[5%] bg-black text-white text-center border  rounded-md ">
<div className="mb-10  text-center bg-black">
  <h1 className="text-5xl font-extrabold mb-4 bg-black tracking-tight">Gunsmart</h1>
  <h2 className="text-2xl bg-black  font-medium">
    has requested
    <span className="font-bold bg-black text-primary ml-1">${amount}</span>
  </h2>
</div>


      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}
