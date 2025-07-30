import {
  ArrowRight,
  CodeScanBlue,
  Explore,
  WalletBlue,
  Wifi,
} from "@/assets/svgs";
import { ROUTES } from "@/routes/paths.route";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

interface PaymentOption {
  id: string;
  title: string;
  comingSoon: boolean;
  iconRight?: React.ReactNode;
  iconLeft: string;
  link?: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "qr",
    title: "Scan QR Code",
    comingSoon: false,
    iconRight: <img src={Explore} className="w-6 h-6" alt="" />,
    iconLeft: CodeScanBlue,
    link: ROUTES.SCAN_QR,
  },
  {
    id: "pay",
    title: "Pay Someone",
    comingSoon: true,
    iconLeft: WalletBlue,
  },
  {
    id: "tap",
    title: "Tap to Pay",
    comingSoon: true,
    iconLeft: Wifi,
  },
];

export const PaymentMethodComponent = () => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "bg-transparent max-w-[674px] !h-max w-full flex mx-auto flex-col gap-4 px-2.5 md:px-[30px] py-16"
      )}
      style={{
        minHeight: `calc(100svh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
      }}
    >
      <div className="mx-auto w-full md:w-[450px] bg-white p-5 rounded-3xl relative border flex flex-col justify-center items-center gap-8 overflow-hidden">
        {/* Header */}
        <div className="w-full flex md:justify-center items-center gap-2">
          <div
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="md:absolute left-4"
          >
            <img src={ArrowRight} className="w-6 h-6 rotate-180" alt="" />
          </div>
          <div className="text-xl font-semibold">
            Choose Your Payment Method
          </div>
        </div>

        {/* Payment Options */}
        <div className="w-full flex flex-col gap-3">
          {paymentOptions.map((option) => (
            <div
              onClick={() => option.link && navigate(option.link)}
              key={option.id}
              className={cn(
                "w-full flex justify-between items-center gap-8 px-4 h-24 rounded-3xl border",
                option.id === "qr"
                  ? "pl-4 pr-6 bg-gradient-to-r from-[#D3F4BD]/0 to-[#D3F4BD]/40"
                  : "bg-bg-surface-white-0"
              )}
            >
              <div className="flex flex-1 items-center gap-4">
                {option.iconLeft && (
                  <div className="w-16 h-16 flex items-center justify-center p-2 rounded-full bg-slate-100">
                    <div className="w-full h-full border rounded-full flex items-center justify-center bg-white shadow-md shadow-[#9FE870] ">
                      <img src={option.iconLeft} alt="" />
                    </div>
                  </div>
                )}
                <div className="text-center text-xl font-semibold whitespace-nowrap">
                  {option.title}
                </div>
              </div>
              {option.iconRight && <div>{option.iconRight}</div>}
              {option.comingSoon && (
                <div className="px-3 py-1.5 bg-slate-100 rounded-md flex justify-center items-center">
                  <div className="text-center text-xs font-semibold text-zinc-400 leading-none">
                    Coming soon
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
