import MintMiddleSVG from "@/assets/svgs/arrow-down.svg";
import jsolImg from "@/assets/tokens/jsol.png";
import ysolIcon from "@/assets/tokens/ysol.svg";
import ButtonOutline from "@/components/Button/ButtonOutline";
import MintSuccessPopup from "@/components/Popup/MintSuccessPopup";
import useMint from "@/hooks/useMint";
import { useToggleModal } from "@/hooks/useModal";
import useSolBalance from "@/hooks/useSolBalance";
import useTokenBalanceSol from "@/hooks/useTokenBalanceSol";
import { usePriceSol, useTokenSuffix } from "@/store/tokenStore";
import { E_TYPE_ACTION_MINT, ITokenOption, TYPE_SWAP } from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { NETWORK } from "@/utils/constant";
import { tokenAddresses } from "@/utils/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TokenBoxPrimary from "./TokenBoxPrimary";

const RedeemTab = () => {
  const { balance } = useSolBalance();
  const { tokens } = useTokenBalanceSol();
  const [valueInput, setValueInput] = useState<string>("");
  const [valueOutput, setValueOutput] = useState<string>("");
  const [swap, setSwap] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { publicKey } = useWallet();
  const { onRedeemSol, onRedeemMSol } = useMint();
  const suffix = useTokenSuffix();
  const [loading, setLoading] = useState(false);
  const toggleModal = useToggleModal();
  const price = usePriceSol();
  const options: ITokenOption[] = useMemo(
    () => [
      {
        symbol: "SOL",
        logoURI: ysolIcon,
        name: "Solana",
        address: "So11111111111111111111111111111111111111112",
        balance: balance,
      },
      {
        symbol: "MSOL",
        logoURI: ysolIcon,
        name: "Marinate Staked SOL",
        address: tokenAddresses[NETWORK].msol.toString(),
        balance: tokens[suffix.msol],
      },
      {
        symbol: "JSOL",
        logoURI: jsolImg,
        name: "Jupiter Staked SOL",
        address: tokenAddresses[NETWORK].msol.toString(),
        balance: tokens[suffix.msol],
      },
    ],
    [balance, tokens]
  );

  const [tokenSelected, setTokenSelected] = useState<ITokenOption>(options[0]);

  const maxMount = useMemo(() => {
    if (tokenSelected.symbol === "SOL") {
      return Math.min(tokens[suffix.yt], tokens[suffix.pt]);
    }
    return Math.min(tokens[suffix.myt], tokens[suffix.mpt]);
  }, [tokens]);

  const solBalance = useMemo(() => {
    if (tokenSelected.symbol === "SOL") {
      return balance;
    }
    return tokens[suffix.msol];
  }, [tokenSelected.symbol, balance, tokens[suffix.msol]]);

  const ptBalance = useMemo(() => {
    if (tokenSelected.symbol === "SOL") {
      return tokens[suffix.pt];
    }
    return tokens[suffix.mpt];
  }, [tokenSelected.symbol, tokens[suffix.pt], tokens[suffix.mpt]]);

  const ytBalance = useMemo(() => {
    if (tokenSelected.symbol === "SOL") {
      return tokens[suffix.yt];
    }
    return tokens[suffix.myt];
  }, [tokenSelected.symbol, tokens[suffix.yt], tokens[suffix.myt]]);

  const onSuccessPopup = () => {
    toggleModal({
      title: "",
      data: (
        <MintSuccessPopup
          isRedeem
          mint={{
            symbol: tokenSelected.symbol,
            amount: valueInput,
          }}
          receive={{
            token01: {
              symbol: tokenSelected.symbol === "SOL" ? "PT" : "MPT",
              amount: valueOutput,
            },
            token02: {
              symbol: tokenSelected.symbol === "SOL" ? "YT" : "MYT",

              amount: valueInput,
            },
          }}
        />
      ),
      open: true,
      width: 460,
      className: "rounded-[32px] bg-[#2f3136]",
    });
  };
  const handleRedeem = async () => {
    try {
      setLoading(true);
      if (tokenSelected.symbol === "SOL") {
        await onRedeemSol({ value: Number(valueInput) });
      } else {
        await onRedeemMSol({ value: Number(valueInput) });
        // throw new Error("not implemented yet");
      }
      onSuccessPopup();
    } catch (error: any) {
      toast.error(error?.message || "Mint Fail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSwap(true);
    setValueInput("");
    setValueOutput("");
  }, []);

  useEffect(() => {
    setValueInput(valueInput);
    setValueOutput(valueInput);
  }, [swap]);

  const handleChangeValueSwap = useCallback(
    (valueToken: string) => {
      setValueInput(valueToken);
      setValueOutput(valueToken);

      console.log(
        "Number(valueToken) > maxMount: ",
        Number(valueToken),
        maxMount
      );
      if (Number(valueToken) > maxMount) {
        setErrorMsg("Your balance is insufficient!");
        return;
      }
      if (Number.isNaN(Number(valueToken))) {
        setErrorMsg("Invalid Number");
        return;
      }
      setErrorMsg("");
    },
    [swap, balance, maxMount]
  );

  return (
    <>
      <div>
        <div>
          <TokenBoxPrimary
            price={price}
            isTokenPrimary
            type={TYPE_SWAP.MINT}
            option={E_TYPE_ACTION_MINT.MINT}
            isMint
            valueInput={valueInput}
            handleChangeValueInput={handleChangeValueSwap}
            tokenDefault={{
              name: tokenSelected.symbol === "SOL" ? "PT SOL" : "MPT SOL",
              symbol: "ptsol",
              logoURI: ysolIcon,
            }}
            balance={ptBalance}
            options={[]}
          />
          {errorMsg && (
            <div className=" my-1">
              <span className="text-sm text-error text-normal">{errorMsg}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <TokenBoxPrimary
            price={(price * 7) / 100}
            isTokenPrimary
            type={TYPE_SWAP.MINT}
            option={E_TYPE_ACTION_MINT.MINT}
            isMint
            valueInput={valueInput}
            tokenDefault={{
              name: tokenSelected.symbol === "SOL" ? "YT SOL" : "MYT SOL",
              symbol: "ytsol",
              logoURI: ysolIcon,
            }}
            maxBalance={maxMount}
            handleChangeValueInput={handleChangeValueSwap}
            balance={ytBalance}
            options={[]}
          />
          {errorMsg && (
            <div className=" my-1">
              <span className="text-sm text-error text-normal">{errorMsg}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 self-stretch my-4">
          <div className="h-[2px] w-full bg-darkGray"></div>
          <div className="flex items-center gap-2.5 bg-darkGray p-2.5 rounded-[64px]">
            <div className="w-6 h-6">
              <img src={MintMiddleSVG} alt="Arrow Down" />
            </div>
          </div>
          <div className="h-[2px] w-full bg-darkGray"></div>
        </div>
        <div className="flex flex-col space-y-4">
          <TokenBoxPrimary
            price={price}
            isMint={false}
            type={TYPE_SWAP.MINT}
            option={E_TYPE_ACTION_MINT.MINT}
            isTokenPrimary={false}
            valueInput={valueOutput}
            balance={solBalance}
            options={options}
            setTokenSelected={(token: ITokenOption) => {
              setTokenSelected(token);
            }}
            tokenSelected={tokenSelected}
          />
        </div>

        <div
          className={cn(
            "p-4 flex flex-col space-y-2 mt-4",
            "text-sm text-white font-normal"
          )}
        >
          {/* <div className="flex flex-row justify-between items-center">
            <span className="text-white">Min Received</span>
            <div className="flex flex-col space-y-0.5 items-center">
              <span className="text-black text-sm font-medium">
                {balanceDisplayer("12.123", 3)} PT
              </span>
              <span className="text-black text-sm font-medium">
                {balanceDisplayer("8.212", 3)} YT
              </span>
            </div>
          </div> */}
          <div className="flex flex-row  items-center">
            <div className="flex">
              <img className={cn("w-10 h-10")} src={ysolIcon} alt="btcToken" />
            </div>
            <div className="flex flex-col w-full flex-1  items-center">
              <span className="text-lightGray text-md font-normal">
                Maturity
              </span>
              <div className="flex-1 w-full border border-dashed border-gray" />
              <span className="text-md font-normal text-white">1 year</span>
            </div>
            <div className="flex flex-row">
              <img className={cn("w-10 h-10")} src={ysolIcon} alt="btcToken" />
              <img className={cn("w-10 h-10")} src={ysolIcon} alt="btcToken" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-4">
        {!publicKey ? (
          <ButtonOutline
            onClick={() => {
              document.getElementById("header-connect")?.click();
            }}
          >
            <span className="text-base text-black font-semibold">
              Connect Wallet
            </span>
          </ButtonOutline>
        ) : (
          <ButtonOutline
            disabled={errorMsg !== "" || loading || Number(valueInput) <= 0}
            onClick={handleRedeem}
          >
            <span className="text-base text-black font-semibold">
              {loading ? "Redeeming" : "Redeem"}
            </span>
          </ButtonOutline>
        )}
      </div>
    </>
  );
};

export default RedeemTab;
