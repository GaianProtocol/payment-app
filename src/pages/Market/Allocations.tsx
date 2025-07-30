import { DollarCapa, USDS, Usdc } from "@/assets/svgs";

interface Allocation {
  title: string;
  amount: string;
  feeApy: string;
  icon: string;
}

const allocations: Allocation[] = [
  {
    title: "Stablecoin Yields",
    amount: "$5.99M",
    feeApy: "0.41%",
    icon: "https://placehold.co/24x24",
  },
  {
    title: "Liquidity LPs",
    amount: "$2.63M",
    feeApy: "0.005%",
    icon: "https://placehold.co/24x24",
  },
  {
    title: "Lending Borrow",
    amount: "$289.56K",
    feeApy: "0.96%",
    icon: "https://placehold.co/24x24",
  },
  {
    title: "RWA LP",
    amount: "$97.20K",
    feeApy: "0.56%",
    icon: "https://placehold.co/24x24",
  },
  {
    title: "Alpha LP",
    amount: "$30.57K",
    feeApy: "0.5%",
    icon: "https://placehold.co/24x24",
  },
  {
    title: "Beta LP",
    amount: "$45.67K",
    feeApy: "0.7%",
    icon: "https://placehold.co/24x24",
  },
];

const AllocationCard = ({ title, amount, feeApy }: Allocation) => (
  <div className="flex-1 p-4 bg-white rounded-xl outline outline-1 outline-[#e2e8ea] flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-sm text-[#a7acae] font-light">{title}</div>
        <div className="text-base font-semibold text-dark">{amount}</div>
      </div>
      <div className="relative">
        <img className="w-6 h-6" src={USDS} alt={title} />
        <img
          className="w-6 h-6 absolute top-0 right-3"
          src={Usdc}
          alt={title}
        />
      </div>
    </div>
    <div className="w-full h-[1px] bg-[repeating-linear-gradient(90deg,#e2e8ea_0px,#e2e8ea_4px,transparent_12px,transparent_16px)]" />
    <div className="flex justify-between items-center">
      <div className="text-sm text-[#616566]">7D Fee APY</div>
      <div className="px-3 py-1 bg-primary rounded-full text-sm font-medium text-dark">
        {feeApy}
      </div>
    </div>
  </div>
);

export const Allocations = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-[#e2f3e9] to-[#ddfacc] rounded-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex gap-3 items-start">
        <img src={DollarCapa} alt="" className="w-6 h-6 mt-1" />
        <div>
          <div className="text-xl font-semibold text-dark">Allocations</div>
          <div className="text-sm text-[#616566]">
            Yield by depositing into your Gaian Strategies stablecoin.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {allocations.map((item, index) => (
          <AllocationCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
