import giftAnimation from "@/assets/images/gift.json";
import rewardAnimation from "@/assets/images/reward.json";
import sadAnimation from "@/assets/images/sad.json";
import Fireworks from "@/components/Fireworks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LuckyWheelV2 from "@/components/Wheel";
import { useUser } from "@/hooks/use-user";
import { ROUTES } from "@/routes/paths.route";
import spinService from "@/services/spin.service";
import { Option } from "@/types/game.type";
import { SpinResponse } from "@/types/spin.type";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT, USER_ITEM_TYPE } from "@/utils/constant";
import Lottie from "lottie-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const data: Option[] = [
  {
    option: USER_ITEM_TYPE.VOUCHER_100,
    description: "99K Voucher Highland Coffee",
    style: { backgroundColor: "#634FD4", textColor: "white" },
    value: 10,
  },
  {
    option: "",
    style: { backgroundColor: "#197EF4", textColor: "black" },
    value: 9,
  },
  {
    option: USER_ITEM_TYPE.VOUCHER_20,
    style: { backgroundColor: "#634FD4", textColor: "white" },
    value: 8,
    description: "20K Voucher Highland Coffee",
  },
  {
    option: "",
    style: { backgroundColor: "#197EF4", textColor: "black" },
    value: 7,
  },
  {
    option: USER_ITEM_TYPE.VOUCHER_20,
    style: { backgroundColor: "#634FD4", textColor: "white" },
    description: "20K Voucher Highland Coffee",
    value: 6,
  },
  {
    option: "",
    style: { backgroundColor: "#197EF4", textColor: "black" },
    value: 5,
  },
  {
    option: USER_ITEM_TYPE.VOUCHER_50,
    style: { backgroundColor: "#634FD4", textColor: "white" },
    description: "50K Voucher Highland Coffee",
    value: 4,
  },
  {
    option: "",
    style: { backgroundColor: "#634FD4", textColor: "white" },
    value: 3,
  },
  {
    option: USER_ITEM_TYPE.VOUCHER_50,
    style: { backgroundColor: "#634FD4", textColor: "white" },
    description: "50K Voucher Highland Coffee",
    value: 2,
  },
  {
    option: USER_ITEM_TYPE.VOUCHER_20,
    style: { backgroundColor: "#197EF4", textColor: "black" },
    description: "20K Voucher Highland Coffee",
    value: 1,
  },
];

interface Countdown {
  seconds: number;
  isActive: boolean;
}

export const SpinComponent = () => {
  const [reward, setReward] = useState<Option | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [open, setOpen] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({
    seconds: 0,
    isActive: false,
  });

  const { user } = useUser();
  const navigate = useNavigate();

  const checkUsername = useCallback(
    async (usernameTele: string) => {
      if (!user) return false;
      return await spinService.checkTelegram(usernameTele);
    },
    [user]
  );

  const handleSpin = useCallback(async (): Promise<number | null> => {
    if (!user) return null;
    setIsLoading(true);
    try {
      const response: SpinResponse = await spinService.spinGame(user.id);
      if (!response.rewards) {
        setReward(null);
        setCanSpin(false);
        toast.error("Do reach limit daily!");
        return null;
      }
      const rewardIndex = response.rewards.index;
      if (!rewardIndex) {
        setReward(null);
        setCanSpin(false);
        return null;
      }
      const selectedReward =
        data.find((item) => item.value === rewardIndex) || null;
      setReward(selectedReward);
      return data.findIndex((item) => item.value === rewardIndex) + 1;
    } catch (err) {
      setError("Failed to spin");
      setReward(null);
      setCanSpin(false);
      return null;
    } finally {
      setIsLoading(false);
      await checkAvailability();
    }
  }, [user, canSpin]);

  const handleFirework = useCallback(() => {
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 5000);
  }, []);

  const checkAvailability = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await spinService.checkSpinTimer(user.id);
      const canSpin = typeof response.diff === "number" && response.diff <= 0;

      setCanSpin(canSpin);
      if (response.diff > 0) {
        setCountdown({ seconds: response.diff, isActive: true });
      } else {
        setCountdown({ seconds: 0, isActive: false });
      }
    } catch (err) {
      setError("Failed to check spin availability");
      setCanSpin(false);
      setCountdown({ seconds: 0, isActive: false });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    checkAvailability();
  }, [user, checkAvailability]);

  useEffect(() => {
    if (!countdown.isActive || countdown.seconds <= 0) return;

    const timerId = setInterval(() => {
      setCountdown((prev) => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds <= 0) {
          checkAvailability();
          return { seconds: 0, isActive: false };
        }
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [countdown, checkAvailability]);

  useEffect(() => {
    if (!open) {
      setShowFireworks(false);
    } else if (open && !!reward?.option) {
      handleFirework();
    }
  }, [open, reward, handleFirework]);

  const formatCountdown = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "bg-transparent max-w-[674px] !h-max w-full flex mx-auto flex-col gap-4 px-2.5 md:px-[30px] pt-2 pb-10"
      )}
      style={{
        minHeight: `calc(100svh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
      }}
    >
      <div className="self-stretch inline-flex flex-col justify-start items-center gap-8">
        <div className="self-stretch flex flex-col justify-start items-center gap-1 md:gap-3">
          <div className="w-full justify-end mb-4 md:flex hidden">
            <Button
              onClick={() => navigate(ROUTES.SPIN_REWARDS)}
              variant={"outline"}
              className="flex items-center gap-2 px-3 py-2 text-sm"
            >
              <div className="relative w-6 h-6">
                <Lottie animationData={rewardAnimation} />
              </div>
              Your Reward
            </Button>
          </div>
          {/* <div className="w-16 h-16 relative overflow-hidden">
            <img src={SpinWheel} className="w-full h-full" alt="Spin Wheel" />
          </div> */}
          <div className="self-stretch text-center max-md:my-4 font-sf-compact text-[#151b11] text-3xl font-bold flex items-center md:justify-center justify-between">
            LUCKY GAME
            <Button
              onClick={() => navigate(ROUTES.SPIN_REWARDS)}
              variant={"outline"}
              className="flex items-center gap-2 px-3 py-2 text-sm md:hidden"
            >
              <div className="relative w-6 h-6">
                <Lottie animationData={rewardAnimation} />
              </div>
              Your Reward
            </Button>
          </div>
          {isLoading ? (
            <div className="text-[#151b11] text-base font-medium">
              Checking availability...
            </div>
          ) : canSpin ? (
            <div className="self-stretch text-center">
              <span className="text-[#151b11] text-base font-medium">
                You have{" "}
              </span>
              <span className="text-[#07a22c] text-base font-medium">
                1 free spin{" "}
              </span>
              <span className="text-[#151b11] text-base font-medium">
                today!
              </span>
            </div>
          ) : (
            <div className="self-stretch text-center">
              <span className="text-[#151b11] text-base font-medium">
                Next spin available in{" "}
              </span>
              <span className="text-[#07a22c] text-base font-medium">
                {formatCountdown(countdown.seconds)}
              </span>
            </div>
          )}
          {/* {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )} */}
        </div>
        <LuckyWheelV2
          data={data}
          onFinished={() => setOpen(true)}
          disableSpin={!canSpin || isLoading}
          getResult={handleSpin}
          checkUsername={checkUsername}
        />
      </div>
      <Dialog open={reward !== null && open} onOpenChange={setOpen}>
        {reward?.option ? (
          <DialogContent className="sm:max-w-[425px] py-10 border-none bg-gradient-to-b from-[#E1F8D3] to-[#ffffff] outline-none">
            <DialogTitle className="sr-only">Congratulations</DialogTitle>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-[#151b11]">
                  Congratulation!
                </div>
                <div className="text-center text-sm font-normal leading-tight text-[#57803e]">
                  <span className="text-dark">You won </span>
                  {reward?.description}
                </div>
                <div className="relative w-32 h-32 mt-6 -translate-y-8">
                  <Lottie animationData={giftAnimation} loop={false} />
                </div>
              </div>
            </div>
            <Button
              className="bg-primary-darker hover:bg-primary-dark"
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.SPIN_REWARDS);
              }}
            >
              Claim Reward
            </Button>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[425px] py-10 border-none bg-gradient-to-b from-[#80808079] via-transparent to-[#ffffff] outline-none">
            <DialogTitle className="sr-only">No Reward</DialogTitle>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-[#151b11]">
                  Oops! Not your day
                </div>
                <div className="text-center text-sm font-normal leading-tight text-dark">
                  So close. Try again tomorrow.
                </div>
                <div className="relative w-32 h-32 mt-6 -translate-y-8">
                  <Lottie animationData={sadAnimation} loop={true} />
                </div>
              </div>
            </div>
            <Button
              className="bg-primary-darker hover:bg-primary-dark"
              onClick={() => setOpen(false)}
            >
              Back To Home
            </Button>
          </DialogContent>
        )}
      </Dialog>
      {showFireworks && <Fireworks />}
    </div>
  );
};
