import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { HowItWork } from "./HowItWork";
import { InviteFriends } from "./InviteFriends";
import { LeaderBoard } from "./LeaderBoard";
import { Overview } from "./Overview";

export const ReferralComponent = () => {
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
      <InviteFriends />
      <Overview />
      <HowItWork />
      <LeaderBoard />
      {/* <PortfolioBarChart />
      <TotalValueAssets />
      <Allocations /> */}
    </div>
  );
};
