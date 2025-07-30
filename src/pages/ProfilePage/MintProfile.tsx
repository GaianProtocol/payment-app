import ArrowDown from "@/assets/icons/ArrowDown";
import PencilIcon from "@/assets/icons/PencilIcon";
import SelectAvatarImg from "@/assets/images/select-avatar.png";
import ButtonViolet from "@/components/Button/ButtonViolet";
import { cn } from "@/utils/cn";

export default function MintProfile() {
  return (
    <div
      className={cn(
        "bg-gradient-light backdrop-blur-[7px] border border-white border-opacity-10",
        "p-4 rounded-xl"
      )}
    >
      <div className="flex gap-3 w-full justify-between items-center">
        <div className="flex gap-3 items-center">
          <ButtonViolet>03</ButtonViolet>
          <div className="uppercase font-medium text-sm">Mint profile</div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 w-full">
        <div className="p-2 rounded-xl border-white border-opacity-10 bg-gradient-light">
          <img
            src={SelectAvatarImg}
            alt="Select avatar"
            className="min-w-[90px] h-[90px]"
          />
        </div>
        <div className="w-full flex justify-between flex-col min-h-[106px]">
          <div className="flex justify-between items-center">
            <div className="text-xs font-normal text-white text-opacity-40">
              Name:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal">John Doe</span>
              <PencilIcon />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs font-normal text-white text-opacity-40">
              Tribe:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal">Madlads</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs font-normal text-white text-opacity-40">
              Rarity:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal">1124th</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs font-normal text-white text-opacity-40">
              Prefences:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal">Casual Games</span>
              <ArrowDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
