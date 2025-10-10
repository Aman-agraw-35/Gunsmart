"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const router = useRouter();

  useEffect(() => {
    const clearCart = async () => {
      try {
        const clearCartResponse = await fetch("/api/cart/clear", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!clearCartResponse.ok) {
          const errorText = await clearCartResponse.text();
          console.error("Failed to clear cart:", errorText);
          throw new Error(errorText);
        }

        const result = await clearCartResponse.json();
        if (!result.success) {
          console.error("Cart clearing was not successful");
        }
      } catch (err) {
        console.error("Error while clearing cart:", err);
      }
    };

    clearCart();
  }, []);

  const displayAmount = typeof amount === "string" && amount ? amount : "0.00";

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-black border border-[#b5865d]/30 rounded-xl p-4 sm:p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-[#b5865d] text-4xl sm:text-6xl"
            />
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
            Payment Successful!
          </h1>

          <p className="text-sm sm:text-base text-gray-400 mb-4">
            Thank you for your purchase
          </p>

          <div className="bg-[#1a1a1a] text-[#b5865d] text-2xl sm:text-4xl font-bold py-3 sm:py-4 px-4 rounded-lg mb-6 border border-[#b5865d]/20 inline-block">
            ${displayAmount}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/mainpage")}
              className="w-full bg-[#b5865d] text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:bg-[#96724d] transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
