import ArrowLeft from "@/assets/icons/ArrowLeft";
import ArrowRight from "@/assets/icons/ArrowRight";
import ExploreIcon from "@/assets/images/explore-icon.png";
import GameBanner from "@/assets/images/game-banner.png";
import GameImg from "@/assets/images/image-game.png";
import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { IGame } from "@/types/game.type";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { GameCard } from "./GameCard";

export enum GAME_TYPE {
  ARCADA = "Arcada",
  SPORT = "Sport",
}

const mockupPopularGame: IGame[] = [
  {
    id: 1,
    url: "/games/madguys/index.html",
    image: GameImg,
    gameName: "Madguys",
    gameType: GAME_TYPE.ARCADA,
    description: "Description Game 1",
  },
  {
    id: 2,
    url: "",
    image: GameImg,
    gameName: "Name Game 2",
    gameType: GAME_TYPE.SPORT,
    description: "Description Game 1",
  },
  {
    id: 3,
    url: "",
    image: GameImg,
    gameName: "Name Game 3",
    gameType: GAME_TYPE.ARCADA,
    description: "Description Game 1",
  },
  {
    id: 4,
    url: "",
    image: GameImg,
    gameName: "Name Game 4",
    gameType: GAME_TYPE.SPORT,
    description: "Description Game 1",
  },
];

const mockupArcadaGame: IGame[] = [
  {
    id: 1,
    url: "",
    image: GameImg,
    gameName: "Name Game 1",
    gameType: GAME_TYPE.ARCADA,
    description: "Description Game 1",
  },
  {
    id: 2,
    url: "",
    image: GameImg,
    gameName: "Name Game 2",
    gameType: GAME_TYPE.SPORT,
    description: "Description Game 1",
  },
  {
    id: 3,
    url: "",
    image: GameImg,
    gameName: "Name Game 3",
    gameType: GAME_TYPE.ARCADA,
    description: "Description Game 1",
  },
  {
    id: 4,
    url: "",
    image: GameImg,
    gameName: "Name Game 4",
    gameType: GAME_TYPE.SPORT,
    description: "Description Game 1",
  },
];

export default function GamePage() {
  const [active, setActive] = useState(true);
  const [gameType, setGameType] = useState<GAME_TYPE>(GAME_TYPE.ARCADA);

  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="py-6 w-full flex flex-col gap-8 max-w-[910px] mx-auto">
            <div
              className={cn(
                "w-full flex md:flex-row flex-col justify-end md:justify-between items-end gap-4 px-6 py-3 rounded-xl ",
                ` bg-cover bg-center bg-no-repeat`,
                "h-[210px] "
              )}
              style={{
                backgroundImage: `url(${GameBanner})`,
              }}
            >
              <span className="font-semibold text-md text-center uppercase px-5 py-[15px] text-gaming-gradient">
                Banner ADS
              </span>
              <div
                className={cn(
                  "flex justify-center backdrop-blur-[3px] items-center gap-2.5 px-5 py-[15px] rounded-[70px]",
                  "border border-white border-opacity-10",
                  "cursor-pointer"
                )}
              >
                <span className=" uppercase text-sm text-center text-white">
                  Request a game
                </span>
                <img src={ExploreIcon} className="md:w-5 md:h-5 w-4 h-4" />
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between items-center self-stretch">
                <span className="font-semibold text-2xl lg:text-3xl text-center uppercase text-gaming-gradient">
                  Popular
                </span>
                <div className="flex justify-center items-center gap-[13px] p-[5px] rounded-[70px] border border-opacity-10 bg-gradient-light border-white">
                  {Object.keys(GAME_TYPE).map(key => (
                    <button
                      key={key}
                      onClick={() =>
                        setGameType(GAME_TYPE[key as keyof typeof GAME_TYPE])
                      }
                      className={cn(
                        "rounded-full px-[18px] py-[10px] flex items-center justify-center",
                        " text-xs font-medium relative",
                        gameType === GAME_TYPE[key as keyof typeof GAME_TYPE]
                          ? "bg-gradient-violet"
                          : ""
                      )}
                    >
                      <span className="font-medium text-[12px] text-center text-white ">
                        {key}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 self-stretch overflow-x-auto">
                {mockupPopularGame.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between items-center self-stretch">
                <span className="font-semibold text-2xl lg:text-3xl text-center uppercase text-gaming-gradient">
                  Arcada
                </span>
                <div className="flex items-center gap-3">
                  <button
                    className={cn(
                      "rounded-full",
                      "w-9 h-9 flex items-center justify-center",
                      !active
                        ? "bg-gradient-violet-light border border-[#7761CB66] border-opacity-40"
                        : "bg-gradient-light border border-white border-opacity-10"
                    )}
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    className={cn(
                      "rounded-full",
                      "w-9 h-9 flex items-center justify-center",
                      active
                        ? "bg-gradient-violet-light border border-[#7761CB66] border-opacity-40"
                        : "bg-gradient-light border border-white border-opacity-10"
                    )}
                  >
                    <ArrowRight />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 self-stretch overflow-x-auto">
                {mockupArcadaGame.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-4 px-4 py-9 rounded-xl border border-opacity-10 border-white bg-gradient-light backdrop-blur-md">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-lg text-center uppercase px-5 py-[15px] text-gaming-gradient ">
                  Can’t find what you’re looking for?
                </span>
              </div>
              <div
                className={cn(
                  "flex justify-center backdrop-blur-[3px] items-center gap-2.5 px-5 py-[15px] rounded-[70px]",
                  "border border-white border-opacity-10",
                  "bg-gradient-light",
                  "cursor-pointer"
                )}
              >
                <span className=" uppercase text-sm text-center text-white">
                  Request a game
                </span>
                <img src={ExploreIcon} className="md:w-5 md:h-5 w-4 h-4" />
              </div>
            </div>
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
