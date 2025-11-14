"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import Instances from "../blockchain-interaction/helper/instancesProvider";
import Interfaces from "../blockchain-interaction/helper/interfaces";

export default function HomePage() {
  const router = useRouter();
  const canvasRef = useRef(null);

  useEffect(() => {
    Interfaces();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      o: Math.random(),
    }));

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.fill();
      });
    }

    function animate() {
      stars.forEach(
        (s) => (s.o = 0.5 + 0.5 * Math.sin(Date.now() / 1000 + s.x))
      );
      drawStars();
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <main className="hero-section relative flex items-center justify-center overflow-hidden ">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full " />

      <section className="relative text-center px-6 py-10 max-w-3xl z-10">
        <h1 className="text-4xl  font-extrabold mb-6 text-white">
          Secure Assets with{" "}
          <span className="text-[#eb5e28]">Multisig Wallet</span>
        </h1>
        <p className="text-neutral-400 text-lg  mb-10">
          Welcome to Multisig era, where single-sig isn't enough.
        </p>
        <button
          onClick={() => router.push("/create-smart-account")}
          className="px-6 py-3 text-sm font-semibold rounded-full bg-[#eb5e28] text-white hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          Launch Smart Account
        </button>
      </section>
    </main>
  );
}
