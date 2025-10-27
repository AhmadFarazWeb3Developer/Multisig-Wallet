"use client";

export default function HomePage() {
  return (
    <main className="hero-section flex  items-center justify-center  border-1 border-gray-400/10">
      <section className="text-center px-6 py-20 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 ">
          Secure Assets with <span className="">Multisig Wallets</span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl mb-10">
          Welcome to the multisig world — where security isn't optional, it's
          the foundation.
        </p>
        <button className="px-8 py-4  text-lg font-semibold rounded-full bg-[#eb5e28] text-white transition-all duration-300 shadow-lg ">
          Create Smart Account
        </button>
      </section>
    </main>
  );
}
