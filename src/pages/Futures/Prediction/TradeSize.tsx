import swapSquare from "@/assets/svgs/switch-square.svg";
import solSquare from "@/assets/tokens/sol-square.svg";
import useSolBalance from "@/hooks/useSolBalance";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { useFormContext } from "react-hook-form";
import { FormValuesPrediction } from ".";

export default function TradeSize() {
  const { balance } = useSolBalance();
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<FormValuesPrediction>();

  const onMax = () => {
    setValue("amount", balance);
  };
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-start">
        <div className="text-[#7780A1] text-sm font-normal tracking-base">
          Trade Size
        </div>
        <button
          onClick={onMax}
          className="h-6 flex items-center justify-center px-2 border border-white border-opacity-15 rounded-lg"
        >
          <span className="text-sm font-normal text-white tracking-base">
            Max: {balanceDisplayer(balance)} SOL
          </span>
        </button>
      </div>
      <div className="flex h-[70px] px-5 rounded-2xl justify-between items-center bg-[#2F3136] border border-white border-opacity-15 relative">
        <input
          {...register("amount")}
          type="text"
          placeholder="0"
          className={cn(
            "bg-transparent w-full text-[32px] font-normal text-white",
            "focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          )}
        />
        <div
          className={cn(
            "absolute flex items-center gap-2 right-5 top-1/2 -translate-y-1/2",
            "h-8 bg-[#37393F] rounded-lg px-2"
          )}
        >
          <img className="w-5 h-5" src={solSquare} />
          <span className="text-base font-normal text-white">SOL</span>
          <img className="w-6 h-6" src={swapSquare} />
        </div>
      </div>
    </div>
  );
}
