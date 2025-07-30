import { ChevronLeft } from "lucide-react";

export function Header({ onBackClick }: { onBackClick: () => void }) {
  return (
    <div className="relative w-full">
      <div className="text-center text-base font-semibold text-[#1b1b1b]">
        Enter amount
      </div>
      <div
        className="absolute left-0 top-0 inline-flex items-center cursor-pointer"
        onClick={onBackClick}
      >
        <ChevronLeft color="#57803E" />
        <div className="text-sm font-semibold text-primary-dark">Back</div>
      </div>
    </div>
  );
}
