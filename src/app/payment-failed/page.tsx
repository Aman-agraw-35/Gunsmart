"use client";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black border border-[#b5865d]/30 rounded-xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <FontAwesomeIcon 
              icon={faTimesCircle} 
              className="text-red-500 text-6xl bg-transparent"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white bg-transparent">Payment Failed</h1>
          <p className="text-gray-400 mb-8 bg-transparent">
            We were unable to process your payment. Please try again.
          </p>
          
          <div className="space-y-4 bg-transparent">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-[#b5865d] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#96724d] transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => router.push('/cartpage')}
              className="w-full bg-transparent text-[#b5865d] py-3 px-6 rounded-lg font-semibold border border-[#b5865d] hover:bg-[#b5865d] hover:text-white transition-all"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}