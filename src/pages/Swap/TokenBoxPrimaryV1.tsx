import DropdownSVG from "@/assets/svgs/dropdown-white.svg";
import ysolIcon from "@/assets/tokens/ysol.svg";
import { PopoverMenu } from "@/components/Popover/Popover";
import {
  E_TYPE_ACTION_MINT,
  E_TYPE_ACTION_SWAP,
  ITokenOption,
  TYPE_SWAP,
} from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { useEffect, useState } from "react";

interface TokenBoxPrimaryProps {
  isTokenPrimary?: boolean;
  title: string;
  type: TYPE_SWAP;
  option: E_TYPE_ACTION_SWAP | E_TYPE_ACTION_MINT | string;
  handleChangeValueInput?: (valueToken: string) => void;
  valueInput: string;
  tokenDefault?: ITokenOption;
  balance: number;
  maxBalance?: number;
  price: number;
  className?: string;
  options?: ITokenOption[];
  loading?: boolean;
  handleTokenSelectChange?: (name: string) => void;
}

const TokenOptions: ITokenOption[] = [
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
];

const TokenBoxPrimary = ({
  isTokenPrimary = true,
  handleChangeValueInput,
  valueInput,
  type,
  tokenDefault,
  balance,
  maxBalance,
  price,
  className,
  title,
  loading,
  options = TokenOptions,
  handleTokenSelectChange,
  ...rest
}: TokenBoxPrimaryProps) => {
  const [tokenSelected, setTokenSelected] = useState<ITokenOption>(options[0]);

  const handleFormatNumber = (value: number) => {
    return balanceDisplayer(parseInt(value.toString().replace(/,/g, "")), 2);
  };

  useEffect(() => {
    if (handleTokenSelectChange) {
      handleTokenSelectChange(tokenSelected.name);
    }
  }, [tokenSelected]);
  useEffect(() => {
    setTokenSelected(options[0]);
  }, [JSON.stringify(options)]);

  return (
    <div
      {...rest}
      className={cn(
        "flex flex-col gap-8 self-stretch bg-[#202225] p-4 md:p-8 rounded-[20px] border-card",
        className
      )}
    >
      <div className="flex justify-between self-stretch">
        <div className="flex-1 flex flex-col gap-[17px] justify-between">
          <span className="font-normal whitespace-nowrap text-[#7780a1]">
            {title}
          </span>
          <span className="font-bold text-[32px] text-center text-[#7780a1]">
            {isTokenPrimary ? (
              <div className={`flex flex-col `}>
                <input
                  type="text"
                  min={0}
                  className="max-w-[150px] md:max-w-max w-full font-bold text-[32px] border-none outline-none bg-transparent text-white"
                  placeholder="0.0"
                  onChange={(e) => {
                    handleChangeValueInput?.(e.target.value);
                  }}
                  value={valueInput}
                  defaultValue={
                    valueInput ? balanceDisplayer(valueInput, 2) : ""
                  }
                />
                {/* {Number(valueInput) > 0 && ( */}
                <span className="text-sm text-start font-normal text-[#7780a1]">
                  ${balanceDisplayer(price, 3)}
                </span>
                {/* )} */}
              </div>
            ) : (
              <div className={`flex flex-col `}>
                <input
                  readOnly
                  type="string"
                  className="max-w-[150px] md:max-w-max w-full font-bold text-[32px] border-none outline-none bg-transparent text-white"
                  placeholder="0.0"
                  value={loading ? "estimating..." : valueInput}
                />
                <div className="text-sm font-normal text-start text-[#7780a1]">
                  <span className="text-[#7780a1]">
                    ${balanceDisplayer(price, 3)}
                  </span>{" "}
                  {/* <span className="text-error">
                    {type === TYPE_SWAP.SWAP ? "(-23.9%)" : ""}
                  </span> */}
                </div>
              </div>
            )}
          </span>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className="font-normal whitespace-nowrap text-[#7780a1]">
            Balance:{" "}
            <span className="text-white">{balanceDisplayer(balance, 3)}</span>
          </span>
          <div className="flex md:items-center gap-4 self-stretch flex-col md:flex-row items-end">
            {balance > 0 && isTokenPrimary && (
              <button
                onClick={() => {
                  if (maxBalance) {
                    handleChangeValueInput?.(maxBalance.toString());
                  } else {
                    handleChangeValueInput?.(balance.toString());
                  }
                }}
                className={cn(
                  "flex justify-center items-center gap-2.5 bg-[#ddf8d7] px-4 py-2 rounded-full"
                )}
              >
                <span className="font-bold text-center text-[#539146]">
                  Max
                </span>
              </button>
            )}
            <div className="flex items-center gap-2.5 bg-[#2f3136] p-4 rounded-2xl border-card relative">
              {!tokenDefault ? (
                <>
                  <PopoverMenu
                    triggerContent={
                      <div className="flex items-center gap-2">
                        <img
                          className={cn("w-6 h-6")}
                          src={tokenSelected.logoURI}
                          alt={tokenSelected.name}
                        />
                        <div className="text-base text-white text-center leading-[15px] font-semibold">
                          {tokenSelected.name}
                        </div>
                        <img
                          className={cn("cursor-pointer !ml-3")}
                          src={DropdownSVG}
                          alt="dropdown"
                        />
                      </div>
                    }
                    options={options.map((option) => ({
                      key: option.symbol,
                      label: option.name,
                      icon: <img src={option.logoURI} alt={option.name} />,
                      onClick: () => {
                        setTokenSelected(option);
                      },
                    }))}
                    className="text-xs"
                  />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <img
                    className={cn("w-6 h-6")}
                    src={tokenDefault.logoURI}
                    alt="ysol"
                  />

                  <div className="text-base text-white text-center leading-[24px] font-semibold">
                    {tokenDefault.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenBoxPrimary;
