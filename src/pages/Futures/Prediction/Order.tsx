import { cn } from "@/utils/cn";
import { useState } from "react";

export default function Order() {
  const [tab, setTab] = useState("Market");
  return (
    <div className="flex">
      {["Market", "Limit"].map((name) => (
        <div
          key={name}
          onClick={() => setTab(name)}
          className={cn(
            "w-[112px] text-center relative h-[33px] cursor-pointer"
          )}
        >
          <span
            className={cn(
              tab === name ? "text-white" : "text-[#9CA1AF]",
              "text-base"
            )}
          >
            {name}
          </span>
          {name === tab && (
            <div
              style={{
                background:
                  "linear-gradient(90.08deg, #2B801A 13.85%, #A9EE9B 41.54%, #C8F5BF 94.21%, #FFFFFF 111.35%)",
              }}
              className="absolute bottom-0 left-0 right-0 h-[1px]"
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
