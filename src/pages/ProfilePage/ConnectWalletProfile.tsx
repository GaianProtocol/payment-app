import ButtonViolet from "@/components/Button/ButtonViolet";
import useSolBalance from "@/hooks/useSolBalance";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { isMobile } from "@/utils/devices";
import { ellipsisCenter } from "@/utils/ellipsis";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWalletProfile() {
  const { publicKey } = useWallet();
  const { balance } = useSolBalance();
  const formatBalance = () => {
    return <>{balanceDisplayer(balance, 3)} SOL</>;
  };
  return (
    <div
      className={cn(
        "bg-gradient-light backdrop-blur-[7px] border border-white border-opacity-10",
        "p-4 rounded-xl",
        "flex justify-between items-center"
      )}
    >
      <div className="flex gap-3 w-full justify-between items-center">
        <div className="flex gap-3 items-center">
          <ButtonViolet active={true}>01</ButtonViolet>
          <div className="uppercase font-medium text-sm">Connect wallet</div>
        </div>
        {publicKey ? (
          <button
            className={cn(
              "info-wallet text-xs font-normal flex items-center justify-center rounded-[70px] ",
              "md:px-63 divide-x-2 divide-white divide-opacity-30"
            )}
          >
            <span className="px-2 text-green-500">{formatBalance()}</span>
            <span className={cn("px-2", "text-white")}>
              {ellipsisCenter({
                str: publicKey.toString(),
                limit: isMobile() ? 4 : 6,
              })}
            </span>
          </button>
        ) : (
          <div className="connect-profile">
            <WalletMultiButton>
              <span className="text-sm font-medium tracking-[-0.02em]">
                Connect
              </span>
            </WalletMultiButton>
          </div>
        )}
      </div>
    </div>
  );
}
