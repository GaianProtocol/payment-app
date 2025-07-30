import MintMiddleSVG from "@/assets/svgs/arrow-down.svg";
import jitosolIcon from "@/assets/tokens/JitoSOL.jpg";
import jsolImg from "@/assets/tokens/jsol.png";
import ptjisosolIcon from "@/assets/tokens/pt-jisosol.jpg";
import ysolIcon from "@/assets/tokens/ysol.svg";
import ytjisosolIcon from "@/assets/tokens/yt-jisosol.jpg";
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

const MintTab = () => {
  const { balance } = useSolBalance();
  const { tokens } = useTokenBalanceSol();
  const [valueInput, setValueInput] = useState<string>("");
  const [valueOutput, setValueOutput] = useState<string>("");
  const [swap, setSwap] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { publicKey } = useWallet();
  const { onMintSol, onMintMSol } = useMint();
  // const [selected, setSelected] = useState("SOL");
  const suffix = useTokenSuffix();
  const [loading, setLoading] = useState(false);
  const price = usePriceSol();
  const options: ITokenOption[] = useMemo(
    () => [
      {
        symbol: "JitoSOL",
        logoURI: jitosolIcon,
        name: "Solana",
        address: "So11111111111111111111111111111111111111112",
        balance: balance,
      },
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
  const toggleModal = useToggleModal();

  const currentBalance = useMemo(() => {
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
  const handleMint = async () => {
    try {
      setLoading(true);
      if (tokenSelected.symbol === "SOL") {
        await onMintSol({ amount: Number(valueInput) });
      } else {
        await onMintMSol({ amount: Number(valueInput) });
      }
      onSuccessPopup();
      // toast.success("Mint Successfully");
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

      if (Number(valueToken) > currentBalance) {
        setErrorMsg("Your balance is insufficient!");
        return;
      }
      if (Number.isNaN(Number(valueToken))) {
        setErrorMsg("Invalid Number");
        return;
      }
      setErrorMsg("");
    },
    [swap, currentBalance]
  );
  // useEffect(() => {
  //   onSuccessPopup();
  // }, []);

  return (
    <>
      <div>
        <div>
          <TokenBoxPrimary
            className="border border-[#A9EE9B]"
            price={price}
            isTokenPrimary
            type={TYPE_SWAP.MINT}
            option={E_TYPE_ACTION_MINT.MINT}
            isMint
            valueInput={valueInput}
            handleChangeValueInput={handleChangeValueSwap}
            setTokenSelected={(token: ITokenOption) => {
              setTokenSelected(token);
            }}
            options={options}
            tokenSelected={tokenSelected}
            balance={currentBalance}
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
            tokenDefault={{
              name:
                tokenSelected.symbol === "JitoSOL"
                  ? "Pt JitoSOL"
                  : "Yt JitoSOL",
              symbol: "ptjitosol",
              logoURI: ptjisosolIcon,
            }}
            options={[]}
            balance={ptBalance}
          />
          <TokenBoxPrimary
            price={(price * 7) / 100}
            isMint={false}
            type={TYPE_SWAP.MINT}
            option={E_TYPE_ACTION_MINT.MINT}
            isTokenPrimary={false}
            valueInput={valueOutput}
            tokenDefault={{
              name:
                tokenSelected.symbol === "JitoSOL"
                  ? "Yt JitoSOL"
                  : "Pt JitoSOL",
              symbol: "ytjitosol",
              logoURI: ytjisosolIcon,
            }}
            options={[]}
            balance={ytBalance}
          />
        </div>

        <div
          className={cn(
            "p-4 flex flex-col space-y-2 mt-4",
            "text-sm text-white font-normal"
          )}
        >
          {/* <div className="flex flex-row justify-between items-center">
            <span className="text-lightGray">Min Received</span>
            <div className="flex flex-col space-y-0.5 items-center">
              <span className="text-white text-opacity-80 text-sm font-medium">
                {balanceDisplayer(Number(valueOutput), 3)}{" "}
                {selected === "SOL" ? "PT" : "MPT"}
              </span>
              <span className="text-white text-opacity-80 text-sm font-medium">
                {balanceDisplayer(Number(valueOutput), 3)}{" "}
                {selected === "SOL" ? "YT" : "MYT"}
              </span>
            </div>
          </div> */}
          <div className="flex flex-row  items-center">
            <div className="flex ">
              <img
                className={cn("w-10 h-10 rounded-full ")}
                src={ptjisosolIcon}
                alt="btcToken"
              />
              <img
                className={cn("w-10 h-10 rounded-full")}
                src={ytjisosolIcon}
                alt="btcToken"
              />
            </div>
            <div className="flex flex-col w-full flex-1  items-center">
              <span className="text-lightGray text-md font-normal">
                Maturity
              </span>
              <div className="flex-1 w-full border border-dashed border-gray" />
              <span className="text-md font-normal text-white">1 year</span>
            </div>
            <div className="flex flex-row">
              <img
                className={cn("w-10 h-10 rounded-full")}
                src={jitosolIcon}
                alt="btcToken"
              />
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
            onClick={handleMint}
          >
            <span className="text-base text-black font-semibold">
              {loading ? "Minting" : "Mint"}
            </span>
          </ButtonOutline>
        )}
      </div>
    </>
  );
};

export default MintTab;
