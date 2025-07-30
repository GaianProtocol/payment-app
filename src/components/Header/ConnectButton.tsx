import WalletIcon from "@/assets/svgs/empty-wallet.svg";
import exploreIcon from "@/assets/svgs/explore-white.svg";
import copyIcon from "@/assets/svgs/file-copy-line.svg";
import solanaIcon from "@/assets/svgs/solana.svg";
import starIcon from "@/assets/svgs/star-outline.svg";
import StarSVG from "@/assets/svgs/star.svg";
import userIcon from "@/assets/svgs/user-circle.svg";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/hooks/use-user";
import useSolBalance from "@/hooks/useSolBalance";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { isMobile } from "@/utils/devices";
import { ellipsisCenter } from "@/utils/ellipsis";
import { Mail } from "lucide-react";
import { IoIosArrowDown, IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown";
import { Button } from "../ui/button";
export default function ConnectButton({ className }: { className?: string }) {
  const { login, user } = useUser();

  const isMobile = useIsMobile();

  if (user) {
    return (
      <div className="relative group">
        <Dropdown
          trigger={
            <button
              type="button"
              // style={{
              //   background:
              //     "linear-gradient(80.17deg, #27BEFF 8.52%, #6FD4FF 55.08%)",
              // }}
              className={cn(
                "info-wallet h-[36px] text-sm font-normal flex items-center justify-center rounded-full ",
                "md:px-63 px-3 border-opacity-10 ",
                "bg-[#E1F8D3] border-card",
                className
              )}
            >
              {/* <span className="px-2 text-white">{formatBalance()}</span> */}
              <span className={cn("text-black")}>
                {ellipsisCenter({
                  str: user?.privyUser.wallet?.address || "",
                  limit: isMobile ? 4 : 6,
                })}
              </span>
              <IoIosArrowDown fill="black" />
            </button>
          }
        >
          <div className="bg-white w-full h-full">
            <MenuDropdonw address={user?.privyUser.wallet?.address || ""} />
          </div>
        </Dropdown>
      </div>
    );
  }
  return (
    <Button
      id="header-connect"
      onClick={login}
      className="h-9 rounded-full bg-black px-4 hover:bg-black/70"
    >
      Login now
    </Button>
  );
}

const MenuDropdonw = ({ address }: { address: string }) => {
  const { balance } = useSolBalance();
  const { logout: logoutPrivy, user } = useUser();
  const navigate = useNavigate();
  const currentVersion = localStorage.getItem("app-version");
  const handleShareOnX = (refCode: string) => {
    const text = encodeURIComponent(
      "Refer new users & earn commission on their deposits: "
    );
    const url = encodeURIComponent(
      `${window.location.origin}/invite?code=${refCode}`
    );

    const shareUrl = `https://x.com/intent/tweet?text=${text}&url=${url}`;

    window.open(shareUrl, "_blank");
  };
  // const logout = async () => {
  //   try {
  //     localStorage.removeItem(ACCESS_TOKEN);
  //     axios.defaults.headers.common["Authorization"] = ``;
  //     clearProfile();
  //     await logoutPrivy();
  //   } catch (error) {
  //     console.log("🚀 ~ logout ~ error:", error);
  //   }
  // };

  return (
    <div className="w-[295px] bg-white  outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] inline-flex flex-col justify-start items-center overflow-hidden">
      <div className="self-stretch flex flex-col justify-center items-start overflow-hidden">
        <div className="self-stretch p-4 py-3 border-b border-[#e2e8ea] inline-flex justify-between items-center gap-2">
          <div className="flex-1 flex justify-start items-center gap-3">
            <img src={WalletIcon} alt="" />
            <div className="flex-1 justify-start text-black text-sm">
              {ellipsisCenter({
                str: address,
                limit: isMobile() ? 4 : 4,
              })}
            </div>
            <div className="pl-3 pr-4 py-2 md:hidden bg-[#f5fdf1] rounded-full h-9 outline outline-1 outline-offset-[-1px] outline-primary inline-flex justify-center items-center gap-2">
              <img src={StarSVG} alt="" />
              <div className="justify-start text-[#151b11] text-sm font-semibold leading-tight">
                0
              </div>
            </div>
          </div>
          <div
            className="w-5 h-5 relative overflow-hidden cursor-pointer"
            onClick={() => navigator.clipboard.writeText(address)}
          >
            <img src={copyIcon} alt="" />
          </div>
        </div>
        {user?.email && (
          <div className="self-stretch p-4 py-3 border-b border-[#e2e8ea] inline-flex justify-start items-center gap-3">
            <Mail size={22} />
            <div className="flex-1 flex justify-between items-center gap-2">
              <div className="flex-1 justify-start text-[#151b11] text-base max-w-[200px] truncate">
                {user?.email}
              </div>
              <div
                className="w-5 h-5 relative overflow-hidden cursor-pointer"
                onClick={() => navigator.clipboard.writeText(user?.email || "")}
              >
                <img src={copyIcon} alt="" />
              </div>
            </div>
          </div>
        )}

        <div className="self-stretch p-4 py-3 border-b border-[#e2e8ea] inline-flex justify-between items-center">
          <div className="flex-1 flex justify-start items-center gap-3">
            <img src={starIcon} alt="" />
            <div className="flex-1 justify-start text-[#151b11] text-base">
              Invite friends
            </div>
          </div>
          {user && (
            <div
              onClick={() => handleShareOnX(user.referralCode)}
              className="w-[100px] self-stretch pl-4 pr-1.5 py-1.5 bg-[#151b11] hover:bg-[#151b11]/80 rounded-full flex justify-between items-center cursor-pointer"
            >
              <div className="justify-start text-white text-xs ">INVITE</div>
              <img src={exploreIcon} alt="" />
            </div>
          )}
        </div>
        <div className="self-stretch p-4 py-3 border-b border-[#e2e8ea] inline-flex justify-between items-center">
          <div className="flex-1 flex justify-start items-center gap-3">
            <div className="rounded-full bg-dark p-1">
              <img src={solanaIcon} alt="" />
            </div>
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
              <div className="self-stretch justify-start text-[#151b11] text-base">
                Solana (SOL)
              </div>
              <div className="self-stretch justify-start text-[#616566] text-sm font-medium">
                {balanceDisplayer(balance, 3)}
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch p-4 py-3 border-b border-[#e2e8ea] inline-flex justify-start items-center gap-3">
          <img src={userIcon} alt="" />

          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="flex-1 justify-start text-[#151b11] text-base">
              Portfolio
            </div>
          </div>
        </div>

        <div
          className="self-stretch p-4 py-3 border-b hover:bg-slate-100 border-[#e2e8ea] inline-flex justify-start items-center gap-3 cursor-pointer"
          onClick={logoutPrivy}
        >
          <IoIosLogOut fill="red" size={24} />
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="flex-1 justify-start text text-base">Log out</div>
          </div>
        </div>

        <div className="border-t w-full p-4 px-5 text-sm flex justify-between">
          <div>Version:</div>
          {currentVersion}
        </div>
        {/* <div
          onClick={() => navigate(ROUTES.SPIN)}
          className="self-stretch p-4 py-3 border-b border-[#e2e8ea] inline-flex justify-start items-center gap-3"
        >
          <div className="flex-1 flex justify-start items-center gap-2">
            <Button className="flex-1  text-[#151b11] text-base">Spin</Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
