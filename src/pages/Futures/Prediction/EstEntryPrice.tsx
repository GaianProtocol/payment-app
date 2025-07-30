import { cn } from "@/utils/cn";
import { useFormContext } from "react-hook-form";
import { FormValuesPrediction } from ".";

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="7.5" stroke="#2F3136" />
    <path
      d="M8.58371 4.95C8.73371 5.1 8.81371 5.29 8.81371 5.51C8.81371 5.74 8.73371 5.93 8.58371 6.08C8.42371 6.24 8.23371 6.31 8.00371 6.31C7.76371 6.31 7.57371 6.24 7.41371 6.08C7.25371 5.93 7.18371 5.74 7.18371 5.51C7.18371 5.29 7.25371 5.1 7.41371 4.95C7.57371 4.8 7.76371 4.72 8.00371 4.72C8.23371 4.72 8.42371 4.8 8.58371 4.95ZM7.29371 6.86H8.70371V12H7.29371V6.86Z"
      fill="white"
      fill-opacity="0.15"
    />
  </svg>
);

export default function EstEntryPrice() {
  const { register } = useFormContext<FormValuesPrediction>();
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-[#7780A1] text-sm font-normal tracking-base">
            Est. Entry Price
          </span>
          <InfoIcon />
        </div>
      </div>
      <div className="flex h-14 px-5 rounded-2xl justify-between items-center bg-[#2F3136] border border-white border-opacity-15 relative">
        <input
          {...register("entryPrice")}
          placeholder="Enter here"
          className={cn(
            "bg-transparent w-full text-base font-normal text-white",
            "focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          )}
        />
      </div>
    </div>
  );
}
