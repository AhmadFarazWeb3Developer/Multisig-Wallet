"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="hero-section flex  items-center justify-center  border-t-1 border-gray-400/10 ">
      <section className="text-center px-6 py-20 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white ">
          Secure Assets with <span className="">Multisig Wallet</span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl mb-10">
          Welcome to Multisig era, where single-sig isn't enough.
        </p>
        <button
          onClick={() => router.push("/create-smart-account")}
          className="px-8 py-4 text-md font-semibold rounded-full bg-[#eb5e28] text-white hover:bg-[#eb5e28] hover:transition-all duration-300 scale-105 shadow-lg cursor-pointer"
        >
          Launch Smart Account
        </button>
      </section>
    </main>
  );
}
