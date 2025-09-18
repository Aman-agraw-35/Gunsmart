"use client"

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/helpers/convertToSubcurrency";
const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseUrl = isLocalhost ? 'http://localhost:3000' : 'https://gunmart.vercel.app';

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${baseUrl}/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      window.location.href = `${baseUrl}/payment-failed`;
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      window.location.href = `${baseUrl}/payment-success?amount=${amount}`;
    } else {
      window.location.href = `${baseUrl}/payment-failed`;
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[#1a1a1a]">
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#b5865d] border-t-transparent"
          role="status"
        >
          <span className="sr-only">Loading payment form...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#b5865d]/20">
      <div className="mb-6">
        {clientSecret && <PaymentElement options={{
          layout: { type: 'tabs', defaultCollapsed: false },
          defaultValues: {
            billingDetails: {
              name: '',
              email: '',
              phone: '',
            }
          },
          business: {
            name: 'Gunsmart'
          }
        }} />}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        disabled={!stripe || loading}
        className="w-full py-4 px-6 bg-[#b5865d] hover:bg-[#96724d] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:hover:bg-[#b5865d]"
      >
        {!loading ? `Pay $${amount}` : "Processing Payment..."}
      </button>
    </form>
  );
};

export default CheckoutPage;