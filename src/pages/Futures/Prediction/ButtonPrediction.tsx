import { cn } from "@/utils/cn";
import { useFormContext } from "react-hook-form";

export default function ButtonPrediction() {
  const { setValue } = useFormContext(); // Use setValue to manually set the action value

  const handleClick = (value: string) => {
    setValue("action", value); // Manually set the action value before submitting
  };
  return (
    <div className="flex justify-between">
      <button
        type="submit"
        onClick={() => handleClick("buy")}
        className={cn(
          "w-[150px] h-12 rounded-xl",
          "flex justify-center items-center",
          "bg-[#A9EE9B] text-black font-bold text-base tracking-base",
          "hover:scale-105 transition-all duration-150"
        )}
      >
        Buy/Long
      </button>
      <button
        type="submit"
        onClick={() => handleClick("sell")}
        className={cn(
          "w-[150px] h-12 rounded-xl",
          "flex justify-center items-center",
          "bg-[#FF7066] text-black font-bold text-base tracking-base",
          "hover:scale-105 transition-all duration-150"
        )}
      >
        Short/Sell
      </button>
    </div>
  );
}
