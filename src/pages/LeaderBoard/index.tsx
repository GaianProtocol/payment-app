import SelectAvatarImg from "@/assets/images/select-avatar.png";
import DropdownIcon from "@/assets/svgs/dropdown.svg";
import EarnedIcon from "@/assets/svgs/earned.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import LossIcon from "@/assets/svgs/loss.svg";
import WinIcon from "@/assets/svgs/win.svg";
import { Header } from "@/components";
import ButtonViolet from "@/components/Button/ButtonViolet";
import Footer from "@/components/Footer";
import { PopoverMenu } from "@/components/Popover/Popover";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { cn } from "@/utils/cn";
import { useState } from "react";

const mockupTopScore = [
  {
    rank: 312,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
    win: 100,
    loss: 50,
    earned: 500,
  },
  {
    rank: 1,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
    win: 100,
    loss: 50,
    earned: 500,
  },
  {
    rank: 2,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
    win: 100,
    loss: 50,
    earned: 500,
  },
  {
    rank: 3,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
    win: 100,
    loss: 50,
    earned: 500,
  },
  {
    rank: 4,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
    win: 100,
    loss: 50,
    earned: 500,
  },
  {
    rank: 5,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
    win: 100,
    loss: 50,
    earned: 500,
  },
  {
    rank: 6,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
    win: 100,
    loss: 50,
    earned: 500,
  },
];

enum TIME_BY {
  ALL = "all",
  WEEK = "week",
}

const TIME_BY_TEXT = {
  [TIME_BY.WEEK]: "Week",
  [TIME_BY.ALL]: "All Time",
};

export default function LeaderBoard() {
  const [gameType, setGameType] = useState<TIME_BY>(TIME_BY.ALL);
  const userId = 312;
  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="py-6 w-full flex gap-8 max-w-[570px] mx-auto flex-col lg:flex-row">
            <div className="flex flex-col flex-1 gap-4">
              <span className="font-semibold text-2xl lg:text-3xl text-center uppercase text-gaming-gradient">
                Leaderboard
              </span>
              <div className="flex justify-between">
                <div className="flex w-fit justify-center items-center gap-[13px] p-[5px] rounded-[70px] border border-opacity-10 bg-gradient-light border-white">
                  {Object.keys(TIME_BY).map(key => (
                    <button
                      key={key}
                      onClick={() =>
                        setGameType(TIME_BY[key as keyof typeof TIME_BY])
                      }
                      className={cn(
                        "rounded-full px-[18px] py-[10px] flex items-center justify-center",
                        " text-xs font-medium relative",
                        gameType === TIME_BY[key as keyof typeof TIME_BY]
                          ? "bg-gradient-violet"
                          : ""
                      )}
                    >
                      <span className="font-medium text-[12px] text-center text-white uppercase ">
                        {TIME_BY_TEXT[TIME_BY[key as keyof typeof TIME_BY]]}
                      </span>
                    </button>
                  ))}
                </div>

                <PopoverMenu
                  triggerContent={
                    <ButtonViolet className=" w-auto h-[50px] gap-3 group px-6">
                      <img src={FilterIcon} />
                      ALL GAMES
                      <img src={DropdownIcon} alt="" className="w-4 h-4" />
                    </ButtonViolet>
                  }
                  options={[
                    {
                      key: "1",
                      label: "ALL GAMES",
                      onClick: () => {},
                    },
                  ]}
                  className="text-xs"
                />
              </div>
              <div className="w-full flex flex-col gap-3">
                {mockupTopScore.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex justify-between items-center self-stretch px-4 py-3 rounded-xl  border border-solid border-white border-opacity-10 backdrop-blur-sm ",
                      item.rank === userId
                        ? "bg-gradient-violet-light"
                        : "bg-gradient-light"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <ButtonViolet
                        className="h-[32px] w-[32px] text-sm"
                        active={[1, 2, 3].includes(item.rank)}
                      >
                        {item.rank}
                      </ButtonViolet>
                      <div className="flex items-center gap-3 flex-1">
                        <ButtonViolet className="h-[42px] w-[42px]">
                          <img
                            src={item.avatar}
                            className="h-[32px] w-[32px] rounded-full"
                          />
                        </ButtonViolet>
                        <div className="flex flex-col gap-2 flex-1">
                          <span className="font-semibold text-md uppercase">
                            {item.name}
                            <span className="font-semibold text-md uppercase text-primary">
                              {" "}
                              {item.rank === userId ? " (you)" : ""}
                            </span>
                          </span>
                          <div className="flex items-center flex-wrap gap-4">
                            <div className="flex justify-center items-center gap-1">
                              <img src={WinIcon} alt="" />
                              <span className="font-normal text-[14px] text-center text-white">
                                Win: 100
                              </span>
                            </div>
                            <div className="flex justify-center items-center gap-1">
                              <img src={LossIcon} alt="" />
                              <span className="font-normal text-[14px] text-center text-white">
                                Loss: 100
                              </span>
                            </div>
                            <div className="flex justify-center items-center gap-1">
                              <img src={EarnedIcon} alt="" />
                              <span className="font-normal text-[14px] text-center text-white">
                                Earned: $ 500
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end gap-2">
                      <span className="font-normal text-[14px] text-center text-primary whitespace-nowrap">
                        {item.score} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
