import { AddToScreen, ShareIOS } from "@/assets/svgs";
import LogoSVG from "@/assets/svgs/logo.svg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

function InstallProvider({ children }: { children: any }) {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const isMobile = useIsMobile();
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isInAppBrowser = /Phantom/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (isInAppBrowser) {
      return;
    }

    if (!isIOSDevice) {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    } else {
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setShowIOSPrompt(true);
      }
    }
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      const promptEvent = installPrompt as BeforeInstallPromptEvent;
      promptEvent.prompt();

      promptEvent.userChoice.then(
        (choiceResult: { outcome: "accepted" | "dismissed" }) => {
          if (choiceResult.outcome === "accepted") {
            console.log("Users accepted the A2HS prompt");
          } else {
            console.log("Users dismissed the A2HS prompt");
          }
          setInstallPrompt(null);
        }
      );
    }
  };
  const handleIOSInstallClick = () => {
    setShowIOSPrompt(false);
  };

  return (
    <>
      {/* AlertDialog for non-iOS devices */}
      <AlertDialog open={!!installPrompt && isMobile}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex flex-col items-start gap-2 text-start">
              <img
                src={LogoSVG}
                className="h-[37px] cursor-pointer text-start"
              />
              Add Gaian Network to your home screen for a seamless experience!
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-end gap-2">
            <AlertDialogCancel
              className="h-12 mt-0"
              onClick={() => setInstallPrompt(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleInstallClick}
              className="text-dark h-12"
            >
              Install
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* AlertDialog for iOS devices */}
      <AlertDialog open={showIOSPrompt && isMobile && isIOS}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex flex-col items-start gap-2 text-start">
              <img
                src={LogoSVG}
                className="h-[37px] cursor-pointer text-start"
              />
              To install this app, tap the share icon and select 'Add to Home
              Screen'.
            </div>
            <div className="flex items-center gap-2">
              1. Tap on <img src={ShareIOS} alt="" className="h-12" />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              2. Select <img src={AddToScreen} alt="" className="h-14" />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-end gap-2">
            <AlertDialogAction
              onClick={handleIOSInstallClick}
              className="text-dark h-12"
            >
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </>
  );
}

export default InstallProvider;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
