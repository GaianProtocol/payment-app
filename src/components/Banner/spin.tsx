import { LogoLight } from "@/assets/svgs";
import { ROUTES } from "@/routes/paths.route";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const SpinBanner = () => {
  const navigator = useNavigate();

  return (
    <div className="w-full bg-[#1b1c21] rounded-2xl overflow-hidden flex items-center justify-between relative">
      {/* Background circles */}
      <div className="w-80 h-80 bg-white/5 rounded-full absolute -left-[174.74px] -top-[11.80px]" />
      <div className="w-44 h-44 bg-primary/50 rounded-full blur-[50px] absolute right-[20px] bottom-[-50px]" />
      <div className="absolute -bottom-4 right-0">
        <img src="/images/wheel-banner.svg" alt="" />
      </div>

      {/* Content */}
      <div className="pl-5 pr-3 py-5 flex flex-col justify-start items-start gap-3 z-10">
        <div className="flex flex-col justify-center items-start gap-1">
          <div className="inline-flex justify-start items-center gap-1">
            <img src={LogoLight} alt="" />
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <div className="flex flex-col justify-start items-start gap-1.5">
            <div className="text-primary text-xl font-bold uppercase leading-tight font-sf-compact">
              Spin the Wheel – <br /> Win Daily Rewards!
            </div>
            <div className="text-[#d5d7d8] text-xs font-medium">
              Try your luck once a day and claim <br /> exciting prizes.
            </div>
          </div>
          <Button
            onClick={() => navigator(ROUTES.SPIN)}
            className="rounded-2xl text-dark"
          >
            Spin Now
          </Button>
        </div>
      </div>
    </div>
  );
};
