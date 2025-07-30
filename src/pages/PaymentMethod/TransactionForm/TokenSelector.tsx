import { EmptyWallet } from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ITokenOption } from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { ellipsisCenter } from "@/utils/ellipsis";
import { usePrivy } from "@privy-io/react-auth";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

const Methods = ["extend-wallet", "zero-pay"];
// TokenSelector Component
export function TokenSelector({
  selectedToken,
  tokenOptions,
  currentBalance,
  onSelect,
}: {
  selectedToken: ITokenOption;
  tokenOptions: ITokenOption[];
  currentBalance: number;
  onSelect: (token: ITokenOption) => void;
}) {
  const { user } = usePrivy();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);
  const [activeToken, setActiveToken] = useState(selectedToken);

  return (
    <div className="w-full relative p-2 py-2 bg-white rounded-xl shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] inline-flex justify-between items-center">
      <Drawer open={open} onOpenChange={(open) => setOpen(open)}>
        <DrawerTrigger asChild>
          <button type="button" className="flex items-center gap-4 w-full py-1">
            <div className="w-9 h-9 p-2 bg-slate-50 border rounded-full flex justify-center items-center">
              <img src={EmptyWallet} alt="Wallet" className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start flex-1 gap-0.5">
              <div className="text-xs font-normal text-zinc-400 leading-none">
                Available to send
              </div>
              <div className="flex items-center gap-1.5">
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-4 h-4"
                />
                <div className="text-sm font-semibold text-neutral-900">
                  {currentBalance} {selectedToken.symbol}
                </div>
              </div>
            </div>
            <div className="text-sm rounded-full px-3 py-2 bg-secondary text-[#161B12]">
              Change
            </div>
          </button>
        </DrawerTrigger>
        <DrawerContent className="rounded-t-lg border-t p-0 max-h-[90dvh]">
          <DrawerHeader className="p-0 pt-4">
            <Swiper
              slidesPerView={1.3}
              centeredSlides={true}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              onActiveIndexChange={(swiper: any) => {
                if (swiper) {
                  setActive(swiper.realIndex);
                }
              }}
              className="w-full "
            >
              <SwiperSlide>
                <div className="bg-[#1F1F1F] h-[180px] w-full rounded-3xl flex justify-center text-white text-lg items-center flex-col">
                  <img src={EmptyWallet} alt="" className="invert" />
                  {user &&
                    ellipsisCenter({
                      str: user.wallet?.address || "",
                      limit: 6,
                    })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-[#98e662] h-[180px] w-full rounded-3xl flex justify-center  text-lg items-center">
                  ZeroPay
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="flex justify-center gap-2 items-center mt-2 md:mt-6">
              {Methods.map((_, idx) => (
                <button
                  key={`slider-key-${idx}`}
                  onClick={() => {
                    setActive(idx);
                    swiperRef.current?.swiper.slideToLoop(idx);
                  }}
                  className={cn(
                    "w-[10px] h-2 rounded-full overflow-hidden transition-all duration-200 ease-in-out",
                    active === idx ? "bg-primary-darker w-7" : "bg-lightGray"
                  )}
                ></button>
              ))}
            </div>
          </DrawerHeader>
          <div className="flex flex-col gap-3 p-4 h-auto transition-all duration-200 ease-in-out max-h-[500px] overflow-auto">
            {tokenOptions.map((token) => (
              <div
                className={cn(
                  "self-stretch pl-4 pr-6 py-4 bg-white rounded-3xl inline-flex  justify-between items-center",
                  activeToken.symbol === token.symbol
                    ? "shadow-[0px_3px_15px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-[#9fe870]"
                    : "bg-secondary"
                )}
                onClick={() => {
                  setActiveToken(token);
                }}
                key={token.symbol}
              >
                <div className="flex justify-start items-center gap-4">
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="justify-start text-[#aeaeae] text-xs font-normal leading-none">
                      Available Balance
                    </div>
                    <div className="text-center justify-start text-[#1b1b1b] text-base font-semibold leading-normal">
                      {token.balance} {token.symbol}
                    </div>
                  </div>
                </div>
                <div className="w-6 h-6 relative">
                  <div
                    className={cn(
                      "w-5 h-5 left-[1.50px] rounded-full top-[1.50px] absolute ",
                      activeToken.symbol === token.symbol
                        ? "border-[5px] border-[#9fe870]"
                        : "border"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4">
            <Button
              disabled={activeToken.balance === 0}
              onClick={() => {
                onSelect(activeToken);
                setOpen(false);
              }}
              className={cn(
                "w-full bg-primary-darker hover:bg-primary-dark text-primary"
              )}
            >
              Confirm
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
