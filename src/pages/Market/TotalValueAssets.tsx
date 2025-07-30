import DigitalWallet from "@/assets/images/digital-wallet-1.png";
import {
  ArrowDown,
  ArrowUp,
  Dollar,
  FileHistory,
  gUSD,
  ScanBarcode,
  Solana,
  Usdc,
  UsdStar,
  Usdt,
} from "@/assets/svgs";
import SendTokenPopup from "@/components/SendToken";
import useTokenGUSDInfo from "@/hooks/use-token-info";
import { useUser } from "@/hooks/use-user";
import useGetPrice from "@/hooks/useGetPrice";
import useSolBalance from "@/hooks/useSolBalance";
import useTokenBalanceSol from "@/hooks/useTokenBalanceSol";
import useTokenBalanceSolV2 from "@/hooks/useTokenBalanceSolV2";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/paths.route";
import { useTokenSuffix } from "@/store/tokenStore";
import { formatLargeNumber } from "@/utils/utils";
import { useFundWallet } from "@privy-io/react-auth/solana";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface PnlData {
  id: string;
  label: string;
  percentage: string;
  value: string;
  icon: any;
}
const network = import.meta.env.VITE_NETWORK || "devnet";

const pnlOptions: PnlData[] = [
  {
    id: "sol",
    label: "Solana Balance",
    percentage: "+12%",
    value: "",
    icon: Solana,
  },
  {
    id: "usdc",
    label: "USDC Balance",
    percentage: "+8,9%",
    value: "",
    icon: Usdc,
  },
  {
    id: "usdt",
    label: "USDT Balance",
    percentage: "+8,9%",
    value: "",
    icon: Usdt,
  },
  {
    id: "usd*",
    label: "USD* Balance",
    percentage: "+8,9%",
    value: "",
    icon: UsdStar,
  },
  {
    id: "gusd",
    label: "gUSD Balance",
    percentage: "+6%",
    value: "",
    icon: gUSD,
  },
];

interface ActionButton {
  id: string;
  text: string;
  icon: string;
  href?: string;
}

const actionButtons: ActionButton[] = [
  {
    id: "receive",
    text: "Receive",
    icon: ArrowDown,
  },
  {
    id: "send",
    text: "Send",
    icon: ArrowUp,
  },
  {
    id: "buy",
    text: "Buy",
    icon: Dollar,
  },
  {
    id: "pay",
    text: "Pay",
    icon: ScanBarcode,
    href: ROUTES.PAYMENT_METHOD,
  },
];

export const TotalValueAssets = () => {
  const navigator = useNavigate();
  const { tokens: tokensGUSD } = useTokenGUSDInfo();
  const { tokens } = useTokenBalanceSolV2();
  const { tokens: tokensSol } = useTokenBalanceSol();
  const { balance } = useSolBalance();
  const { price } = useGetPrice({});
  const suffix = useTokenSuffix();
  const { fundWallet } = useFundWallet();
  const { user } = useUser();

  const totalValueAssets = useMemo(() => {
    const balanceUSDC = tokens["USDC"] ?? 0;
    const balanceUSDStar = tokensSol[suffix.usdstar] ?? 0;
    const balanceUSDT = tokensSol[suffix.usdt] ?? 0;
    const balanceSol = balance * (price ?? 0);
    const total =
      balanceUSDC +
      tokensGUSD.balance +
      balanceSol +
      balanceUSDStar +
      balanceUSDT;
    return formatLargeNumber(total ?? 0);
  }, [tokensGUSD, balance, price, tokens, tokensSol, suffix]);

  const checkBalance = (id: string) => {
    switch (id) {
      case "sol":
        return balance;
      case "usdc":
        return network === "devnet"
          ? tokens["USDC"] ?? 0
          : tokensSol[suffix.usdc] ?? 0;
      case "usd*":
        return tokensSol[suffix.usdstar] ?? 0;
      case "usdt":
        return tokensSol[suffix.usdt] ?? 0;
      case "gusd":
        return tokensGUSD.balance;
      default:
        return 0;
    }
  };

  const handleClick = async (id: string) => {
    if (!user) return;
    console.log("id", id);
    // Receive
    if (id === actionButtons[0].id) {
      await fundWallet(user.privyUser.wallet?.address!, {
        amount: "0.01",
        uiConfig: {},
      });
    }
  };

  return (
    <div className="self-stretch p-6 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] flex flex-col justify-start items-start gap-4 overflow-hidden">
      {/* Header with Total Value Assets */}
      <div className="w-full flex justify-start items-start gap-4">
        <div className="flex-1 flex flex-col justify-start items-start gap-2">
          <div className="text-sm font-medium text-[#616566]">
            Total Value Assets
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="text-[32px] font-semibold text-[#151b11]">
              ${totalValueAssets}
            </div>
            {/* <div className="inline-flex justify-start items-center gap-2">
              <img src={Surface} alt="Surface icon" />
              <div className="text-sm font-semibold text-[#00baee]">
                26,559.37
              </div>
            </div> */}
          </div>
        </div>
        {/* File history icon */}
        <div className="w-11 h-11 p-3 bg-[#f5f8fa] rounded-full flex justify-center items-center">
          <img src={FileHistory} alt="File history" />
        </div>
      </div>

      {/* PNL Cards Section */}
      <div className="flex-wrap flex justify-between md:justify-start items-center gap-2 w-full md:w-3/4">
        {pnlOptions.map((item) => (
          <div
            key={item.id}
            className="md:min-w-[124px] max-md:flex-1 px-4 py-3 rounded-xl border flex flex-col justify-start items-start gap-2"
          >
            <div className="w-full text-xs font-medium leading-none text-[#a7acae] whitespace-nowrap">
              {item.label}
            </div>
            <div className="w-full flex flex-col justify-center items-start gap-1">
              <div className="text-sm md:text-xl font-semibold text-[#07a22c] flex items-center gap-1">
                <img src={item.icon} alt="" className="w-4 h-4" />
                {formatLargeNumber(checkBalance(item.id))}
              </div>
              {/* <div className="text-sm font-medium text-[#616566]">
                {item.value}
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between w-full items-start gap-2">
        {actionButtons.map((btn) => {
          return (
            <>
              {btn.id === actionButtons[1].id ? (
                <SendTokenPopup>
                  <div
                    key={btn.id}
                    className="flex flex-col justify-center items-center gap-2"
                  >
                    <div
                      onClick={() => {
                        btn.href && navigator(btn.href);
                        handleClick(btn.id);
                      }}
                      key={btn.id}
                      className={cn(
                        " bg-[#e1f8d3] cursor-pointer rounded-full flex justify-center items-center gap-2",
                        "md:w-[120px] h-10 md:pl-4 md:pr-5 md:py-3",
                        "max-md:aspect-square"
                      )}
                    >
                      <img src={btn.icon} alt={btn.text} />
                      <div className="text-sm max-md:hidden font-semibold text-[#163300]">
                        {btn.text}
                      </div>
                    </div>
                    <div className="text-sm md:hidden text-[#666666]">
                      {btn.text}
                    </div>
                  </div>
                </SendTokenPopup>
              ) : (
                <div
                  key={btn.id}
                  className="flex flex-col justify-center items-center gap-2"
                >
                  <div
                    onClick={() => {
                      btn.href && navigator(btn.href);
                      handleClick(btn.id);
                    }}
                    key={btn.id}
                    className={cn(
                      " bg-[#e1f8d3] cursor-pointer rounded-full flex justify-center items-center gap-2",
                      "md:w-[120px] h-10 md:pl-4 md:pr-5 md:py-3",
                      "max-md:aspect-square"
                    )}
                  >
                    <img src={btn.icon} alt={btn.text} />
                    <div className="text-sm max-md:hidden font-semibold text-[#163300]">
                      {btn.text}
                    </div>
                  </div>
                  <div className="text-sm md:hidden text-[#666666]">
                    {btn.text}
                  </div>
                </div>
              )}
            </>
          );
        })}
      </div>

      {/* Digital Wallet Image */}
      <img
        src={DigitalWallet}
        alt="Digital Wallet"
        className="absolute max-md:hidden bottom-20 right-8"
      />
    </div>
  );
};
