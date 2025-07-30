import { cn } from "@/lib/utils";
import React from "react";

export interface RowFieldProps {
  label: string;
  value: React.ReactNode;
  extra?: React.ReactNode;
  border?: boolean;
}

export function RowField({ label, value, extra, border }: RowFieldProps) {
  return (
    <div
      className={cn(
        "self-stretch py-2 inline-flex justify-between items-center",
        border ? "border-b border-[#e2e8ea]" : ""
      )}
    >
      <div className="text-left text-[#616566] text-xs font-medium leading-tight">
        {label}
      </div>
      {extra ? (
        <div className="flex-1 flex justify-end items-center gap-2">
          <div className="text-right text-[#1b1b1b] text-xs font-medium">
            {value}
          </div>
          {extra}
        </div>
      ) : (
        <div className="text-right text-[#1b1b1b] text-xs font-medium leading-tight">
          {value}
        </div>
      )}
    </div>
  );
}
