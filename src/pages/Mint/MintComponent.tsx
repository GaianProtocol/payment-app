import MintMiddleSVG from "@/assets/svgs/arrow-down.svg";
import ysolIcon from "@/assets/tokens/ysol.svg";
import ButtonOutline from "@/components/Button/ButtonOutline";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import useMint from "@/hooks/useMint";
import useSolBalance from "@/hooks/useSolBalance";
import useTokenBalanceSol from "@/hooks/useTokenBalanceSol";
import { useTokenSuffix } from "@/store/tokenStore";
import {
  E_TYPE_ACTION_MINT,
  TYPE_ACTION_LIMIT,
  TYPE_ACTION_MINT,
  TYPE_ACTION_SWAP,
  TYPE_SWAP,
} from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { balanceDisplayer } from "@/utils/convert";
import { useWallet } from "@solana/wallet-adapter-react";
import { upperCase } from "lodash";
import { useCallback, useEffect, useState } from "react";
import TokenBoxPrimary from "./TokenBoxPrimary";

type ActionTypes =
  | typeof TYPE_ACTION_SWAP
  | typeof TYPE_ACTION_MINT
  | typeof TYPE_ACTION_LIMIT;

const MintComponent = () => {
  const [option, setOption] = useState<string>(E_TYPE_ACTION_MINT.MINT);
  const { balance } = useSolBalance();
  const { tokens } = useTokenBalanceSol();
  const [valueInput, setValueInput] = useState<number>(0);
  const [valueOutput, setValueOutput] = useState<number>(0);
  const [swap, setSwap] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { publicKey } = useWallet();
  const { onMintSol } = useMint();
  const actions = TYPE_ACTION_MINT;
  const suffix = useTokenSuffix();

  const handleMint = async () => {
    onMintSol({ amount: valueInput });
  };

  useEffect(() => {
    if (option === E_TYPE_ACTION_MINT.REDEEM) {
      setSwap(false);
    } else {
      setSwap(true);
    }
    setValueInput(0);
    setValueOutput(0);
  }, [option]);

  useEffect(() => {
    setValueInput(Number(valueInput));
    setValueOutput(Number(valueInput));
  }, [swap]);

  const handleChangeValueSwap = useCallback(
    (valueToken: string) => {
      setValueInput(Number(valueToken));
      setValueOutput(Number(valueToken));

      if (Number(valueToken) > balance) {
        setErrorMsg("Your balance is insufficient!");
        return;
      }
      if (Number.isNaN(Number(valueToken))) {
        setErrorMsg("Invalid Number");
        return;
      }
      setErrorMsg("");
    },
    [swap, balance]
  );

  return (
    <div
      className={cn(
        "bg-transparent max-w-[704px] !h-max w-full flex mx-auto px-2.5 md:px-[30px] py-10",
        ""
      )}
      style={{
        minHeight: `calc(100svh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
      }}
    >
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row p-2 bg-darkGray rounded-full mx-auto">
            {Object.keys(actions).map((key) => (
              <ButtonPrimary
                key={key}
                active={upperCase(option) === upperCase(key)}
                onClick={() => {
                  setOption(key);
                }}
                className="min-w-[160px]"
              >
                {actions[key as keyof ActionTypes]}
              </ButtonPrimary>
            ))}
          </div>
        </div>
        <div>
          <div>
            <TokenBoxPrimary
              isTokenPrimary
              type={TYPE_SWAP.MINT}
              option={option}
              isMint
              valueInput={valueInput.toString()}
              handleChangeValueInput={handleChangeValueSwap}
              balance={balance}
              price={0}
              options={[]}
            />
            {errorMsg && (
              <div className=" my-1">
                <span className="text-sm text-error text-normal">
                  {errorMsg}
                </span>
              </div>
            )}
          </div>
          {option === E_TYPE_ACTION_MINT.REDEEM && (
            <div className="mt-3.5">
              <div>
                <TokenBoxPrimary
                  isTokenPrimary
                  type={TYPE_SWAP.MINT}
                  option={option}
                  isMint={!swap}
                  valueInput={valueInput.toString()}
                  handleChangeValueInput={handleChangeValueSwap}
                  balance={0}
                  price={0}
                  options={[]}
                />
                {errorMsg && (
                  <div className=" my-1">
                    <span className="text-sm text-error text-normal">
                      {errorMsg}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
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
              isMint={false}
              type={TYPE_SWAP.MINT}
              option={option}
              isTokenPrimary={false}
              valueInput={valueOutput.toString()}
              tokenDefault={{
                name: "PT SOL",
                symbol: "ptsol",
                logoURI: ysolIcon,
              }}
              balance={tokens[suffix.pt]}
              price={0}
              options={[]}
            />
            {option === E_TYPE_ACTION_MINT.MINT && (
              <TokenBoxPrimary
                isMint={false}
                type={TYPE_SWAP.MINT}
                option={option}
                isTokenPrimary={false}
                valueInput={valueOutput.toString()}
                tokenDefault={{
                  name: "YT SOL",
                  symbol: "ytsol",
                  logoURI: ysolIcon,
                }}
                balance={tokens[suffix.yt]}
                price={0}
                options={[]}
              />
            )}
          </div>

          <div
            className={cn(
              "p-4 flex flex-col space-y-2 mt-4",
              "text-sm text-white font-normal"
            )}
          >
            <div className="flex flex-row justify-between items-center">
              <span>Min Received</span>
              <div className="flex flex-col space-y-0.5 items-center">
                <span className="text-black text-sm font-medium">
                  {balanceDisplayer("12.123", 3)}{" "}
                  {option === E_TYPE_ACTION_MINT.MINT ? "PT" : "eBTC"}
                </span>
                {option === E_TYPE_ACTION_MINT.MINT && (
                  <span className="text-black text-sm font-medium">
                    {balanceDisplayer("8.212", 3)} YT
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row  items-center">
              <div className="flex">
                {option === E_TYPE_ACTION_MINT.MINT ? (
                  <div className="flex">
                    <img
                      className={cn("w-10 h-10")}
                      src={ysolIcon}
                      alt="btcToken"
                    />
                    <img
                      className={cn("w-10 h-10")}
                      src={ysolIcon}
                      alt="btcToken"
                    />
                  </div>
                ) : (
                  <img
                    className={cn("w-10 h-10")}
                    src={ysolIcon}
                    alt="btcToken"
                  />
                )}
              </div>
              <div className="flex flex-col w-full flex-1  items-center">
                <span className="text-lightGray text-md font-normal">
                  Pendel
                </span>
                <div className="flex-1 w-full border border-dashed border-gray" />
                <span className="text-md font-normal text-white">1 year</span>
              </div>
              <div className="flex flex-row">
                {option === E_TYPE_ACTION_MINT.REDEEM ? (
                  <div className="flex">
                    <img
                      className={cn("w-10 h-10")}
                      src={ysolIcon}
                      alt="btcToken"
                    />
                    <img
                      className={cn("w-10 h-10")}
                      src={ysolIcon}
                      alt="btcToken"
                    />
                  </div>
                ) : (
                  <img
                    className={cn("w-10 h-10")}
                    src={ysolIcon}
                    alt="btcToken"
                  />
                )}
              </div>
            </div>
          </div>

          {/* {valueInput > 0 && (
            <p className="text-sm font-normal text-white mt-2.5">
              Last updated a few seconds ago
            </p>
          )} */}
        </div>
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
            <ButtonOutline disabled={errorMsg !== ""} onClick={handleMint}>
              <span className="text-base text-black font-semibold">Mint</span>
            </ButtonOutline>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintComponent;
