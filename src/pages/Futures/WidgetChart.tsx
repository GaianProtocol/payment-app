import btcIcon from "@/assets/images/BTC.png";
import usdcIcon from "@/assets/images/USDC.png";
import refreshIcon from "@/assets/svgs/refresh-icon.svg";
import useGetPrice from "@/hooks/useGetPrice";
import { balanceDisplayer } from "@/utils/convert";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export default function WidgetChart() {
  const { price } = useGetPrice({
    symbol: "BTC",
  });
  return (
    <div className="w-full ">
      <div className="pb-5">
        <div className="flex gap-2 items-center">
          <div className="relative w-11">
            <img className="h-6 mt-1 relative z-10" src={btcIcon} />
            <img className="h-8 absolute  right-0 top-0" src={usdcIcon} />
          </div>
          <div className="text-lg font-bold text-white">
            BTC/<span className="text-[#8B8CA7]">USDC</span>
          </div>
          <img className="w-6 h-6" src={refreshIcon} />
        </div>
        <div className="text-white font-bold text-[48px]">
          {balanceDisplayer(price)} USDC
        </div>
        <div className="flex gap-2">
          <div className="text-sm font-normal text-[#53F3C3]">
            +{balanceDisplayer(price - 61200)} USDC
          </div>
          <div className="text-sm font-normal text-white">Past 24 Hours</div>
        </div>
      </div>
      <AdvancedRealTimeChart
        symbol="BTCUSD"
        theme="dark"
        withdateranges={false}
        interval="D"
        width="100%"
        height={550}
        hide_top_toolbar
        allow_symbol_change={false}
        // enable_publishing={false}
      ></AdvancedRealTimeChart>
    </div>
  );
}
