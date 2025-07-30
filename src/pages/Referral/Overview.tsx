import { Grapth, Point } from "@/assets/svgs";
import { useUser } from "@/hooks/use-user";
import { formatLargeNumber } from "@/utils/utils";

export const Overview = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="self-stretch p-4 md:p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] inline-flex flex-col justify-start items-start gap-6 overflow-hidden">
      <div className="inline-flex justify-center items-center gap-3">
        <img src={Grapth} alt="" />
        <div className="justify-start text-dark text-xl font-semibold">
          Refferal Overview
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-2">
        <div className="flex-1 w-full p-4 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] inline-flex flex-col justify-start items-start gap-2">
          <div className="justify-start text-[#616566] text-sm font-normal leading-tight">
            Frens
          </div>
          <div className="justify-start text-dark text-2xl font-semibold">
            {user.frens}
          </div>
        </div>
        <div className="flex-1 w-full p-4 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] inline-flex flex-col justify-start items-start gap-2">
          <div className="justify-start text-[#616566] text-sm font-normal leading-tight">
            My rank
          </div>
          <div className="justify-start text-dark text-2xl font-semibold">
            {user.rankPoint}
          </div>
        </div>
        <div className="flex-1 w-full p-4 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] inline-flex flex-col justify-start items-start gap-2">
          <div className="justify-start text-[#616566] text-sm font-normal leading-tight">
            GPoints
          </div>
          <div className="inline-flex justify-center items-center gap-2.5">
            <div className="w-5 h-5 relative">
              <img src={Point} alt="" />
            </div>
            <div className="justify-start text-dark text-2xl font-semibold">
              {formatLargeNumber(user.incomeEarned || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
