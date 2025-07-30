import { Disconnect, LogoWithoutText, WheelPoint } from "@/assets/svgs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/hooks/use-user";
import authSolApi from "@/services/authSol.service";
import { Option } from "@/types/game.type";
import { AccountTele } from "@/types/spin.type";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

export const LuckyWheelV2: React.FC<{
  onFinished: () => void;
  data: Option[];
  getResult: () => Promise<number | null>;
  checkUsername: (usernameTele: string) => Promise<boolean>;
  disableSpin?: boolean;
}> = ({ onFinished, data, getResult, disableSpin, checkUsername }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paddingRef = useRef<HTMLDivElement>(null);

  const [rotate, setRotate] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [spinFinished, setSpinFinished] = useState(false);
  const [spinSlot, setSpinSlot] = useState(1);
  const animationFrameRef = useRef<number | null>(null);
  const [isExistTelegram, setIsExistTelegram] = useState(true);
  const [accTele, setAccTele] = useState<AccountTele | null>(null);

  const [teleUsername, setTeleUsername] = useState("");
  const isMobile = useIsMobile();

  const { login, user } = useUser();

  const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const smoothRotateWheel = (result: number) => {
    const start = performance.now();
    const duration = 6000;
    const spins = 10;
    const segmentAngle = 360 / data.length;
    const randomAngle = Math.floor(Math.random() * segmentAngle);
    const targetAngle = segmentAngle * result + spins * 360 - randomAngle;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      const currentAngle = easedProgress * targetAngle;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentAngle}deg)`;
        setRotate(currentAngle);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setSpinFinished(true);
        onFinished();
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };
  function removeLeadingAt(text: string): string {
    return text.startsWith("@") ? text.slice(1) : text;
  }

  const spin = useCallback(async () => {
    if (spinning || isLoading) return;

    try {
      setIsLoading(true);
      const spinResult = await getResult();
      console.log("spinResult: ", spinResult);

      if (spinResult !== null) {
        setSpinning(true);
        if (audioRef.current) {
          audioRef.current.playbackRate = 0.75;
          audioRef.current.play();
        }
        smoothRotateWheel(spinResult);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isExistTelegram, spinning]);

  const handleReset = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(0deg)`;
    }
    setRotate(0);
    setSpinFinished(false);
  };
  const handleInputFocus = () => {
    // if (paddingRef.current && isMobile) {
    //   paddingRef.current.style.height = "100px";
    // }
    if (inputRef.current && isMobile) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleInputBlur = () => {
    // if (paddingRef.current && isMobile) {
    //   paddingRef.current.style.height = "0px";
    // }
    if (inputRef.current && isMobile) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleCheckTeleExist = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await authSolApi.checkUserHaveTelegram();
      const isExist = res.status === 1;
      if (isExist) {
        setIsExistTelegram(true);
        setAccTele(res.account);
      } else {
        setIsExistTelegram(false);
        setAccTele(null);
      }
      return isExist;
    } catch (error) {
      console.log(error);
      setIsExistTelegram(false);
      setAccTele(null);
      return false;
    }
  };
  const handleCheckUsername = async (teleUsername: string) => {
    try {
      setIsLoading(true);
      const checkTele = await checkUsername(removeLeadingAt(teleUsername));
      const isExist = await handleCheckTeleExist();

      if (!isExist && checkTele) {
        toast.error(
          "Telegram is used by another user. Please join the alpha group"
        );
        return;
      }
      if (!checkTele) {
        toast.error(
          "Telegram username does not exist. Please join the alpha group"
        );
        return;
      }
      toast.success("Join the alpha group successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectTele = async () => {
    try {
      await authSolApi.disconnectTelegram();
      setIsExistTelegram(false);
      setAccTele(null);
      toast.success("Disconnect Telegram successfully");
      await handleCheckTeleExist();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      handleCheckTeleExist();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-between gap-8">
      <audio ref={audioRef} src="/audio/spin-wheel.mp3" />

      {user && (
        <div className="flex-1 flex items-center justify-center w-full gap-2">
          {!isExistTelegram && (
            <div className="flex flex-col flex-1 items-center justify-center w-full gap-4">
              <Button
                onClick={() => {
                  window.open("https://t.me/+nhhc0rADb-tiNmU1", "_blank");
                }}
                className="bg-primary-darker hover:bg-primary-dark w-full"
              >
                Join Alpha group to spin
              </Button>
              <div className="flex items-center w-full flex-1 h-full gap-4">
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="@username"
                  onChange={(e) => setTeleUsername(e.target.value)}
                  onFocus={() => handleInputFocus()}
                  onBlur={() => handleInputBlur()}
                  className="flex-1 pl-4 pr-2 py-3 h-full bg-[#f5f6f8] border text-sm rounded-xl text-center w-1/2"
                />
                <Button
                  disabled={!teleUsername || isLoading}
                  onClick={() => handleCheckUsername(teleUsername)}
                  className="!bg-primary-darker w-32"
                >
                  {isLoading ? "Checking" : "Check"}
                </Button>
              </div>
            </div>
          )}
          {isExistTelegram && accTele && (
            <div className="flex flex-col items-center flex-1 gap-4">
              <div className="flex w-full justify-center gap-6 flex-wrap">
                <div className="flex font-bold">
                  Join as &nbsp;
                  <span className="text-primary">@{accTele.username}</span>
                </div>
                <div
                  className="text-dark/30 flex items-center gap-1 cursor-pointer"
                  onClick={handleDisconnectTele}
                >
                  <img src={Disconnect} alt="" />
                  Disconnect
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative w-fit h-fit ">
        <div
          id="wheel"
          ref={wheelRef}
          className="w-fit h-fit"
          style={{
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <img
            src="/images/wheel.svg"
            alt="Lucky Wheel"
            className="max-w-[300px] w-full aspect-square border rounded-full outline-none outline-offset-[-2px] outline-black object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <img
            src={WheelPoint}
            alt="Lucky Wheel Pointer"
            className="w-[30px] h-[40px]"
            loading="lazy"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-full p-4 bg-white">
          <img
            src={LogoWithoutText}
            alt="Lucky Wheel Logo"
            className="w-[50px] h-[50px]"
            loading="lazy"
          />
        </div>
      </div>
      {user ? (
        <>
          {isExistTelegram && accTele && (
            <div className="flex flex-col items-center flex-1 gap-4 w-full">
              <Button
                onClick={() => spin()}
                disabled={
                  isLoading || spinning || disableSpin || !isExistTelegram
                }
                className="!bg-primary-darker w-full max-w-[200px] mx-auto"
              >
                {isLoading ? "Verifying" : spinning ? "Spinning" : "Spin Now"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center w-full">
          <Button onClick={() => login()} className="!bg-primary-darker w-full">
            Connect Wallet
          </Button>
        </div>
      )}

      <div id="reset-spin" onClick={handleReset} className="cursor-pointer" />
      {isMobile && <div ref={paddingRef} className=""></div>}
    </div>
  );
};

export default LuckyWheelV2;
