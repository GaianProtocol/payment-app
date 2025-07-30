import { cn } from "@/utils/cn";
import { Delete } from "lucide-react";
import { Button } from "../ui/button";

// Numpad Component
const NUMPAD_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "000",
  "0",
];

export function Numpad({
  onKeyPress,
  actionButton,
}: {
  onKeyPress: (value: string) => void;
  actionButton: JSX.Element;
}) {
  return (
    <div className="w-full grid grid-cols-4 mt-4">
      <div className="col-span-3 grid grid-cols-3 border-b divide-x">
        {NUMPAD_KEYS.map((key) => (
          <button
            type="button"
            key={key}
            className="relative border-t h-12"
            onClick={() => onKeyPress(key)}
          >
            <div
              className={cn(
                "text-xl font-semibold text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                // key === "00" && "col-span-2"
              )}
            >
              {key}
            </div>
          </button>
        ))}
      </div>
      <div className="grid grid-rows-2 h-48">
        {actionButton}
        <Button
          type="button"
          onClick={() => onKeyPress("DEL")}
          className="inline-flex relative items-center justify-center bg-gray-100 !p-0  border w-full text-xl rounded-none font-semibold text-gray-700 hover:bg-gray-200"
        >
          <Delete className="!w-6 !h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </Button>
      </div>
    </div>
  );
}
