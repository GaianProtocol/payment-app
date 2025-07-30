import ArrowLeft from "@/assets/icons/ArrowLeft";
import ArrowRight from "@/assets/icons/ArrowRight";
import SelectAvatarImg from "@/assets/images/select-avatar.png";
import ButtonViolet from "@/components/Button/ButtonViolet";
import useSolBalance from "@/hooks/useSolBalance";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function SelectAvatar() {
  const { publicKey } = useWallet();
  const { balance } = useSolBalance();
  const [active, setActive] = useState(true);
  const formatBalance = () => {
    return <>{balanceDisplayer(balance, 3)} SOL</>;
  };
  return (
    <div
      className={cn(
        "bg-gradient-light backdrop-blur-[7px] border border-white border-opacity-10",
        "p-4 rounded-xl"
      )}
    >
      <div className="flex gap-3 w-full justify-between items-center">
        <div className="flex gap-3 items-center">
          <ButtonViolet active={true}>02</ButtonViolet>
          <div className="uppercase font-medium text-sm">
            Select avatar From NFT{" "}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={cn(
              "rounded-full",
              "w-9 h-9 flex items-center justify-center",
              !active
                ? "bg-gradient-violet-light border border-[#7761CB66] border-opacity-40"
                : "bg-gradient-light border border-white border-opacity-10"
            )}
          >
            <ArrowLeft />
          </button>
          <button
            className={cn(
              "rounded-full",
              "w-9 h-9 flex items-center justify-center",
              active
                ? "bg-gradient-violet-light border border-[#7761CB66] border-opacity-40"
                : "bg-gradient-light border border-white border-opacity-10"
            )}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        {new Array(3).fill(null).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              " p-2 border rounded-xl",
              idx === 0
                ? "border-[#7761CB] bg-gradient-violet-2"
                : "border-white border-opacity-10 bg-gradient-light"
            )}
          >
            <img
              src={SelectAvatarImg}
              alt="Select avatar"
              className="w-[90px] h-[90px]"
            />
            <div
              className={cn(
                "text-xs font-medium text-center mt-2 uppercase",
                idx === 0 ? "text-[#7761CB]" : "text-white"
              )}
            >
              SMBGen2
            </div>
            <div
              className={cn(
                "text-xs font-medium text-center text-white",
                idx === 0 ? "" : "text-opacity-40"
              )}
            >
              #100
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
