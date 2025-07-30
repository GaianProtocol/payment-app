import DropdownIcon from "@/assets/svgs/dropdown.svg";
import ExploreIcon from "@/assets/svgs/explore-white.svg";
import ButtonViolet from "@/components/Button/ButtonViolet";
import { cn } from "@/utils/cn";
import { useState } from "react";

const depositOptions = [10, 20, 50, 100, 150];
export default function DepositModal() {
  const [deposit, setDeposit] = useState<number>(depositOptions[0]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4  rounded-xl pt-4">
      <div className="flex flex-col justify-center gap-2.5 self-stretch">
        <span className="font-semibold text-lg text-center uppercase text-gaming-gradient ">
          Ready to play?
        </span>
        <span className="font-normal text-sm text-center text-[#9CA3AF]">
          Choose your wager below
        </span>
      </div>
      <div className="flex flex-col gap-3 w-fit">
        <div className=" flex justify-between items-center px-5 py-3 border-card rounded-[70px] ">
          <span className="font-medium text-sm text-center text-white">
            ${deposit}
          </span>
          <div className="flex justify-center items-center gap-1 cursor-pointer">
            <span className="font-medium text-[12px] leading-[20px] text-center text-white">
              SOL
            </span>
            <img src={DropdownIcon} alt="" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {depositOptions.map(option => (
            <div
              key={option}
              onClick={() => setDeposit(option)}
              className={cn(
                "flex cursor-pointer justify-center items-center gap-2.5 grow px-5 py-1.5 max-w-[58px]",
                "border-card",
                "rounded-full",
                option === deposit
                  ? "bg-gradient-violet-light"
                  : "bg-gradient-light"
              )}
            >
              <span className="font-medium text-sm text-center text-white">
                ${option}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <ButtonViolet
          active
          className="mx-auto w-auto h-[50px] gap-3 group px-6"
        >
          <span className=" text-md uppercase text-center text-white ">
            Share with friends
          </span>
          <ButtonViolet className="md:w-5 md:h-5 w-4 h-4 text-black group-hover:scale-[1.2] transition-all duration-200 ">
            <img src={ExploreIcon} alt="" className="md:w-5 md:h-5 w-4 h-4" />
          </ButtonViolet>
        </ButtonViolet>
      </div>
    </div>
  );
}
