import SafeBox from "@/assets/images/save-box-1.png";
import { ArrowRightBlue, SurfaceBg } from "@/assets/svgs";
import { IoIosClose } from "react-icons/io";

export const TurnStablecoins = () => {
  return (
    <div className="self-stretch px-6 py-5 relative bg-[radial-gradient(ellipse_88.97%_236.83%_at_81.25%_52.50%,_#E5FFD8_1%,_#A6FF09_63%,_#82F23A_100%)] rounded-2xl inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
      <div className="absolute -rotate-[21.47deg] overflow-hidden rounded-full w-72 h-64 right-10 -top-7">
        <img src={SurfaceBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="text-[#151b11] text-xl font-bold">
          Turn Stablecoins into Passive Earnings!
        </div>
        <div className="text-black/50 text-xs font-medium">
          Deposit USDC, USDT, PYUSD, USDS
          <br />
          Earn interest with gUSD 📈
        </div>
      </div>
      <div className="px-4 py-2 bg-[#151b11] rounded-full inline-flex justify-center items-center gap-2.5">
        <div className="text-white text-sm font-semibold">Start Earn now</div>
        <img src={ArrowRightBlue} alt="" className="w-4 h-4" />
      </div>
      <div className="absolute overflow-hidden w-24 md:w-32 right-8 bottom-2 md:bottom-5">
        <img src={SafeBox} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="w-6 h-6 rounded-full bg-white absolute top-2 right-2 flex justify-center items-center">
        <IoIosClose className="text-xl" />
      </div>
    </div>
  );
};
