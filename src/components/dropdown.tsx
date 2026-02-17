"use client"

import { useState } from "react"

interface Option {
  size: string
  price: number
}

interface Props {
  options: Option[]
  selectedIndex: number
  onChange: (index: number) => void
}

export default function SizeDropdown({
  options,
  selectedIndex,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)

  const selected = options[selectedIndex]

  return (
    <div className="relative w-full flex items-center justify-center">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center bg-black text-white md:text-sm text-xs px-4 py-2 rounded-lg"
      >
        {selected.size} - ₹{selected.price}
      </button>

      {open && (
        <>
          <div
            className="fixed top-0 left-0 w-screen h-screen z-10"
            onClick={() => setOpen(false)}
          ></div>

          <div className="absolute flex flex-col items-center justify-center mt-1 w-full bg-white shadow-lg rounded-lg z-20">
            {options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(idx)
                  setOpen(false)
                }}
                className="px-4 flex items-center text-xs md:text-sm justify-center w-full py-2 hover:bg-gray-100 cursor-pointer"
              >
                {opt.size} - ₹{opt.price}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
