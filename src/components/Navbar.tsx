"use client";
import React, { useState, useEffect } from "react";
import { Monoton } from "next/font/google";
import Link from "next/link";
import { Menu, Search, ShoppingCart, UserRoundPen, X } from "lucide-react";

const monoton = Monoton({
  subsets: ["latin"],
  weight: "400",
});

function Navbar() {
  const [open, setOpen] = useState(false);

  // Optional: lock scroll when menu is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
  }, [open]);

  return (
    <nav className="w-full bg-white sticky top-0 z-[99999] text-black">
      {/* Main bar */}
      <div className="flex items-center justify-between md:p-3 md:px-8 p-2 bg-white shadow-md">
        <Link href="/" className={`${monoton.className} text-[#338ED1] md:text-2xl`}>
          POSTERBOYS
        </Link>

        {/* Desktop nav */}
        <div className="gap-12 md:flex hidden items-center justify-center">
          <Link href="/" className="text-sm font-semibold">Home</Link>
          <Link href="/collections" className="text-sm font-semibold">Collections</Link>
          <Link href="/about" className="text-sm font-semibold">Custom Poster</Link>
          <Link href="/about" className="text-sm font-semibold">More</Link>
          <Link href="/about" className="text-sm font-semibold">Review</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 md:gap-6">
          <button><Search className="h-5 md:h-6" /></button>
          <Link href="/" className="hidden md:flex"><UserRoundPen className="h-5 md:h-6" /></Link>
          <Link href="/" className=""><ShoppingCart className="h-5 md:h-6" /></Link>
          <button onClick={() => setOpen(true)} className="md:hidden">
            <Menu className="h-5 md:h-6" />
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div
  className={`fixed inset-0 z-[999999] bg-black text-white p-6 flex flex-col justify-between transform transition-transform duration-400 ease-in-out ${
    open ? "translate-y-0" : "-translate-y-full"
  }`}
>

        {/* Close button */}
        <div className="flex justify-between items-center mb-6">
        <Link href="/" className={`${monoton.className} text-white md:text-2xl`}>
          POSTERBOYS
        </Link>
          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-6 text-xl font-semibold text-center mt-12">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/collections" onClick={() => setOpen(false)}>Collections</Link>
          <Link href="/about" onClick={() => setOpen(false)}>Custom Poster</Link>
          <Link href="/about" onClick={() => setOpen(false)}>More</Link>
          <Link href="/about" onClick={() => setOpen(false)}>Review</Link>
          <Link href="/about" onClick={() => setOpen(false)}>Orders</Link>
          <Link href="/about" onClick={() => setOpen(false)}>Profile</Link>
        </div>

        {/* Bottom icons */}
        <div className="flex justify-center gap-8 mt-10">
        <p className='text-center text-[0.5rem] md:text-sm '>© 2025 POSTER BOYS</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
