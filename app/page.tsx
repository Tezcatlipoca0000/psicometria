"use client";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const [display, setDisplay] = useState(false);

  function openTest() {
    setDisplay(!display);
  }

  return (
    
    <main className="h-screen w-full flex justify-center items-center">
      <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44" onClick={openTest}>
        Start
      </button>
      <div className={`${display ? 'block' : 'hidden'} w-2/3 h-3/4 bg-white border-1 border-gray-400 rounded-md fixed z-50 shadow-2xl drop-shadow-2xl`}>

      </div>
    </main>
        
  );
}
