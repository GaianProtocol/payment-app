import { cn } from "@/utils/cn";
import { useLocation, useNavigate } from "react-router-dom";

const TAB = [
  {
    name: "Swap",
    path: "/swap",
  },
  {
    name: "Saving/Pay",
    path: "/market",
  },
  {
    name: "Reward",
    path: "/reward",
  },
  {
    name: "Referral",
    path: "/referral",
  },
];

export const Tab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  return (
    <div
      className={cn(
        "flex items-center gap-4 h-[60px] p-4 rounded-xl bg-darkGray border border-primary fixed bottom-1 w-[90%] justify-between right-1/2 left-1/2 -translate-x-1/2 max-md:!py-1.5 z-20 md:hidden"
      )}
      // style={{
      //   background:
      //     "linear-gradient(84.01deg, #EFFAFF 9.05%, #D2F2FF 34.59%, #D2F2FF 57.49%, #BBEBFF 79.51%, #CDF0FF 97.13%)",
      // }}
    >
      {TAB.map((item) => (
        <div
          key={item.name}
          onClick={() => navigate(item.path)}
          className="w-full flex flex-col items-center gap-1"
        >
          <span
            className={`text-base font-semibold md:hidden ${
              pathname.includes(item.path) ? "text-primary" : "text-white"
            }`}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};
