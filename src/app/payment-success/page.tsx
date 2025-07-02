export default function PaymentSuccess({
    searchParams: { amount },
  }: {
    searchParams: { amount: string };
  }) {
    return (    <main className="w-full h-screen px-10 py-8 text-white flex items-center justify-center ">
  <div className="max-w-md w-full text-center border border-white/30 rounded-xl p-8 shadow-xl">
    <h1 className="text-5xl font-extrabold mb-4">Thank you!</h1>
    <h2 className="text-2xl font-medium mb-6">You successfully paid</h2>
    
    <div className="bg-white text-primary  text-4xl font-bold py-4 rounded-lg shadow-sm">
      ${amount}
    </div>
  </div>
</main>


    );
  }