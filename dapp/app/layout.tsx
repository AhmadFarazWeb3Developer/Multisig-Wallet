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
      <body className="bg-[#1A1A1A]   sm:px-8 px-1 ">
        <Navbar />
        <ReownProvider>{children}</ReownProvider>
      </body>
    </html>
  );
}
