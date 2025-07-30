// ActionButton Component

import { Button } from "@/components/ui/button";
import { CurrencyLimit } from "@/types/payment.type";
import { cn } from "@/utils/cn";
import { useMemo } from "react";
export function ActionButton({
  amount,
  loading,
  isOverBalance,
  handleConfirm,
  className,
  countryCode,
  currencyLimit,
}: RenderButtonProps) {
  const isDisableButton = useMemo(() => {
    if (!amount || loading || isOverBalance || !countryCode || !currencyLimit)
      return true;
    // const amountNum = Number(amount);

    // if (amountNum < currencyLimit?.MinimunTranfer) return true;
    // if (amountNum > currencyLimit?.MaxTranfer) return true;

    // switch (countryCode) {
    //   case CONTRY_CODE.VietName:
    //     if (amountNum < 10000) return true;
    //     break;
    //   case CONTRY_CODE.Philippines:
    //     if (amountNum < 21.97) return true;
    //     break;
    //   case CONTRY_CODE.Thailand:
    //     if (amountNum < 12.59) return true;
    //     break;
    //   case CONTRY_CODE.Indonesia:
    //     if (amountNum < 6280.23) return true;
    //     break;
    // }
  }, [amount, loading, isOverBalance, countryCode, currencyLimit]);

  return (
    <Button
      disabled={isDisableButton}
      onClick={() => handleConfirm(amount)}
      className={cn(
        "w-full bg-primary-darker hover:bg-primary-dark text-primary",
        className
      )}
    >
      {loading ? "Confirming..." : "Confirm"}
    </Button>
  );
}
interface RenderButtonProps {
  amount: string;
  // invoice: IInvoice | null;
  loading: boolean;
  isOverBalance: boolean;
  handleConfirm: (amount: string) => Promise<void>;
  // handleContinue: () => Promise<void>;
  handleClearInput: () => void;
  className?: string;
  countryCode: string;
  currencyLimit: CurrencyLimit | undefined;
}
