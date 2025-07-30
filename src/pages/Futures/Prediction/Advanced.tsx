import { cn } from "@/utils/cn";
import { useState } from "react";

export default function Advanced() {
  const [toggle, setToggle] = useState(true);
  const advances = [
    {
      title: "Fee",
      value: 0,
    },
    {
      title: "Total",
      value: 0,
    },
    {
      title: "Fee",
      value: 0,
    },
    {
      title: "Total",
      value: 0,
    },
  ];
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-between items-center">
        <span className="text-base font-normal tracking-base text-white">
          Advanced
        </span>
        <div
          onClick={() => setToggle((pre) => !pre)}
          className={cn(
            "transition-all duration-200",
            toggle ? "rotate-0" : "rotate-90"
          )}
        >
          <DownIcon />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          className={cn(
            "w-[150px] h-12 rounded-xl",
            "flex justify-center items-center",
            "bg-[#A9EE9B] text-black font-bold text-base tracking-base"
          )}
        >
          Buy/Long
        </button>
        <button
          className={cn(
            "w-[150px] h-12 rounded-xl",
            "flex justify-center items-center",
            "bg-[#FF7066] text-black font-bold text-base tracking-base"
          )}
        >
          Short/Sell
        </button>
      </div>

      {toggle && (
        <>
          <div className="w-full h-[1px] bg-[#2F3136]"></div>
          <div className="flex flex-col gap-2 w-full">
            {advances.map((advance, idx) => (
              <div
                key={`advance-${idx}`}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-normal text-[#7780A1] leading-[22px]">
                  {advance.title}
                </span>
                <span className="font-bold text-sm tracking-base text-white">
                  {advance.value.toFixed(2)} USDC
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DownIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.92 8.9502L13.4 15.4702C12.63 16.2402 11.37 16.2402 10.6 15.4702L4.08002 8.9502"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
