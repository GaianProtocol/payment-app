import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export default function ButtonViolet({
  children,
  className,
  active = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "rounded-full flex items-center justify-center",
        "text-xs font-medium relative",
        active ? "w-[34px] h-[34px]" : "w-[42px] h-[42px]",
        active
          ? "bg-gradient-violet"
          : "bg-gradient-light border border-white border-opacity-10",
        active &&
          "before:absolute before:inset-0 before:bg-white before:bg-opacity-10 before:border before:border-white before:border-opacity-10 before:rounded-full",
        className
      )}
    >
      {children}
    </button>
  );
}
