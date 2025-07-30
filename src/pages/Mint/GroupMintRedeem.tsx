import ButtonPrimary from "@/components/Button/ButtonPrimary";
import {
  E_TYPE_ACTION_MINT,
  TYPE_ACTION_LIMIT,
  TYPE_ACTION_MINT,
  TYPE_ACTION_SWAP,
} from "@/types/swap.type";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { upperCase } from "lodash";
import { useState } from "react";
import MintTab from "./MintTab";
import RedeemTab from "./RedeemTab";

type ActionTypes =
  | typeof TYPE_ACTION_SWAP
  | typeof TYPE_ACTION_MINT
  | typeof TYPE_ACTION_LIMIT;

export default function GroupMintRedeem() {
  const [option, setOption] = useState<string>(E_TYPE_ACTION_MINT.MINT);

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
            {Object.keys(TYPE_ACTION_MINT).map((key) => (
              <ButtonPrimary
                key={key}
                active={upperCase(option) === upperCase(key)}
                onClick={() => {
                  setOption(key);
                }}
                className="min-w-[160px]"
              >
                {TYPE_ACTION_MINT[key as keyof ActionTypes]}
              </ButtonPrimary>
            ))}
          </div>
        </div>
        {option === E_TYPE_ACTION_MINT.MINT ? <MintTab /> : <RedeemTab />}
      </div>
    </div>
  );
}
