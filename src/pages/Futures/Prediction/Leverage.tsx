import { useRef } from "react";
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
export default function Leverage() {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const { watch, setValue } = useFormContext<FormValuesPrediction>();

  const leverage = watch("leverage");

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: any) => {
    if (progressBarRef.current) {
      const progressBarRect = progressBarRef.current.getBoundingClientRect();
      const offsetX = e.clientX - progressBarRect.left;

      // Clamp the offset to ensure the dragging element stays within the progress bar's width
      const clampedOffsetX = Math.max(
        0,
        Math.min(offsetX, progressBarRect.width)
      );
      const newProgress = (clampedOffsetX / progressBarRect.width) * 100; // Calculate percentage
      setValue("leverage", newProgress);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-[#7780A1] text-sm font-normal tracking-base">
            Leverage
          </span>
          <InfoIcon />
        </div>
      </div>
      <div
        className="relative ml-[30px] flex justify-between items-center"
        style={{
          width: "calc(100% - 60px)",
        }}
        ref={progressBarRef}
      >
        {new Array(5).fill(null).map((_, idx) => (
          <div
            key={`h-${idx}`}
            className="w-[2px] relative z-10 h-[10px] bg-[#404552]"
          ></div>
        ))}
        <div className="bg-[#2F3136] h-[3px] z-0 w-full absolute top-1/2 -translate-y-1/2 left-0 right-0"></div>
        <div
          id="dragging"
          className="bg-[#2F3136] z-[20] absolute top-1/2 -translate-y-1/2  border border-opacity-15 h-[23px] w-[60px] border-white rounded-lg flex items-center justify-center cursor-pointer"
          style={{ left: `calc(${leverage}% - 30px)` }}
          onMouseDown={handleMouseDown}
        >
          <span className="text-sm text-white font-normal">
            {leverage.toFixed(0)}x
          </span>
        </div>
      </div>
    </div>
  );
}
