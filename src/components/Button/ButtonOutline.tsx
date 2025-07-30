import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export default function ButtonOutline({
  children,
  className,
  active = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "rounded-2xl flex items-center bg-primary text-center flex-row justify-center w-full h-[56px]",
        "text-base font-normal relative cursor-pointer leading-6",
        "border border-[#0000004D]",
        " disabled:cursor-not-allowed disabled:bg-[#4f6154] disabled:text-black/50",
        className
      )}
    >
      {children}
    </button>
  );
}
