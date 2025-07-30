export default function Slippage() {
  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[#415294] text-sm font-normal">
          Slippage Tolerance (0.25%)
        </span>
        <ArrowDown />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          // style={{
          //   accentColor: "#00ff04",
          // }}
          className="appearance-none checked:appearance-auto h-4 w-4 border border-[#7780A1] rounded checked:bg-[#7780A1] bg-transparent"
        />
        <span className="text-[#7780A1] text-sm font-normal">
          Take Profit/Stop Loss
        </span>
      </div>
      <div className="bg-[#2f3136] h-[1px] w-full my-3"></div>
      <div className="text-[#7780A1] text-base font-normal tracking-base">
        Est. Liquidation Price
      </div>
      <div className="flex justify-between items-start">
        <span className="text-[#7780A1] text-base font-normal tracking-base">
          Fees
        </span>
        <span className="text-white text-base font-normal tracking-base">
          0
        </span>
      </div>
    </div>
  );
}

function ArrowDown() {
  return (
    <svg
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.3375 2.2775L5.8075 5.8075C5.6575 5.9575 5.4675 6.0275 5.2775 6.0275C5.0875 6.0275 4.8975 5.9575 4.7475 5.8075L1.2175 2.2775C0.9275 1.9875 0.9275 1.5075 1.2175 1.2175C1.5075 0.9275 1.9875 0.9275 2.2775 1.2175L5.2775 4.2175L8.2775 1.2175C8.5675 0.9275 9.0475 0.9275 9.3375 1.2175C9.6275 1.5075 9.6275 1.9775 9.3375 2.2775Z"
        fill="#415294"
      />
    </svg>
  );
}
