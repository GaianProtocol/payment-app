import arrowDownIcon from "@/assets/svgs/arrow-down.svg";
import SucessIcon from "@/assets/svgs/success.svg";
import solIcon from "@/assets/tokens/ysol.svg";
import { useCloseModal } from "@/hooks/useModal";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import ButtonOutline from "../Button/ButtonOutline";

export default function MintSuccessPopup({
  mint,
  receive,
  isRedeem = false,
}: {
  mint: {
    symbol: string;
    amount: string;
  };
  receive: {
    token01: {
      symbol: string;
      amount: string;
    };
    token02: {
      symbol: string;
      amount: string;
    };
  };
  isRedeem?: boolean;
}) {
  const closeModal = useCloseModal();
  return (
    <div className="md:p-3 flex flex-col gap-3 md:gap-5 justify-center items-center">
      <img
        className="md:w-20 md:h-20 w-16 h-16 object-cover"
        src={SucessIcon}
      />
      <div className="md:text-[32px] text-2xl font-bold tracking-base text-[#E9E9EB]">
        {isRedeem ? "Redeem" : "Mint"} Successfully
      </div>
      <div
        className={cn(
          "w-full flex gap-3 md:gap-5",
          isRedeem ? "flex-col-reverse" : "flex-col"
        )}
      >
        <div className="md:h-[88px] h-[60px] w-full bg-[#202225] border border-white border-opacity-15 rounded-[20px] p-8 flex items-center justify-between">
          <div className="text-sm font-normal text-[#7780A1] tracking-base">
            You're Mining
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-bold text-[#E9E9EB]">
              {balanceDisplayer(mint.amount)} {mint.symbol}
            </span>
            <img src={solIcon} className="w-6 h-6" />
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="bg-[#202225] w-full h-[1px]"></div>
          <button className="bg-[#202225] rounded-full mx-4 flex items-center justify-center min-w-11 h-11">
            <img src={arrowDownIcon} className="w-6 h-6" />
          </button>
          <div className="bg-[#202225] w-full h-[1px]"></div>
        </div>
        <div className="md:h-[120px] h-[100px] w-full bg-[#202225] border border-white border-opacity-15 rounded-[20px] p-8 flex  justify-between">
          <div className="text-sm font-normal text-[#7780A1] tracking-base">
            You're Receive
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <span className="text-lg font-bold text-[#E9E9EB]">
                {balanceDisplayer(receive.token01.amount)}{" "}
                {receive.token01.symbol}
              </span>
              <img src={solIcon} className="w-6 h-6" />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-lg font-bold text-[#E9E9EB]">
                {balanceDisplayer(receive.token02.amount)}{" "}
                {receive.token02.symbol}
              </span>
              <img src={solIcon} className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      <ButtonOutline onClick={closeModal}>Done</ButtonOutline>
    </div>
  );
}
