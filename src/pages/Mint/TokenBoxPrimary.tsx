import { EmptyWallet, Usdc } from "@/assets/svgs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import useTokenBalanceSolV2 from "@/hooks/useTokenBalanceSolV2";
import {
  E_TYPE_ACTION_MINT,
  E_TYPE_ACTION_SWAP,
  ITokenOption,
  TYPE_SWAP,
} from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface TokenBoxPrimaryProps {
  isTokenPrimary?: boolean;
  title?: string;
  handleChangeValueInput?: (valueToken: string) => void;
  valueInput: string;
  tokenDefault?: ITokenOption;
  className?: string;
  options?: ITokenOption[];
  loading?: boolean;
  handleTokenSelectChange?: (name: string) => void;
  handleErrorMsg?: (msg: string) => void;
  price: number;
  max?: number;
  isMint?: boolean;
  type?: TYPE_SWAP;
  option?: E_TYPE_ACTION_SWAP | E_TYPE_ACTION_MINT | string;
  balance?: number;
  maxBalance?: number;
  setTokenSelected?: (token: ITokenOption) => void;
  tokenSelected?: ITokenOption;
}

const TokenOptions: ITokenOption[] = [
  {
    name: "USDC",
    logoURI: Usdc,
    symbol: "USDC",
  },
  // {
  //   name: "USDT",
  //   logoURI: Usdt,
  //   symbol: "USDT",
  // },
  // {
  //   name: "USDS",
  //   logoURI: USDS,
  //   symbol: "USDS",
  // },
  // {
  //   name: "PYUSD",
  //   logoURI: PaypalIcon,
  //   symbol: "PYUSD",
  // },
];

const TokenBoxPrimary = ({
  isTokenPrimary = true,
  handleChangeValueInput,
  valueInput,
  tokenDefault,
  title,
  loading,
  options = TokenOptions,
  handleTokenSelectChange,
  handleErrorMsg,
  price,
  max,
  ...rest
}: TokenBoxPrimaryProps) => {
  const { user } = useUser();
  const [tokenSelected, setTokenSelected] = useState<ITokenOption>(options[0]);

  const { tokens } = useTokenBalanceSolV2();
  const balanceToken = useMemo(() => {
    if (!user) return 0;
    switch (tokenSelected.symbol) {
      case "USDC":
        return tokens["USDC"] || 0;
      default:
        return 0;
    }
  }, [tokenSelected, tokens, user]);

  const handlePercent = (percent: number) => {
    const value = ((max ? max : balanceToken) * percent) / 100;
    const roundedValue = Math.floor(value * 1000000) / 1000000;
    handleInput(roundedValue.toString());
  };

  const handleInput = (value: string) => {
    handleChangeValueInput?.(value);

    if (Number(value) > Number(max ? max : balanceToken)) {
      handleErrorMsg?.("Insufficient balance");
    } else {
      handleErrorMsg?.("");
    }
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
      className="p-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] flex flex-col gap-4"
      {...rest}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 text-sm font-medium text-[#616566]">
          {title}
        </span>
        {/* <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#616566]">
            Multiple Assets
          </span>
          <Switch />
        </div> */}
        {/* <button className="p-1 bg-[#9fe870]/20 rounded-lg cursor-pointer">
          <img src={Refresh} alt="Refresh" />
        </button> */}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 w-full overflow-hidden">
          <TokenDropdown
            token={tokenSelected}
            onChange={(value) => setTokenSelected(value)}
          />
          <input
            type="number"
            min={0}
            className="flex-1 text-end w-full font-bold text-[32px] border-none outline-none bg-transparent"
            placeholder="0.0"
            onChange={(e) => {
              handleInput(e.target.value);
            }}
            value={valueInput}
            defaultValue={valueInput ?? 0}
          />
        </div>
        <div className="flex items-center justify-end">
          <span className="text-sm font-medium text-[#a7acae]">
            ${price * +valueInput}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={EmptyWallet} alt="Wallet" className="w-4 h-4" />
          <span className="text-sm font-semibold text-[#616566]">
            {balanceToken &&
              balanceToken.toLocaleString("en-US", {
                maximumFractionDigits: 4,
                minimumFractionDigits: 0,
              })}{" "}
            {tokenSelected.symbol}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[25, 50, 100].map((item) => (
            <div key={item} onClick={() => handlePercent(item)}>
              <PercentageButton key={item} percent={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const PercentageButton = ({ percent }: { percent: number }) => {
  return (
    <button className="h-8 px-3 hover:bg-[#e2e8ea] py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] flex justify-center items-center">
      <span className="text-xs font-semibold text-[#616566]">
        {percent == 100 ? "MAX" : percent + "%"}
      </span>
    </button>
  );
};

const TokenDropdown = ({
  token,
  onChange,
}: {
  token: ITokenOption;
  onChange: (value: ITokenOption) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "info-wallet h-[36px] text-sm font-normal flex items-center gap-2 rounded-full",
            "px-1 border "
          )}
        >
          <img src={token.logoURI} alt="" />
          <span className="text-base font-semibold text-[#151b11]">
            {token.symbol}
          </span>
          <IoIosArrowDown fill="black" className="w-12" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-2xl w-56" align="start">
        <DropdownMenuGroup>
          <div className="flex flex-col w-full">
            {TokenOptions.map((token) => (
              <DropdownMenuItem
                key={token.symbol}
                onClick={() => onChange(token)}
                className="cursor-pointer rounded-full"
              >
                <div className="flex items-center gap-3 p-2 rounded-xl ">
                  <div
                    className={`relative w-6 h-6 rounded-full overflow-hidden`}
                  >
                    {token.logoURI && <img src={token.logoURI} alt="" />}
                  </div>
                  <span className="text-base font-semibold text-[#151b11]">
                    {token.symbol}
                  </span>
                  <span className="flex-1 text-base font-medium text-[#151b11] text-right">
                    {token.balance}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TokenBoxPrimary;
