import useSolBalance from "@/hooks/useSolBalance";
import useTokenBalanceSol from "@/hooks/useTokenBalanceSol";
import { useTokenSuffix } from "@/store/tokenStore";
import { ITokenOption } from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { ellipsisCenter } from "@/utils/ellipsis";
import { debounce } from "lodash";
import { useMemo, useState } from "react";

export default function SelectToken({
  options,
  onSelected,
}: {
  options: ITokenOption[];
  onSelected: (symbol: string) => void;
}) {
  const { tokens } = useTokenBalanceSol();
  const suffix = useTokenSuffix();
  const { balance } = useSolBalance();
  const [inputSearch, setInputSearch] = useState("");
  const optionsFilter: ITokenOption[] = useMemo(
    () =>
      [...options].filter(
        (token) =>
          token.name.toLowerCase().includes(inputSearch.toLowerCase()) ||
          token.symbol.toLowerCase().includes(inputSearch.toLowerCase())
      ),
    [balance, tokens, inputSearch]
  );
  const debounceInput = debounce((e) => {
    setInputSearch(e.target.value);
  }, 100);
  return (
    <div className="mt-6">
      <div
        className={cn(
          "w-full flex items-center gap-1 px-3 py-4",
          "h-14 border-white border-opacity-15 rounded-lg bg-[#2F3136]"
        )}
      >
        <FindIcon />
        <div className="h-[14px] w-[1px] bg-[#A6A7AD]"></div>
        <input
          onChange={debounceInput}
          placeholder="Search by token or pass address"
          className={cn(
            "bg-transparent w-full text-sm font-normal text-white",
            "focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          )}
        />
      </div>
      <div className="mt-6 flex flex-col gap-4 h-[326px]">
        {optionsFilter.map((token) => (
          <div
            key={token.symbol}
            className={cn(
              "bg-[#2F3136] border border-white border-opacity-15 rounded-2xl px-6 py-4 h-[98px]",
              "flex justify-between items-center cursor-pointer"
            )}
            onClick={() => onSelected(token.symbol)}
          >
            <div className="flex gap-4 items-center">
              <img
                src={token.logoURI}
                className="w-12 h-12 rounded-full"
                alt=""
              />
              <div className="flex flex-col justify-between">
                <div className="text-base text-white font-normal tracking-base">
                  {token.symbol}
                </div>
                <div className="text-base text-[#7780A1] font-light tracking-base">
                  {token.name}
                </div>
                <div className="text-base text-[#7780A1] font-light tracking-base">
                  {ellipsisCenter({
                    str: token?.address || "",
                    limit: 6,
                  })}
                </div>
              </div>
            </div>
            <div className="text-white text-base font-normal tracking-base">
              {balanceDisplayer(token.balance || "0")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FindIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4706 19.9412C16.1488 19.9412 19.9412 16.1488 19.9412 11.4706C19.9412 6.79241 16.1488 3 11.4706 3C6.79241 3 3 6.79241 3 11.4706C3 16.1488 6.79241 19.9412 11.4706 19.9412Z"
        stroke="#E9E9EB"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21.0002 21L17.8237 17.8235"
        stroke="#E9E9EB"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
