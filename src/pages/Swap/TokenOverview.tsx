import { Dropdown, LogoWithoutText } from "@/assets/svgs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useTokenGUSDInfo from "@/hooks/use-token-info";
import { cn } from "@/lib/utils";
import { formatLargeNumber } from "@/utils/utils";
import React, { useState } from "react";

interface FAQItemProps {
  question: string;
  answer?: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      className={cn("w-full border rounded-lg", isOpen && "bg-[#f5f8fa]")}
    >
      <CollapsibleTrigger
        className="w-full flex items-center justify-between px-3 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-semibold text-[#151b11] leading-tight">
          {question}
        </span>
        <img
          src={Dropdown}
          alt="Toggle"
          className={cn(
            "w-5 h-5 text-black transition-transform duration-300 ease-in-out",
            isOpen ? "scale-y-[-1]" : ""
          )}
        />
      </CollapsibleTrigger>
      {answer && (
        <CollapsibleContent className="px-4 border-t overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:max-h-0 data-[state=open]:max-h-[500px]">
          <div className="py-4 text-sm text-[#616566] leading-tight font-light">
            {answer}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

interface FAQ {
  question: string;
  answer?: React.ReactNode;
}

const faqData: FAQ[] = [
  {
    question: "What is a trade?",
    answer: (
      <>
        A trade is the direct exchange of one cryptocurrency token for another
        at current market prices. GAIAN Protocol users can trade eligible tokens
        via an API integration with the third-party decentralised exchange CoW
        Protocol. These trades occur through smart contracts on the blockchain
        without relying on centralised entities. The exact trade route is
        determined by CoW Protocol and is not influenced by GAIAN.money or the
        GAIAN Protocol.
        <br />
        <br />
        Note that price slippage—a change in price between the time of the trade
        order and its execution on the blockchain—can occur due to market
        volatility. When you trade via the GAIAN Protocol, you can set your
        slippage tolerance level.
      </>
    ),
  },
  {
    question: "Why would I trade tokens?",
    answer:
      "Trading tokens enables liquidity, portfolio diversification, and the ability to capitalize on market movements.",
  },
  {
    question: "Is trading using GAIAN.money free?",
    answer:
      "Trading on GAIAN.money may incur fees to cover transaction costs. Please refer to our fee schedule for the latest details.",
  },
];
const network = import.meta.env.VITE_NETWORK || "devnet";

export const TokenOverview = () => {
  const { tokens } = useTokenGUSDInfo();

  return (
    <div className="w-full md:w-[634px] self-stretch px-4 py-5 inline-flex flex-col gap-4">
      <div className="inline-flex items-center gap-4">
        <img src={LogoWithoutText} alt="Logo" />
        <div className="text-2xl font-semibold text-[#151b11]">
          GAIAN Token Overview
        </div>
      </div>
      <div className="inline-flex w-full items-center gap-2 flex-wrap">
        <div className="flex-1 p-4 bg-[#f5f8fa] rounded-xl flex flex-col gap-1.5">
          <span className="text-sm font-normal text-[#616566] leading-tight">
            Total Minted
          </span>
          <span className="text-lg font-semibold text-[#151b11] whitespace-nowrap">
            {formatLargeNumber(tokens?.totalMinted || 0)} gUSD
          </span>
        </div>
        {/* <div className="flex-1 p-4 bg-[#f5f8fa] rounded-xl flex flex-col gap-1.5">
          <span className="text-sm font-normal text-[#616566] leading-tight">
            Available to Mint
          </span>
          <span className="text-lg font-semibold text-[#151b11] whitespace-nowrap">
            245.4M gUSD
          </span>
        </div> */}
        <div className="flex-1 p-4 bg-[#f5f8fa] rounded-xl flex flex-col gap-1.5">
          <span className="text-sm font-normal text-[#616566] leading-tight">
            TVL
          </span>
          <span className="text-lg font-semibold text-[#151b11]">~</span>
        </div>
        <div className="flex-1 p-4 bg-[#f5f8fa] rounded-xl flex flex-col gap-1.5">
          <span className="text-sm font-normal text-[#616566] leading-tight">
            APY
          </span>
          <span className="text-lg font-semibold text-[#151b11]">~</span>
        </div>
      </div>
      <div className="px-5 py-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] flex flex-col gap-4 overflow-hidden">
        <span className="text-base font-semibold text-[#151b11] leading-normal">
          About gUSD
        </span>
        <p className="text-sm font-normal text-[#616566] leading-tight">
          gUSD is the stablecoin of the decentralised GAIAN Protocol. It can be
          used in several ways, including to participate in the GAIAN Savings
          Rate and get GAIAN Token Rewards without giving up control. It is the
          upgraded version of DAI.
        </p>
      </div>
      <div className="p-5 overflow-y-auto max-h-[350px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] flex flex-col items-center gap-4">
        <div className="w-full inline-flex items-center gap-4">
          <span className="text-base font-semibold text-[#151b11] leading-normal">
            Frequently Asked Questions
          </span>
        </div>
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};
