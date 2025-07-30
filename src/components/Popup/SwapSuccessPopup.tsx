import arrowRightIcon from "@/assets/svgs/arrow-right-white.svg";
import SucessIcon from "@/assets/svgs/success.svg";
import ethIcon from "@/assets/tokens/eth.svg";
import usdtIcon from "@/assets/tokens/usdc.svg";
import solIcon from "@/assets/tokens/ysol.svg";
import { useCloseModal } from "@/hooks/useModal";
import { TYPE_SWAP } from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { useEffect, useState } from "react";
import ButtonOutline from "../Button/ButtonOutline";

export default function SwapSuccessPopup({
  base,
  to,
  swapType,
  isEvm,
}: {
  base: {
    symbol: string;
    amount: string;
  };
  to: {
    symbol: string;
    amount: string;
  };
  swapType: TYPE_SWAP;
  isEvm?: boolean;
}) {
  const closeModal = useCloseModal();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const textShow = (swapType: TYPE_SWAP, isProcessing: boolean) => {
    switch (swapType) {
      case TYPE_SWAP.SWAP:
        return isProcessing ? "Transaction is processing" : "Swap Successfully";
      case TYPE_SWAP.BRIDGE:
        return isProcessing
          ? "Transfer is processing"
          : "Transfer Successfully";
      case TYPE_SWAP.MINT:
        return isProcessing ? "Mint is processing" : "Mint Successfully";
      case TYPE_SWAP.LIMIT:
        return isProcessing
          ? "Transaction is processing"
          : "Transaction Successfully";
    }
  };

  const textAction = (swapType: TYPE_SWAP) => {
    switch (swapType) {
      case TYPE_SWAP.SWAP:
        return "Swap";
      case TYPE_SWAP.BRIDGE:
        return "Transfer";
      case TYPE_SWAP.MINT:
        return "Mint";
      case TYPE_SWAP.LIMIT:
        return "Transaction";
    }
  };
  return (
    <div className="md:p-3 flex flex-col gap-3 md:gap-5 justify-center items-center">
      {!isProcessing ? (
        <img
          className="md:w-20 md:h-20 w-16 h-16 object-cover"
          src={SucessIcon}
        />
      ) : (
        <Loading />
      )}
      <div className="md:text-[32px] text-2xl font-bold tracking-base text-[#E9E9EB] whitespace-nowrap">
        {textShow(swapType, isProcessing)}
      </div>
      <div className="w-full max-w-[272px] mx-auto flex justify-between items-center">
        {swapType === TYPE_SWAP.BRIDGE ? (
          <img src={solIcon} className="w-14 h-14 rounded-full" />
        ) : (
          <img src={usdtIcon} className="w-14 h-14 rounded-full" />
        )}
        <img src={arrowRightIcon} className="w-6 h-6 rounded-full" />
        <div className="relative">
          {isEvm && (
            <img
              src={ethIcon}
              className="absolute w-6 h-6 rounded-full right-0 bottom-0"
            />
          )}
          <img src={solIcon} className="w-14 h-14 rounded-full" />
        </div>
      </div>
      <div
        className={cn(
          "bg-[#2F3136] rounded-lg border border-white border-opacity-15",
          "h-[86px] flex flex-col w-full gap-2 items-center justify-start p-3"
        )}
      >
        <div className="md:text-lg text-base font-bold tracking-base text-[#E9E9EB]">
          {textAction(swapType)} {balanceDisplayer(base.amount)} {base.symbol}{" "}
          for {balanceDisplayer(to.amount)} {to.symbol}
        </div>
        {!isProcessing && (
          <div className="tracking-base text-sm font-normal text-[#E9E9EB]">
            Confirm this transaction in your wallet.
          </div>
        )}
      </div>
      <ButtonOutline onClick={closeModal} disabled={isProcessing}>
        {isProcessing ? "Loading..." : "Done"}
      </ButtonOutline>
    </div>
  );
}

const Loading = () => {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className="flex items-center space-x-2 h-20 w-20"
    >
      <svg
        className="h-16 w-16 animate-spin stroke-slate-200"
        viewBox="0 0 256 256"
      >
        <line
          x1="128"
          y1="32"
          x2="128"
          y2="64"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="195.9"
          y1="60.1"
          x2="173.3"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="224"
          y1="128"
          x2="192"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="195.9"
          y1="195.9"
          x2="173.3"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="128"
          y1="224"
          x2="128"
          y2="192"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="60.1"
          y1="195.9"
          x2="82.7"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="32"
          y1="128"
          x2="64"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
        <line
          x1="60.1"
          y1="60.1"
          x2="82.7"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        ></line>
      </svg>
    </div>
  );
};
