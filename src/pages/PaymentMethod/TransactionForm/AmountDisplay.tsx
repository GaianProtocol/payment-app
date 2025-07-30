import { CurrencyLimit } from "@/types/payment.type";
import { ITokenOption } from "@/types/swap.type";
import { calcUSDCWithFee } from "@/utils/utils";
import { useMemo } from "react";

const formatAmount = (amount: string): string => {
  if (!amount) return "0";

  const [integerPart, decimalPart = ""] = amount.split(".");

  const formattedInteger = Number(integerPart || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (!decimalPart) {
    return amount.endsWith(".") ? `${formattedInteger}.` : formattedInteger;
  }

  return `${formattedInteger}.${decimalPart}`;
};

export function AmountDisplay({
  amount,
  tokenSelected,
  onClick,
  isOverLimit,
  rateUSD,
  amountRef,
  currencyCountry,
  currencyLimit,
}: {
  amount: string;
  tokenSelected: ITokenOption;
  onClick: () => void;
  isOverLimit: boolean;
  rateUSD: number;
  amountRef: React.RefObject<HTMLDivElement>;
  currencyCountry: string;
  currencyLimit: CurrencyLimit | undefined;
}) {
  const amountUSD = useMemo(() => {
    if (!amount || !rateUSD) return 0;
    // Convert to number, ignoring trailing decimal for calculation
    return Number(amount.replace(/\.+$/, "")) / rateUSD;
  }, [amount, rateUSD]);

  const amountWithRate = calcUSDCWithFee(
    amountUSD,
    currencyLimit?.MinimunFee,
    currencyLimit?.TranferFee,
    currencyLimit?.FixedFee
  );

  return (
    <div
      ref={amountRef}
      className="flex-1 py-8 w-full rounded-xl border outline-[#e2e8ea] flex flex-col items-center gap-6"
      id="amount-input"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="text-sm font-semibold text-[#616566]">Amount</div>
        <div className="flex items-center gap-1 w-full justify-center overflow-hidden">
          <div
            className={`text-4xl font-semibold cursor-pointer ${
              isOverLimit ? "text-red-500" : "text-[#161B12]"
            }`}
            onClick={onClick}
          >
            {formatAmount(amount)}
          </div>
          <div className="mt-1 text-2xl font-semibold text-[#9fe870]">
            {currencyCountry}
          </div>
        </div>
        <div className="flex flex-col items-center">
          {!!amountUSD && (
            <div className="text-[#cfd6d8]">
              {amountWithRate.total} {tokenSelected.symbol}
            </div>
          )}
          {!!rateUSD && (
            <div className="text-[#616566] text-sm">
              1 {tokenSelected.symbol} ={" "}
              {rateUSD.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 6,
              })}{" "}
              {currencyCountry}
            </div>
          )}
          {isOverLimit && (
            <div className="text-red-500 text-sm">Insufficient balance!</div>
          )}
        </div>
      </div>
    </div>
  );
}
