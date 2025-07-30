import ArrowDownRed from "@/assets/svgs/arrow-down-red.svg";
import DropdownSVG from "@/assets/svgs/dropdown-white.svg";
import SettingSwapSVG from "@/assets/svgs/setting.svg";
import SwapMiddleSVG from "@/assets/svgs/swap.svg";
import ysolIcon from "@/assets/tokens/ysol.svg";
import ButtonOutline from "@/components/Button/ButtonOutline";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import { PopoverMenu } from "@/components/Popover/Popover";
import useSolBalance from "@/hooks/useSolBalance";
import useTokenBalanceSol from "@/hooks/useTokenBalanceSol";
import { usePriceSol, useTokenSuffix } from "@/store/tokenStore";

import SwapSuccessPopup from "@/components/Popup/SwapSuccessPopup";
import { useToggleModal } from "@/hooks/useModal";
import useSwapToken from "@/hooks/useSwapToken";
import {
  E_TYPE_ACTION_MINT,
  E_TYPE_ACTION_SWAP,
  TYPE,
  TYPE_ACTION_LIMIT,
  TYPE_ACTION_MINT,
  TYPE_ACTION_SWAP,
  TYPE_SWAP,
} from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { balanceDisplayer } from "@/utils/convert";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TokenBoxPrimary from "./TokenBoxPrimaryV1";

type ActionTypes =
  | typeof TYPE_ACTION_SWAP
  | typeof TYPE_ACTION_MINT
  | typeof TYPE_ACTION_LIMIT;

const SwapComponent = () => {
  const [swapType, setSwapType] = useState<TYPE_SWAP>(TYPE_SWAP.SWAP);
  const [option, setOption] = useState<string>(E_TYPE_ACTION_SWAP.BUY);
  // Only check UI - call from SC
  const { balance } = useSolBalance();
  const { onSwap, onEstAmount } = useSwapToken();
  const [valueInput, setValueInput] = useState<string>("");
  const [valueOutput, setValueOutput] = useState<string>("");
  const [swap, setSwap] = useState<boolean>(true);
  const { publicKey } = useWallet();
  const [errorMsg, setErrorMsg] = useState("");
  const suffix = useTokenSuffix();
  const { tokens } = useTokenBalanceSol();
  const price = usePriceSol();
  const [loading, setLoading] = useState(false);
  const [loadingEst, setLoadingEst] = useState(false);
  const toggleModal = useToggleModal();

  const currentBalance = useMemo(() => {
    if (!swap) {
      return balance;
    }
    return tokens[suffix.yt];
  }, [swap, balance, tokens[suffix.yt]]);

  const outputBalance = useMemo(() => {
    if (swap) {
      return balance;
    }
    return tokens[suffix.yt];
  }, [swap, balance, tokens[suffix.yt]]);

  const getActions = (): ActionTypes => {
    switch (swapType) {
      case TYPE_SWAP.SWAP:
        return TYPE_ACTION_SWAP;
      // case TYPE_SWAP.MINT:
      //   return TYPE_ACTION_MINT;
      case TYPE_SWAP.LIMIT:
        return TYPE_ACTION_LIMIT;
      default:
        return TYPE_ACTION_SWAP;
    }
  };
  useEffect(() => {
    if (option === E_TYPE_ACTION_MINT.REDEEM) {
      setSwap(false);
    } else {
      setSwap(true);
    }
    setValueInput("");
    setValueOutput("");
    setErrorMsg("");
  }, [swapType, option]);

  const actions = getActions();

  useEffect(() => {
    if (swapType === TYPE_SWAP.SWAP) {
      setOption(E_TYPE_ACTION_SWAP.BUY);
    }
    // else if (swapType === TYPE_SWAP.MINT) {
    //   setOption(E_TYPE_ACTION_MINT.MINT);
    // }
  }, [swapType]);

  useEffect(() => {
    // Only check UI - SC will change
    setValueInput("");
    setValueOutput("");
    setLoadingEst(false);
  }, [swap]);

  useEffect(() => {
    const getESTBalance = async () => {
      try {
        const { estAmount } = await onEstAmount({
          amount: Number(valueInput),
          ytToSol: swap,
        });
        console.log("est: ", estAmount);
        setValueOutput(estAmount.toString());
      } catch (error) {
      } finally {
        setLoadingEst(false);
      }
    };
    if (valueInput !== "") {
      setLoadingEst(true);
      const handler = setTimeout(() => {
        getESTBalance();
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    } else {
      setLoadingEst(false);
    }
  }, [valueInput, swap]);

  const handleChangeValueSwap = (valueToken: string) => {
    // Only check UI - SC will change
    if (swap) {
      setValueInput(valueToken);
      // setValueOutput((+valueToken * 0.07).toString());
    } else {
      setValueInput(valueToken);
      // setValueOutput((+valueToken / 0.07).toString());
    }
    if (Number(valueToken) > currentBalance) {
      setErrorMsg("Your balance is insufficient!");
      return;
    }
    if (Number.isNaN(Number(valueToken))) {
      setErrorMsg("Invalid Number");
      return;
    }
    setErrorMsg("");
  };

  const textButton = () => {
    if (valueInput === "") {
      return "Enter an amount";
    }
    if (loading) return "Swapping";
    return "Swap";
  };

  const onSuccessPopup = () => {
    toggleModal({
      title: "",
      data: (
        <SwapSuccessPopup
          base={{
            symbol: swap ? "YTSOL" : "SOL",
            amount: valueInput,
          }}
          to={{
            symbol: !swap ? "YTSOL" : "SOL",
            amount: valueOutput,
          }}
          swapType={swapType}
        />
      ),
      open: true,
      width: 460,
      className: "rounded-[32px] bg-[#202225]",
    });
  };

  const handleSwap = async () => {
    try {
      setLoading(true);
      await onSwap({ amount: Number(valueInput), ytToSol: swap });
      onSuccessPopup();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-transparent max-w-[674px] !h-max w-full flex mx-auto px-2.5 md:px-[30px] py-10",
        ""
      )}
      style={{
        minHeight: `calc(100svh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
      }}
    >
      <div className="flex flex-col w-full gap-6">
        <div className="flex xs:flex-row justify-between flex-col-reverse gap-2 items-end">
          <div className="flex flex-row p-2 bg-darkGray rounded-full max-xs:mx-auto">
            {[TYPE_SWAP.SWAP, TYPE_SWAP.LIMIT].map((key) => (
              <ButtonPrimary
                key={key}
                active={swapType === key}
                onClick={() => {
                  setSwapType(key as TYPE_SWAP);
                }}
                className="min-w-[160px]"
              >
                {TYPE[key]}
              </ButtonPrimary>
            ))}
          </div>
          <div
            className={cn(
              "rounded-full p-3 bg-gray",
              "flex flex-row w-12 h-12"
            )}
          >
            <img
              className={cn("w-full cursor-pointer h-full")}
              src={SettingSwapSVG}
              alt="settings"
            />
          </div>
        </div>
        <div className="bg-darkGray border-card rounded-[20px] overflow-hidden p-4 md:p-8">
          <div>
            <TokenBoxPrimary
              isTokenPrimary
              type={swapType}
              option={option}
              valueInput={valueInput}
              balance={currentBalance}
              handleChangeValueInput={handleChangeValueSwap}
              price={price * Number((swap ? valueOutput : valueInput) || "0")}
              options={
                swap
                  ? [
                      {
                        symbol: "YTSOL",
                        logoURI: ysolIcon,
                        name: "YTSOL",
                      },
                    ]
                  : [
                      {
                        symbol: "sol",
                        logoURI: ysolIcon,
                        name: "SOL",
                      },
                      {
                        symbol: "msol",
                        logoURI: ysolIcon,
                        name: "MSOL",
                      },
                    ]
              }
              title="You're paying"
            />
            {errorMsg && (
              <div className=" my-1">
                <span className="text-sm text-error text-normal">
                  Your balance is insufficient!
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 self-stretch my-4">
            <div className="h-[1px] w-full bg-gray"></div>
            <div className="flex items-center gap-2.5 bg-gray p-2.5 rounded-[64px]">
              <div
                onClick={() => setSwap((pre) => !pre)}
                className="w-6 h-6 p-1"
              >
                <img src={SwapMiddleSVG} alt="Arrow Down" className="w-full" />
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray"></div>
          </div>
          <div className="flex flex-col space-y-4">
            <TokenBoxPrimary
              type={swapType}
              option={option}
              isTokenPrimary={false}
              balance={outputBalance}
              valueInput={valueOutput}
              price={price * Number((swap ? valueOutput : valueInput) || "0")}
              title={"To receive"}
              loading={loadingEst}
              options={
                !swap
                  ? [
                      {
                        symbol: "YTSOL",
                        logoURI: ysolIcon,
                        name: "YTSOL",
                      },
                    ]
                  : [
                      {
                        symbol: "sol",
                        logoURI: ysolIcon,
                        name: "SOL",
                      },
                      {
                        symbol: "msol",
                        logoURI: ysolIcon,
                        name: "MSOL",
                      },
                    ]
              }
            />
          </div>
          {Number(valueInput) > 0 && swapType === TYPE_SWAP.SWAP && (
            <>
              <div className="w-full h-[1px] my-4 bg-gray"></div>

              <div
                className={cn(
                  "flex flex-col space-y-2 mt-4",
                  "text-sm text-lightGray font-normal"
                )}
              >
                <div className="flex flex-row justify-between items-center">
                  <span className="text-lightGray text-sm">Price</span>
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      className={cn("cursor-pointer rotate-90")}
                      src={SwapMiddleSVG}
                      alt="Arrow right"
                    />
                    <span className="text-white text-sm font-medium">
                      1 SOL =
                    </span>
                    <span className="text-white text-sm font-medium">
                      {" "}
                      {balanceDisplayer(price, 3)} USD
                    </span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="text-lightGray text-sm">Price Impact</span>

                  <div className="flex flex-row gap-1 items-center">
                    <img
                      className={cn("cursor-pointer")}
                      src={ArrowDownRed}
                      alt="done icon"
                    />
                    <span className="text-error text-sm font-medium">
                      {balanceDisplayer("8.27", 3)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="text-lightGray text-sm">
                    Liquididy provider fee
                  </span>
                  <div className="flex flex-row space-x-0.5 items-center">
                    <span className="text-white font-medium">
                      ${balanceDisplayer("0.0001", 5)} SOL
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {swapType === TYPE_SWAP.LIMIT && (
          <div className="flex gap-4 self-stretch flex-col md:flex-row">
            <div className="flex justify-between grow bg-darkGray p-4 rounded-2xl border-card">
              <div className="w-[157px] flex flex-col gap-[11px]">
                <span className="font-normal text-md text-[#7780a1]">
                  Buy SOL at rate
                </span>
                <span className="font-bold text-md text-white">
                  158.413231223132
                </span>
                <span className="font-normal text-md text-[#7780a1]">
                  ~$155.31
                </span>
              </div>
              <div className="w-[157px] flex flex-col justify-start items-end gap-[11px]">
                <span className="font-normal text-md text-right text-[#7780a1]">
                  Use Market
                </span>
                <span className="font-bold text-md text-right text-white">
                  USDC
                </span>
              </div>
            </div>

            <div className="flex gap-[59px] bg-darkGray p-4 rounded-2xl border-card">
              <div className="w-full  flex md:flex-col gap-[11px] justify-between items-center md:items-start">
                <span className="font-normal text-md text-[#7780a1]">
                  Expiry
                </span>
                <PopoverMenu
                  offset={5}
                  triggerContent={
                    <div className="flex justify-end items-center gap-4 self-stretch flex-1">
                      <div className="flex items-center gap-2.5 grow bg-[#2f3136] p-4 rounded-2xl border-card w-full">
                        <span className="font-bold text-[16px]  text-center text-white">
                          Never
                        </span>
                        <img
                          className={cn("cursor-pointer !ml-3")}
                          src={DropdownSVG}
                          alt="dropdown"
                        />
                      </div>
                    </div>
                  }
                  options={[
                    {
                      label: "Never",
                      key: "never",
                      onClick: () => {},
                    },
                  ]}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row space-x-4 mt-[32px]">
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
              onClick={handleSwap}
              disabled={
                valueInput === "" || !!errorMsg || loading || loadingEst
              }
            >
              <span className="text-base text-black font-semibold">
                {textButton()}
              </span>
            </ButtonOutline>
          )}
          {/* <img
            className={cn("cursor-pointer")}
            src={CalculatorSVG}
            alt="connect wallet"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default SwapComponent;
