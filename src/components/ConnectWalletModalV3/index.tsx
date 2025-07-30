import { LogoWithoutText } from "@/assets/svgs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalletName } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import {
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { Button } from "../ui/button";

type WalletConfig = {
  name: WalletName<string>;
  icon: string;
  installUrl: string;
  userAgentPattern: RegExp;
  getUniversalLink: (currentUrl: string, origin: string) => string;
};

const defaultWallets: WalletConfig[] = [
  {
    name: PhantomWalletName,
    icon: new PhantomWalletAdapter().icon,
    installUrl: "https://phantom.app/",
    userAgentPattern: /Phantom/i,
    getUniversalLink: (currentUrl, origin) =>
      `https://phantom.app/ul/browse/${encodeURIComponent(
        currentUrl
      )}?ref=${encodeURIComponent(origin)}`,
  },
  {
    name: SolflareWalletName,
    icon: new SolflareWalletAdapter().icon,
    installUrl: "https://solflare.com/",
    userAgentPattern: /Solflare/i,
    getUniversalLink: (currentUrl, origin) =>
      `https://solflare.com/ul/v1/browse/${encodeURIComponent(
        currentUrl
      )}?ref=${encodeURIComponent(origin)}`,
  },
];

const WalletButton = ({
  name,
  icon,
  isInstalled,
  onClick,
}: {
  name: string;
  icon: string;
  isInstalled: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-start gap-4 self-stretch rounded-xl bg-[#f5f6f8] px-4 py-3 transition-colors hover:bg-[#e8e9eb]"
  >
    <div className="flex flex-1 items-center gap-2">
      <img src={icon} alt={`${name} icon`} className="h-6 w-6 object-contain" />
      <div className="text-center text-base font-semibold text-[#191a1b]">
        {name}
      </div>
    </div>
    {isInstalled && (
      <div className="rounded-md bg-[#d3f4bd] px-2 py-1">
        <div className="text-center text-xs font-semibold leading-none text-[#07a22c]">
          INSTALLED
        </div>
      </div>
    )}
  </button>
);

export default function ConnectWalletModalV3() {
  const { select, connect, wallets: availableWallets } = useWallet();
  const isMobile = useIsMobile();
  const isIOS = useMemo(
    () =>
      isMobile &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream,
    [isMobile]
  );

  const isBrowserInApp = useMemo(() => {
    const userAgent = navigator.userAgent;
    if (isMobile && /Phantom|Solflare/i.test(userAgent)) {
      return true;
    }
    return false;
  }, [isMobile]);
  const installedWallets = useMemo(
    () =>
      new Set(
        availableWallets
          .filter((wallet) => wallet.readyState === "Installed")
          .map((wallet) => wallet.adapter.name)
      ),
    [availableWallets]
  );

  const handleWalletClick = (
    name: WalletName<string>,
    installUrl: string,
    userAgentPattern: RegExp,
    getUniversalLink: (currentUrl: string, origin: string) => string
  ) => {
    const userAgent = navigator.userAgent;
    if (isMobile && !userAgentPattern.test(userAgent)) {
      const currentUrl = window.location.href;
      const origin = window.location.origin;
      window.open(
        getUniversalLink(currentUrl, origin),
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    const wallet = availableWallets.find((w) => w.adapter.name === name);

    if (wallet?.readyState === "Installed") {
      select(name);
      connect().catch((err) => console.error("Connection failed:", err));
    } else {
      window.open(installUrl, "_blank", "noopener,noreferrer");
    }
  };

  const displayedWallets = useMemo(() => {
    return isMobile
      ? defaultWallets.map((wallet) => ({
          name: wallet.name,
          icon: wallet.icon,
          isInstalled: installedWallets.has(wallet.name),
          onClick: () =>
            handleWalletClick(
              wallet.name,
              wallet.installUrl,
              wallet.userAgentPattern,
              wallet.getUniversalLink
            ),
        }))
      : availableWallets
          // .filter(
          //   (w) =>
          //     !isMobile ||
          //     w.adapter.name === "Mobile Wallet Adapter" ||
          //     isBrowserInApp
          // )
          .map((wallet) => ({
            name: wallet.adapter.name,
            icon: wallet.adapter.icon,
            isInstalled: wallet.readyState === "Installed",
            onClick: async () => {
              try {
                if (wallet.readyState === "Installed") {
                  select(wallet.adapter.name);
                  await connect();
                } else {
                  window.open(
                    wallet.adapter.url,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              } catch (err) {
                console.error("Connection failed:", err);
              }
            },
          })) || [];
  }, [isIOS, installedWallets, isMobile, availableWallets]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          id="header-connect"
          className="h-9 rounded-full bg-black px-4 hover:bg-black/70"
        >
          Login now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none bg-gradient-to-b from-[#E1F8D3] to-[#ffffff] outline-none">
        <DialogHeader>
          <div className="flex flex-col items-center gap-2">
            <img src={LogoWithoutText} alt="GAIAN Logo" className="h-12 w-12" />
            <div className="flex flex-col items-center gap-1">
              <div className="text-xl font-semibold text-[#151b11]">
                Welcome to GAIAN
              </div>
              <div className="text-center text-sm font-normal leading-tight text-[#57803e]">
                Login with Connect Your Solana Wallet!
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
          {displayedWallets.map((wallet) => (
            <WalletButton
              key={wallet.name}
              name={wallet.name}
              icon={wallet.icon}
              isInstalled={wallet.isInstalled}
              onClick={wallet.onClick}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
