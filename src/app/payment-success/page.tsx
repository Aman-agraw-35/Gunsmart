"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const router = useRouter();

  // Clear cart when payment success page loads
  useEffect(() => {
    const clearCart = async () => {
      try {
        // Clear the cart (both idProduct and Quantity arrays)
        const clearCartResponse = await fetch('/api/cart/clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store'  // Ensure we don't use cached response
        });

        if (!clearCartResponse.ok) {
          const errorText = await clearCartResponse.text();
          console.error('Failed to clear cart:', errorText);
          throw new Error(errorText);
        }

        const result = await clearCartResponse.json();
        if (!result.success) {
          console.error('Cart clearing was not successful');
        }
      } catch (err) {
        console.error('Error while clearing cart:', err);
      }
    };

    // Call clearCart immediately when component mounts
    clearCart();
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black border border-[#b5865d]/30 rounded-xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className="text-[#b5865d] text-6xl bg-transparent"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white bg-transparent">Payment Successful!</h1>
          <p className="text-gray-400 mb-6 bg-transparent">Thank you for your purchase</p>
          
          <div className="bg-[#1a1a1a] text-[#b5865d] text-4xl font-bold py-4 px-6 rounded-lg mb-8 border border-[#b5865d]/20">
            ${amount}
          </div>
          
          <div className="space-y-4 bg-transparent">
            <button
              onClick={() => router.push('/mainpage')}
              className="w-full bg-[#b5865d] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#96724d] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}