import {
  Capa,
  Cards,
  DollarActive,
  DollarOutline,
  Explore,
  HistoryActiveIcon,
  HistoryIcon,
  Home,
  HomeActive,
  Profile,
  ProfileActive,
  Scan,
  Scan1,
  UsdCoin,
} from "@/assets/svgs";
import LogoSVG from "@/assets/svgs/logo.svg";
import StarSVG from "@/assets/svgs/star.svg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/hooks/use-user";
import { useCheckValidTime } from "@/hooks/useCheckValidTime";
import { ROUTES } from "@/routes/paths.route";
import { cn } from "@/utils/cn";
import { formatLargeNumber } from "@/utils/utils";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URLSearchParams } from "url";
import { QRScanner } from "../qr-scanner";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import ConnectButton from "./ConnectButton";

const TAB = [
  // {
  //   name: "Mint",
  //   path: "/mint",
  // },
  // {
  //   name: "Mint",
  //   path: "/mint",
  //   icon: Widget,
  //   iconActive: WidgetActive,
  // },
  {
    name: "Home",
    path: ROUTES.DASHBOARD,
    icon: Home,
    iconActive: HomeActive,
  },
  {
    name: "Pay",
    path: ROUTES.PAYMENT_METHOD,
    items: [
      { name: "Gaian Saving", path: "", icon: Capa },
      { name: "Gaian Pay", path: ROUTES.SCAN_QR, icon: Scan },
      { name: "Gaian Card", path: "", icon: Cards },
      { name: "Gaian Zeropay", path: "", icon: UsdCoin },
    ],
    icon: DollarOutline,
    iconActive: DollarActive,
  },
  // {
  //   name: "Reward",
  //   path: "/reward",
  // },
  {
    name: "History",
    path: ROUTES.HISTORY,
    icon: HistoryIcon,
    iconActive: HistoryActiveIcon,
  },
  {
    name: "Referral",
    path: "/referral",
    icon: Profile,
    iconActive: ProfileActive,
  },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScanner, setShowScanner] = useState(false);
  const { user } = useUser();
  const isMobile = useIsMobile();
  const { checkTimeValidity } = useCheckValidTime();

  const handleScan = useCallback(async (data: string | null) => {
    if (data) {
      setShowScanner(false);
      const newQuery = new URLSearchParams({ data }).toString();
      navigate(ROUTES.SCAN_QR + `?${newQuery}`);
    }
  }, []);
  const handleError = useCallback((error: any) => {
    console.error("QR scan error:", error);
    setShowScanner(false);
  }, []);

  const checkTimeScan = async () => {
    try {
      const isValidTime = await checkTimeValidity();
      if (!isValidTime) {
        setShowScanner(false);
        document.getElementById("alert-dialog-scan")?.click();
        return;
      }
    } catch (error) {
      console.log("🚀 ~ handleScanQR ~ error:", error);
    }
  };
  const handleShowSchedule = useCallback(async () => {
    try {
      setShowScanner(false);
      document.getElementById("alert-dialog-scan-pause")?.click();
    } catch (error) {
      console.log("🚀 ~ handleScanQR ~ error:", error);
    }
  }, []);

  const handleScanQR = useCallback(async () => {
    try {
      if (!user) {
        document.getElementById("header-connect")?.click();
        return;
      }
      const buttonScan = document.getElementById("scan-qr-button");
      if (buttonScan) {
        buttonScan.click();
      } else {
        setShowScanner(true);
      }
    } catch (error) {
      console.log("🚀 ~ handleScanQR ~ error:", error);
    }
  }, [user]);

  // useEffect(() => {
  //   // handleShowSchedule();
  //   // if (showScanner) {
  //   //   checkTimeScan();
  //   // }
  // }, []);

  return (
    <div className="relative">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div id="alert-dialog-scan"></div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schedule Notice</AlertDialogTitle>
            <AlertDialogDescription>
              QR payment testing: closes 18:00 GMT+7, opens 08:00 GMT+7. Thank
              you!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Got it</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div id="alert-dialog-scan-pause"></div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schedule Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Gaian is currently undergoing maintenance to improve performance
              and payment speed. Thanks for sticking with us, and we look
              forward to seeing you then!!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Got it</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onError={handleError}
          onClose={() => setShowScanner(false)}
        />
      )}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 h-20 bg-white rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] "
          // !isMobile && "hidden"
        )}
      >
        <div className="container-shape">
          <div className="shape"></div>
        </div>
        <div className="relative w-full h-full grid grid-cols-5">
          <div className="h-16 flex justify-center items-center shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.05)] rounded-full bg-white left-1/2 -translate-x-1/2 aspect-square absolute top-0 -translate-y-1/3">
            <div
              onClick={handleScanQR}
              className="w-14 bg-primary/20 flex items-center justify-center rounded-full aspect-square"
            >
              <div className="w-12 bg-primary rounded-full aspect-square flex items-center justify-center">
                <img src={Scan1} alt="" />
              </div>
            </div>
          </div>
          {TAB.slice(0, 2).map((item) => {
            const isActive =
              item.name === "Home"
                ? location.pathname === "/"
                : location.pathname.includes(item.path);
            return (
              <div
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col gap-1 text-sm text-darkGray/40 items-center justify-center",
                  isActive && "text-dark"
                )}
              >
                <img src={isActive ? item.iconActive : item.icon} alt="" />
                {item.name}
              </div>
            );
          })}
          <div
            className={cn(
              "flex flex-col gap-1 text-sm text-darkGray/40 pb-4 items-center justify-end"
            )}
          >
            Scan
          </div>
          {TAB.slice(-2).map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <div
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col gap-1 text-sm text-darkGray/40 items-center justify-center",
                  isActive && "text-dark"
                )}
              >
                <img
                  src={isActive ? item.iconActive : item.icon}
                  alt=""
                  className="w-6 h-6"
                />
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full bg-white border-b px-2 md:px-4 mx-auto h-[64px] flex items-center justify-between sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-3 items-center w-full h-full">
          <a
            href={ROUTES.DASHBOARD}
            className="flex flex-row space-x-10 items-center"
          >
            <img
              src={LogoSVG}
              className="w-[147.42px] h-[37px] cursor-pointer"
            />
          </a>
          <div className="hidden md:flex flex-row  items-center justify-center gap-[32px] h-full">
            {TAB.map((item) => {
              const isActive =
                item.name === "Home"
                  ? location.pathname === "/"
                  : location.pathname.includes(item.path);

              return (
                <div
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center justify-center  cursor-pointer h-full relative",
                    "min-w-[90px] ",
                    isActive ? "text-black" : ""
                  )}
                >
                  <span
                    className={`text-sm font-semibold  text-center flex justify-center flex-1 ${
                      isActive ? "text-black" : "text-lightGray"
                    }`}
                  >
                    <Menu item={item} />
                  </span>
                  {isActive && (
                    <div className="rounded-t-md absolute bottom-0 h-[3px] bg-[#9FE870] inset-x-0"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row gap-1 justify-end items-center">
            <div className="px-4 max-md:hidden py-2 bg-[#f5fdf1] rounded-full h-9 outline outline-1 outline-offset-[-1px] outline-primary inline-flex justify-center items-center gap-2">
              <img src={StarSVG} alt="" />
              <div className="justify-start text-[#151b11] text-sm font-semibold leading-tight">
                {user?.incomeEarned ? formatLargeNumber(user.incomeEarned) : 0}
              </div>
            </div>
            <div className=" ">
              <ConnectButton />
              {/* <a
                href={`https://phantom.app/ul/browse/${encodeURIComponent(
                  window.location.href
                )}?ref=${encodeURIComponent(window.location.origin)}`}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Mở trong Phantom
              </a>
              <a
                href={`https://solflare.com/ul/browse?url=${encodeURIComponent(
                  window.location.href
                )}`}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                solflare
              </a> */}
            </div>
            {/* <div className="md:hidden">
              <MobileMenu items={TAB} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

const Menu = ({
  item,
}: {
  item: {
    name: string;
    path: string;
    items?: {
      name: string;
      path: string;
      icon: string;
    }[];
  };
}) => {
  const isActive =
    item.name === "Home"
      ? location.pathname === "/"
      : location.pathname.includes(item.path);
  if (!item.items)
    return (
      <span
        className={`text-sm font-semibold text-center flex-1 ${
          isActive ? "text-black" : "text-lightGray"
        }`}
      >
        {item.name}
      </span>
    );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span
              className={`text-sm font-semibold text-center flex-1 ${
                location.pathname.includes(item.path)
                  ? "text-black"
                  : "text-lightGray"
              }`}
            >
              {item.name}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className=" p-3 py-2  flex flex-col w-[200px]">
              {item.items &&
                item.items.map((component) => (
                  <a
                    key={component.name}
                    href={component.path}
                    className="font-normal group flex w-full justify-between hover:bg-black/5 p-2 rounded-md "
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <img src={component.icon} alt="" />
                      {component.name}
                    </div>
                    <img
                      src={Explore}
                      alt=""
                      className="group-hover:block hidden"
                    />
                  </a>
                ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
