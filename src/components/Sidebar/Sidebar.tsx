import { cn } from "@/utils/cn";
import React, { ReactNode } from "react";

export default function Sidebar({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed top-0 !bg-[#000000] z-10 w-[100vw] h-[100vh]",
        isOpen && "right-0 duration-500",
        !isOpen && "-right-[100vw] duration-500"
      )}
    >
      {children}
    </div>
  );
}
