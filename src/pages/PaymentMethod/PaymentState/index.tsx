import BgPayment from "@/assets/images/bg-payment.png";
import { gUSD, Usdc, UsdStar, Usdt } from "@/assets/svgs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import paymentService from "@/services/payment.service";
import { IInvoice, Payment } from "@/types/payment.type";
import { ITokenOption } from "@/types/swap.type";
import { PAYMENT_STATUS } from "@/utils/constant";
import { useEffect, useMemo, useState } from "react";
import { ActionButtons } from "./ActionButtons";
import { PaymentStatusDisplay } from "./PaymentStatusDisplay";
import { TransactionProgress } from "./TransactionProgress";

export interface TransactionFormProps {
  invoiceId: number;
}

const TokenOptions: ITokenOption[] = [
  {
    name: "USDC",
    logoURI: Usdc,
    symbol: "USDC",
  },
  {
    name: "USD*",
    logoURI: UsdStar,
    symbol: "USD*",
  },
  {
    name: "USDT",
    logoURI: Usdt,
    symbol: "USDT",
  },
  {
    name: "gUSD",
    logoURI: gUSD,
    symbol: "gUSD",
  },
];

const checkStepProgress = (statusCrypto: string, statusFiat: string) => {
  let step = 0;
  switch (statusCrypto) {
    case PAYMENT_STATUS.AWAITING_PAYMENT:
      step = 0;
      break;
    case PAYMENT_STATUS.SUCCESS:
      step = 1;
      break;
    default:
      break;
  }
  switch (statusFiat) {
    case PAYMENT_STATUS.AWAITING_PAYMENT:
      step = 1;
      break;
    case PAYMENT_STATUS.SUCCESS:
      step = 2;
      break;
    default:
      break;
  }

  return step;
};
export function PaymentState({ invoiceId }: TransactionFormProps) {
  const [status, setStatus] = useState<string>(PAYMENT_STATUS.AWAITING_PAYMENT);
  const [stepProgress, setStepProgress] = useState(0);
  const [invoice, setInvoice] = useState<IInvoice>();
  const [tokenSelected, setTokenSelected] = useState<ITokenOption>(
    TokenOptions[0]
  );
  const [destinationAddress, setDestinationAddress] = useState<string | null>(
    null
  );
  const txPaymentUSD = useMemo(() => {
    if (!invoice || !invoice.CryptoPayment) return "";
    return invoice.CryptoPayment.TransactionID;
  }, [invoice]);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(invoiceId);

      const interval = setInterval(() => {
        fetchInvoice(invoiceId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [invoiceId]);

  const fetchInvoice = async (invoiceId: number) => {
    try {
      const result = await paymentService.getInvoice(invoiceId);
      if (result) {
        const invoice = result.invoice as IInvoice;
        setInvoice(invoice);
        const newStepProgress = checkStepProgress(
          invoice.StatusCrypto,
          invoice.StatusFiat
        );
        if (invoice.Status) {
          setStatus(invoice.Status);
        }
        if (newStepProgress !== stepProgress) {
          setStepProgress(newStepProgress);
        }
        const txCrypto: Payment = result.invoice.CryptoPayment;
        const tokenSelected = TokenOptions.find(
          (token) => token.symbol === txCrypto.Currency
        );
        if (tokenSelected) {
          setTokenSelected(tokenSelected);
        }

        if (result.reciverAddress) {
          setDestinationAddress(result.reciverAddress);
        }
      }
    } catch (error) {
      console.log("🚀 ~ updateTx ~ error:", error);
    }
  };

  const paymentStatus = useMemo(() => {
    switch (status) {
      case PAYMENT_STATUS.AWAITING_PAYMENT:
        return {
          title: "Payment Processing",
          subtitle: "Almost there! Your payment is on the way",
          text: "Processing",
          bg: "bg-gradient-to-b from-[#ffd731]/50 via-transparent to-transparent",
        };
      case PAYMENT_STATUS.FAILED:
        return {
          title: "Payment Failed",
          subtitle:
            "Your payment has failed. The refund for your transaction will be processed within 24 hours.",
          text: "Processing",
          bg: "bg-gradient-to-b from-[#ffd731]/50 via-transparent to-transparent",
        };
      case PAYMENT_STATUS.REFUND:
        return {
          title: "Payment Refunding",
          subtitle: "The transaction refund will be processing in 24hours.",
          text: "Processing",
          bg: "bg-gradient-to-b from-[#ffd731]/50 via-transparent to-transparent",
        };
      case PAYMENT_STATUS.REFUNDED:
        return {
          title: "Payment Refunded",
          subtitle: "Your payment has been refunded",
          text: "Completed",
          bg: "bg-gradient-to-b from-[#9FE86C]/50 via-transparent to-transparent",
        };
      case PAYMENT_STATUS.SUCCESS:
        return {
          title: "Payment Successful!",
          text: "Completed",
          bg: "bg-gradient-to-b from-[#9FE86C]/90 via-transparent to-transparent",
        };
      default:
        return {
          title: "Payment Processing",
          text: "Processing",
          bg: "bg-gradient-to-b from-[#ffd731]/50 via-transparent to-transparent",
        };
    }
  }, [status]);

  if (!invoice)
    return (
      <div className="w-full p-4 h-[400px]">
        <div
          className={cn(
            "rounded-3xl inline-flex flex-col h-full justify-center items-center overflow-hidden w-full mx-auto relative"
          )}
        >
          <div
            className={cn(
              "h-[500px] w-full absolute top-0 z-[-1]",
              paymentStatus.bg
            )}
          >
            <img
              src={BgPayment}
              alt="bg"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-start items-center gap-5 w-full pt-8 rounded-bl-3xl rounded-br-3xl flex-1">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    );
  return (
    <div className="w-full p-4">
      <div
        className={cn(
          "rounded-3xl inline-flex flex-col justify-center items-center overflow-hidden w-full mx-auto relative"
        )}
      >
        <div
          className={cn(
            "h-[500px] w-full absolute top-0 z-[-1]",
            paymentStatus.bg
          )}
        >
          <img
            src={BgPayment}
            alt="bg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-start items-center gap-5 w-full pt-8 rounded-bl-3xl rounded-br-3xl flex-1">
          <PaymentStatusDisplay
            status={status}
            invoice={invoice}
            token={tokenSelected}
            paymentStatus={paymentStatus}
          />
          <TransactionProgress
            stepProgress={stepProgress}
            tx={txPaymentUSD || ""}
            address={destinationAddress || ""}
            invoice={invoice}
          />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
