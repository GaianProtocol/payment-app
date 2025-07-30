import MoneyPlant from "@/assets/images/money-plant-1.png";
import { ArrowExplore, Exclude, FileCopy } from "@/assets/svgs";
import { useUser } from "@/hooks/use-user";
import { toast } from "react-toastify";

export const InviteFriends = () => {
  const { user } = useUser();

  const handleCopy = (refCode: string) => {
    window.navigator.clipboard.writeText(refCode);
    toast.success("Copied to clipboard");
  };
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
  return (
    <div className="self-stretch px-6 py-5 relative bg-gradient-to-r from-[#9fe870] to-[#a6ff08]  rounded-2xl inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
      <div className="absolute  overflow-hidden rounded-full w-72 h-64 -right-10 -top-1/2 translate-y-1/2">
        <img src={Exclude} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="text-[#151b11] text-xl font-bold">Invite Friends</div>
        <div className="text-black/50 text-xs font-medium">
          <ul>
            <li className="font-light flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-slate-600"></div>
              Refer new users & earn commission on their deposits
            </li>
            <li className="font-light flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-slate-600"></div>
              Unlimited referrals = Unlimited earnings!
            </li>
            <li className="font-light flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-slate-600"></div>
              Passive income made easy 💰
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="px-4 py-2 bg-[#151b11] rounded-full inline-flex justify-center items-center gap-2.5">
        <div className="text-white text-sm font-semibold">Start Earn now</div>
        <img src={ArrowRightBlue} alt="" className="w-4 h-4" />

        
      </div> */}
      {user && (
        <div className="inline-flex justify-center items-end gap-4 relative z-[1]">
          <div className="inline-flex flex-col justify-end items-start gap-2">
            <div className="justify-start text-black/80 text-sm font-medium">
              Referral link
            </div>
            <div
              onClick={() => handleShareOnX(user.referralCode)}
              className="w-[149px] h-11 pl-4 pr-1.5 py-1.5 bg-[#151b11] hover:bg-[#151b11]/80 cursor-pointer rounded-full inline-flex justify-start items-center gap-3"
            >
              <div className="justify-start text-white text-xs font-semibold ">
                INVITE FRIENDS
              </div>
              <div className="w-6 h-6 relative bg-white rounded-full overflow-hidden ">
                <img src={ArrowExplore} alt="" />
              </div>
            </div>
          </div>
          <div className="inline-flex flex-col justify-start items-start gap-2">
            <div className="justify-start text-black/80 text-sm font-medium">
              Referral Code
            </div>
            <div className="h-11 pl-4 pr-1.5 py-3 bg-white rounded-full inline-flex justify-center items-center gap-3">
              <div className="justify-start text-[#151b11] text-sm font-semibold">
                {user.referralCode}
              </div>
              <div
                onClick={() => handleCopy(user.referralCode)}
                className="w-8 h-8 relative bg-[#57803e] hover:bg-[#57803e]/80 flex items-center justify-center rounded-full overflow-hidden cursor-pointer"
              >
                <img src={FileCopy} alt="" />
              </div>
            </div>
          </div>
        </div>
      )}
      {!user && (
        <div
          onClick={() => document.getElementById("header-connect")?.click()}
          className=" h-11 px-4 py-1.5 bg-[#151b11] hover:bg-[#151b11]/80 cursor-pointer rounded-full inline-flex justify-start items-center gap-3"
        >
          <div className="justify-start text-white text-xs font-semibold ">
            Connect Wallet
          </div>
        </div>
      )}
      <div className="absolute overflow-hidden w-24 h-auto right-8 -bottom-4">
        <img src={MoneyPlant} alt="" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};
