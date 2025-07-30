import { SpinBanner } from "@/components/Banner/spin";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { TotalValueAssets } from "./TotalValueAssets";

export const MarketComponent = () => {
  return (
    <div
      className={cn(
        "bg-transparent max-w-[674px] !h-max w-full flex mx-auto flex-col gap-4 px-2.5 md:px-[30px] py-10",
        ""
      )}
      style={{
        minHeight: `calc(100svh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
      }}
    >
      <SpinBanner />
      {/* <TurnStablecoins /> */}
      {/* <PortfolioBarChart /> */}
      <TotalValueAssets />
      {/* <Allocations /> */}
    </div>
  );
};
