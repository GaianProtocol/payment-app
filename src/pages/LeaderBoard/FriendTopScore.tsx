import SelectAvatarImg from "@/assets/images/select-avatar.png";
import ButtonViolet from "@/components/Button/ButtonViolet";
import { cn } from "@/utils/cn";
const mockupTopScore = [
  {
    id: 312,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
  },
  {
    id: 134,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
  },
  {
    id: 124,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
  },
  {
    id: 245,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
  },
  {
    id: 123,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
  },
  {
    id: 123,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
  },
  {
    id: 123,
    name: "Johny Cash",
    avatar: SelectAvatarImg,
    score: 1200,
  },
];
export default function FriendTopScore() {
  const userId = 312;
  return (
    <div className="flex flex-col flex-1 gap-3">
      <span className="font-semibold text-2xl lg:text-3xl text-start uppercase text-gaming-gradient">
        Friends Top Score
      </span>
      <div className="w-full flex flex-col gap-3">
        {mockupTopScore.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex justify-between items-center self-stretch px-4 py-3 rounded-xl  border border-solid border-white border-opacity-10 backdrop-blur-sm ",
              item.id === userId
                ? "bg-gradient-violet-light"
                : "bg-gradient-light"
            )}
          >
            <div className="flex items-center gap-3">
              <ButtonViolet>{item.id}</ButtonViolet>
              <div className="flex items-center gap-3">
                <ButtonViolet className="h-[42px] w-[42px]">
                  <img
                    src={item.avatar}
                    className="h-[32px] w-[32px] rounded-full"
                  />
                </ButtonViolet>
                <span className="font-semibold text-md uppercase">
                  {item.name}
                  <span className="font-semibold text-md uppercase text-primary">
                    {" "}
                    {item.id === userId ? " (you)" : ""}
                  </span>
                </span>
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
  );
}
