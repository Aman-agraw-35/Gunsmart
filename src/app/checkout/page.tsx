"use client";

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

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-[#b5865d]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Gunsmart</h1>
        <h2 className="text-2xl">
          has requested
          <span className="font-bold"> ${amount}</span>
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
