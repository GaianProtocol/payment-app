import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export default function ButtonPrimary({
  children,
  className,
  active = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "rounded-full flex items-center text-center flex-row justify-center w-auto h-[40px] px-5 py-2",
        "text-base font-normal relative cursor-pointer leading-6",
        active ? "bg-primary text-darkGray" : "text-lightGray",
        className
      )}
    >
      {children}
    </button>
  );
}
