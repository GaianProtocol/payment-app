import { EmptyWallet } from "@/assets/svgs";
import { ITokenOption } from "@/types/swap.type";
import { formatLargeNumber } from "@/utils/utils";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function TokenSelector({
  selectedToken,
  tokenOptions,
  currentBalance,
  onSelect,
}: {
  selectedToken: ITokenOption;
  tokenOptions: ITokenOption[];
  currentBalance: number;
  onSelect: (token: ITokenOption) => void;
}) {
  return (
    <div className="w-full relative p-2 py-1.5 bg-white rounded-xl border inline-flex justify-between items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="flex items-center gap-4 w-full py-1">
            <div className="w-9 h-9 p-2 bg-slate-50 border rounded-full flex justify-center items-center">
              <img src={EmptyWallet} alt="Wallet" className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start flex-1 gap-0.5">
              <div className="text-xs font-normal text-zinc-400 leading-none">
                Available to send
              </div>
              <div className="flex items-center gap-1.5">
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-4 h-4"
                />
                <div className="text-sm font-semibold text-neutral-900">
                  {formatLargeNumber(currentBalance)} {selectedToken.symbol}
                </div>
              </div>
            </div>
            <IoIosArrowDown fill="black" className="w-12" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="rounded-2xl min-w-[200px] !z-[9999]"
          align="end"
        >
          <DropdownMenuGroup>
            <div className="flex flex-col w-full">
              {tokenOptions.map((token) => (
                <DropdownMenuItem
                  key={token.symbol}
                  onClick={() => onSelect(token)}
                  className="cursor-pointer rounded-full"
                >
                  <div className="flex items-center gap-3 p-1 rounded-xl w-full justify-between">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      {token.logoURI && <img src={token.logoURI} alt="" />}
                    </div>
                    <span className="text-base flex items-center gap-2 font-semibold text-[#151b11]">
                      <div className="text-sm font-semibold">
                        {formatLargeNumber(token.balance || 0)}
                      </div>
                      {token.symbol}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
