import GameImg from "@/assets/images/image-game.png";
import PlayIcon from "@/assets/svgs/play-violet.svg";
import { Header } from "@/components";
import ButtonViolet from "@/components/Button/ButtonViolet";
import Footer from "@/components/Footer";
import { useToggleModal } from "@/hooks/useModal";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { IGame } from "@/types/game.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GAME_TYPE } from ".";
import DepositModal from "./DepositModal";
import FriendTopScore from "./FriendTopScore";

const mockupGameDetails: IGame = {
  id: 1,
  url: "/games/madguys/index.html",
  image: GameImg,
  gameName: "Madguys",
  gameType: GAME_TYPE.ARCADA,
  description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
};
export default function GameDetail() {
  const { id } = useParams();
  const [gameDetail, setGameDetail] = useState<IGame>();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (id) {
      setGameDetail(mockupGameDetails);
    }
  };

  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="py-6 w-full flex gap-8 max-w-[910px] mx-auto flex-col lg:flex-row">
            {gameDetail && <GameDetailCard gameDetail={gameDetail} />}
            <FriendTopScore />
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}

const GameDetailCard = ({ gameDetail }: { gameDetail: IGame }) => {
  const toggleModal = useToggleModal();

  const openModal = () => {
    toggleModal({
      title: "",
      data: <DepositModal />,
      open: true,
      width: 540,
    });
  };
  return (
    <div className="max-w-[540px] mx-auto flex flex-col justify-center gap-4 card">
      <img
        className="object-cover rounded-md h-[300px]"
        src={gameDetail.image}
        alt="Game"
      />
      <div className="flex flex-col justify-center gap-2.5 self-stretch">
        <span className="font-semibold text-lg text-start uppercase">
          {gameDetail.gameName}
        </span>
        <span className=" text-[14px] text-[#9CA3AF] ">
          {gameDetail.description}
        </span>
      </div>
      <div className="flex gap-4 self-stretch">
        <ButtonViolet
          onClick={() => {
            if (gameDetail.url) {
              window.open(gameDetail.url, "_blank");
            }
          }}
          active={true}
          className="w-1/2 h-[50px] gap-3 group "
        >
          <span className=" text-md uppercase text-center text-white">
            Play For Fun
          </span>
          <div className="p-1.5 bg-white rounded-full group-hover:scale-[1.2] transition-all duration-200">
            <img src={PlayIcon} className="fill-[#7761cb]" alt="" />
          </div>
        </ButtonViolet>
        <ButtonViolet
          className="w-1/2 h-[50px] gap-3 group"
          onClick={openModal}
        >
          <span className=" text-md uppercase text-center text-white">
            Play For $Cash
          </span>
          <ButtonViolet
            active
            className="md:w-5 md:h-5 w-4 h-4 text-black group-hover:scale-[1.2] transition-all duration-200 "
          >
            $
          </ButtonViolet>
        </ButtonViolet>
      </div>
    </div>
  );
};
