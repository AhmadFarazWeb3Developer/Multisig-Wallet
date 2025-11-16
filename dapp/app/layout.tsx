"use client";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { ReownProvider } from "./context/ReownProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#1A1A1A]  px-1 sm:px-8   ">
        <Navbar />
        <ReownProvider>{children}</ReownProvider>
      </body>
    </html>
  );
}
