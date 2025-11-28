"use client";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { ReownProvider } from "./context/ReownProvider";
import { Toaster } from "sonner";
import { UiProvider } from "./context/UiProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#1A1A1A]  px-1 sm:px-8   ">
        <UiProvider>
          <Toaster
            position="top-center"
            theme="dark"
            className="!justify-center sm:!justify-center md:!justify-end md:!items-start"
          />
          <Navbar />
          <ReownProvider>{children}</ReownProvider>
        </UiProvider>
      </body>
    </html>
  );
}
