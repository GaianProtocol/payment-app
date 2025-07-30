import PlayIcon from "@/assets/svgs/play.svg";
import { IGame } from "@/types/game.type";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
export const GameCard = ({ game }: { game: IGame }) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        " lg:h-[300px] lg:min-w-[218px] min-w-[150px]",
        "flex bg-gradient-light flex-col justify-between gap-4 p-4 rounded-xl border border-solid border-white border-opacity-10 bg-opacity-10 backdrop-blur-md"
      )}
    >
      <img
        className="h-[80%] object-cover rounded-md lg:min-h-[218px] "
        src={game.image}
        alt="Game"
      />
      <div className="flex flex-col gap-[19px] self-stretch">
        <div className="flex justify-between items-center self-stretch gap-2">
          <span className="font-medium text-sm md:text-[16px] text-center text-white">
            {game.gameName}
          </span>

          <button
            className={cn(
              "rounded-full  flex items-center justify-center",
              " text-xs font-medium relative",
              "bg-gradient-violet",
              "h-[34px] min-w-[34px] group"
            )}
            onClick={() => {
              if (game.url) {
                navigate(`/games/${game.id}`);
              }
            }}
          >
            <span className="font-medium group-hover:scale-[1.2] transition duration-300 text-[12px] text-center text-white ">
              <img className="" src={PlayIcon} alt="" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
