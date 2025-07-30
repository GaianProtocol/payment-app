import loadingAnimation from "@/assets/images/loading.json";
import { SuccessPayment } from "@/assets/svgs";
import { IInvoice, PAYMENT_PHASES } from "@/types/payment.type";
import { ITokenOption } from "@/types/swap.type";
import { PAYMENT_STATUS } from "@/utils/constant";
import Lottie from "lottie-react";
import { AmountDisplay } from "./AmountDisplay";

type PaymentPhase = (typeof PAYMENT_PHASES)[number];
// Component: Displays payment status and amounts
export function PaymentStatusDisplay({
  status,
  invoice,
  token,
  paymentStatus,
}: {
  status: string;
  invoice: IInvoice;
  token: ITokenOption;
  paymentStatus: {
    title: string;
    subtitle?: string;
    text: string;
    bg: string;
  };
}) {
  return (
    <div className="flex flex-col justify-start items-center gap-6 self-stretch flex-1 relative">
      <div className="flex flex-col justify-center items-center gap-2 self-stretch">
        <div className="text-center text-xl font-semibold text-[#1b1b1b]">
          {paymentStatus.title}
        </div>
        {paymentStatus.subtitle && (
          <div className="text-center text-sm font-normal leading-tight text-[#1b1b1b] px-4">
            {paymentStatus.subtitle}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start items-center gap-2 self-stretch">
        {status === PAYMENT_STATUS.AWAITING_PAYMENT && (
          <div className="relative w-40 h-28 -translate-y-8">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        )}
        {status === PAYMENT_STATUS.SUCCESS && (
          <div className="relative">
            <img src={SuccessPayment} alt="" />
          </div>
        )}
        <AmountDisplay invoice={invoice} token={token} />
      </div>
    </div>
  );
}
