import { Gift, MedalSolid, SendPlane, UserAdd } from "@/assets/svgs";

export const HowItWork = () => {
  return (
    <div className=" p-4 md:p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] inline-flex flex-col justify-start items-start gap-8 overflow-hidden">
      <div className="inline-flex justify-center items-center gap-3">
        <div className="w-5 h-5 relative overflow-hidden">
          <img src={MedalSolid} alt="" />
        </div>
        <div className="justify-start text-[#151b11] text-xl font-semibold">
          How to Refer and Earn Rewards?
        </div>
      </div>
      <div className="self-stretch px-4 relative flex flex-col justify-start items-start gap-10">
        <div className="h-[150px] left-[33.66px] top-1/2 -translate-y-1/2 absolute origin-top-left outline outline-1 outline-[#ffd731]"></div>

        <div className="self-stretch relative z-10 inline-flex justify-center items-start gap-8">
          <div className="w-9 h-9 p-1 bg-primary border-b border-[#00dc34] shadow-[0px_4px_4px_0px_rgba(12,161,45,0.35)]   rounded-[10px] flex justify-center items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={SendPlane} alt="" className="w-full h-full" />
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-2 h-2 bg-[#00dc34] rounded-full" />
              <div className="justify-start text-[#151b11] text-sm font-bold leading-tight">
                Share Referral Code / Link
              </div>
            </div>
            <div className=" justify-start text-[#616566] text-sm font-normal leading-tight">
              Share Your Referral Code and Invite Friends!
            </div>
          </div>
        </div>
        <div className="self-stretch relative z-10 inline-flex justify-center items-start gap-8">
          <div className="w-9 h-9 p-1 bg-primary border-b border-[#00dc34] shadow-[0px_4px_4px_0px_rgba(12,161,45,0.35)]   rounded-[10px] flex justify-center items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={UserAdd} alt="" className="w-full h-full" />
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-2 h-2 bg-[#00dc34] rounded-full" />
              <div className="justify-start text-[#151b11] text-sm font-bold leading-tight">
                Link with Friends
              </div>
            </div>
            <div className=" justify-start text-[#616566] text-sm font-normal leading-tight">
              Invitees will be linked to you after account sign up
            </div>
          </div>
        </div>
        <div className="self-stretch relative z-10 inline-flex justify-center items-start gap-8">
          <div className="w-9 h-9 p-1 bg-primary border-b border-[#00dc34] shadow-[0px_4px_4px_0px_rgba(12,161,45,0.35)]   rounded-[10px] flex justify-center items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={Gift} alt="" className="w-full h-full" />
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-2 h-2 bg-[#00dc34] rounded-full" />
              <div className="justify-start text-[#151b11] text-sm font-bold leading-tight">
                Unlock Rewards
              </div>
            </div>
            <div className=" justify-start text-[#616566] text-sm font-normal leading-tight">
              Automatically earn commission when your invitees complete a
              deposit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
