// components/tab-container/index.tsx
import { ArrowRight, ElementEqual, ElementEqualOutline } from "@/assets/svgs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/routes/paths.route";
import { cn } from "@/utils/cn";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useSearchParams
import { TokenOverview } from "../Swap/TokenOverview";
import { Deposit } from "./Deposit";
import { Withdraw } from "./Withdraw";

const TABS = ["Deposit", "Withdraw"];

// Types
interface TokenInfo {
  mint: PublicKey;
  ata?: PublicKey;
  balance?: bigint;
  mintConfig?: unknown;
}

// Hooks
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export const TabContainer = () => {
  const [tab, setTab] = useState(TABS[0]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigator = useNavigate();

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && TABS.includes(tabFromUrl)) {
      setTab(tabFromUrl);
    } else {
      setTab(TABS[0]);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return (
    <div className="w-full max-w-screen-lg px-2.5 md:px-[30px] py-10 mx-auto">
      <div className="md:w-fit mx-auto bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] flex overflow-hidden">
        <div className="md:w-[450px] w-full self-stretch p-5 flex flex-col gap-5 border-r">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                onClick={() => navigator(ROUTES.DASHBOARD)}
                className="w-10 cursor-pointer aspect-square px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] flex justify-center items-center"
              >
                <div className="w-5 h-5 relative overflow-hidden">
                  <img
                    src={ArrowRight}
                    className="w-full h-full rotate-180 object-cover"
                    alt=""
                  />
                </div>
              </div>
              <div className="text-xl font-semibold text-[#151b11]">
                gUSD Mint
              </div>
            </div>
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <div className="h-10 p-2 border rounded-lg flex justify-center items-center cursor-pointer">
                    <img src={ElementEqualOutline} alt="Open Token Overview" />
                  </div>
                </DrawerTrigger>
                <DrawerContent className="w-full max-w-[634px]">
                  <TokenOverview />
                </DrawerContent>
              </Drawer>
            ) : (
              <div
                className={cn(
                  "h-10 p-2 border rounded-lg flex justify-center items-center cursor-pointer",
                  isCollapsed && "bg-[#ebfae3] border-none"
                )}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <img src={ElementEqual} alt="Collapse" />
                ) : (
                  <img src={ElementEqualOutline} alt="Expand" />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 overflow-hidden">
            <Tabs
              value={tab} // Use controlled value instead of defaultValue
              onValueChange={handleTabChange} // Update tab and URL on change
              className="flex flex-col gap-4 overflow-hidden"
            >
              <TabsList className="h-12 p-1.5 bg-[#f5f8fa] rounded-xl outline outline-1 outline-offset-[-1px] outline-[#e1e4ea] flex gap-2">
                <TabsTrigger
                  value={TABS[0]}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-semibold uppercase text-[#99a0ae]",
                    tab === TABS[0] &&
                      "bg-white rounded-lg shadow-[0px_2px_10px_rgba(0,0,0,0.15)] border-b-2 border-[#cacfd8] flex justify-center items-center gap-4"
                  )}
                >
                  {TABS[0]}
                </TabsTrigger>
                <TabsTrigger
                  value={TABS[1]}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-semibold uppercase text-[#99a0ae]",
                    tab === TABS[1] &&
                      "bg-white rounded-lg shadow-[0px_2px_10px_rgba(0,0,0,0.15)] border-b-2 border-[#cacfd8] flex justify-center items-center gap-4"
                  )}
                >
                  {TABS[1]}
                </TabsTrigger>
              </TabsList>
              <TabsContent value={TABS[0]} className="w-full">
                <Deposit />
              </TabsContent>
              <TabsContent value={TABS[1]} className="w-full">
                <Withdraw />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {!isMobile && (
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ width: isCollapsed ? "634px" : "0px" }}
          >
            <TokenOverview />
          </div>
        )}
      </div>
    </div>
  );
};
