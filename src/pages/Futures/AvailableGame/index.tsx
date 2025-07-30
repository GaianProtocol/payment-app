import noiseGradientsImg from "@/assets/images/noise.png";
import samsetImg from "@/assets/images/sam-set.png";
import { cn } from "@/utils/cn";
export default function AvailableGame() {
  return (
    <div
      className={cn(
        " border border-white border-opacity-15 h-[604px] relative rounded-xl overflow-hidden",
        "w-full p-6 max-w-[422px] rounded-[20px] flex flex-col gap-5 bg-center bg-no-repeat lg:mt-20 md:mt-12 mt-8"
      )}
      style={{
        background: `url(${noiseGradientsImg})`,
      }}
    >
      <button
        className={cn(
          "flex items-center justify-center gap-2.5 bg-[#2F3136] border border-white border-opacity-15",
          "w-[114px] h-8 rounded-[10px] ml-auto relative z-10"
        )}
      >
        <span className="text-white text-sm font-normal tracking-base">
          My records
        </span>
        <ArrowDown />
      </button>
      <div className="flex flex-col gap-5 w-full relative z-10">
        <div className="text-2xl text-white font-bold text-center tracking-base">
          Available gems
        </div>
        <div className="text-[64px] leading-[64px] font-bold text-[#86BB7D] text-center">
          200
        </div>
        <div className="flex flex-col w-full gap-5">
          <div className="text-[20px] leading-6 text-white text-center">
            BTC Price
          </div>
          <div className="flex justify-between gap-3">
            {"$748811".split("").map((element, idx) => (
              <div
                className="w-[42px] h-[56px] border-[2px] border-[#4B4B4B] rounded-xl flex items-center justify-center"
                key={`key-${idx}`}
              >
                <span className="text-base text-white font-bold tracking-base">
                  {element}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="flex gap-2 items-center justify-center">
            <img src={samsetImg} />
            <div className="text-base font-normal text-white">
              9/<span className="text-[#ffc14a]">10</span>
            </div>
          </div>

          <div>
            <div className="text-center text-base font-normal tracking-base text-white text-opacity-50">
              Refilling in 9s
            </div>
            <div className="text-white text-xl tracking-base text-center mt-2">
              Guess the BTC price in the next{" "}
              <span className="text-[#23C965]">5 secs</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-5">
            <button
              className={cn(
                "w-[150px] h-12 rounded-xl",
                "flex justify-center items-center",
                "bg-[#A9EE9B] text-black font-bold text-base tracking-base"
              )}
            >
              UP
            </button>
            <button
              className={cn(
                "w-[150px] h-12 rounded-xl",
                "flex justify-center items-center",
                "bg-[#FF7066] text-black font-bold text-base tracking-base"
              )}
            >
              DOWN
            </button>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <div className="text-[#539146] text-base font-bold tracking-base text-center">
              Terms & conditions
            </div>
            <div className="text-sm font-normal text-white">
              Trade on Gaian to participate airdrop campaign
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.28 5.9668L8.9333 10.3135C8.41997 10.8268 7.57997 10.8268 7.06664 10.3135L2.71997 5.9668"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
