import WalletConnectorIcon from "@/assets/icons/WalletConnectorIcon";
import { useCloseModal } from "@/hooks/useModal";
import { cn } from "@/utils/cn";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useEffect, useState } from "react";
import {
  Connector,
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
} from "wagmi";

function ConnectorButton({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const accessList = [
    "MetaMask",
    "Brave Wallet",
    "Safe",
    "WalletConnect",
    // "Phantom",
    "Trust Wallet",
    "OKX Wallet",
  ];
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);
  if (!accessList.includes(connector.name)) {
    return <></>;
  }

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 disabled:bg-[#8f8f8f] disabled:cursor-not-allowed disabled:px-4 disabled:py-2 disabled:rounded-md",
        "w-full bg-[#fff] hover:bg-neutral-100 rounded-xl px-6"
      )}
      type="button"
    >
      {connector.name === "WalletConnect" ? (
        <div className="p-2 relative overflow-hidden rounded-full">
          <WalletConnectorIcon className="w-8 h-8" />
        </div>
      ) : connector.icon ? (
        <div className="p-2 relative overflow-hidden rounded-full">
          <img className="w-[32px] h-[32px] relative" src={connector.icon} />
        </div>
      ) : (
        <div className="p-2 relative overflow-hidden rounded-full">
          <img
            className="w-[32px] h-[32px] relative"
            src={
              "https://lh3.googleusercontent.com/QW0gZ3yugzXDvTANa5-cc1EpabQ2MGnl6enW11O6kIerEaBQGOhgyUOvhRedndD9io8RJMmJZfIXq1rMxUsFHS2Ttw=s60"
            }
          />
        </div>
      )}
      {connector.name}
    </button>
  );
}

export default function ConnectWalletModalV2() {
  const { connectors: rootConnectors, connectAsync } = useConnect();
  const closeModal = useCloseModal();
  const { address } = useAccount();
  const chainId = useChainId();
  const { connect, select, disconnect } = useWallet();
  const { disconnect: disconnectEVM } = useDisconnect();
  const connectSolWallet = () => {
    try {
      disconnectEVM();
    } catch (error) {}
    select(PhantomWalletName);
    connect();
  };

  const handleConnectAndSign = async (connector: Connector) => {
    try {
      disconnect();
    } catch (error) {}
    if (connector.name === "WalletConnect") {
      closeModal();
    }
    const data = await connectAsync({ connector, chainId });
    console.log("🚀 ~ handleConnectAndSign ~ data:", data);
    // if (data) {
    //   if (data.chainId !== chainActive && chainActive) {
    //     await switchChainAsync({
    //       chainId: chainActive,
    //     });
    //   }
    // }
  };
  const connectors = rootConnectors.filter(
    (v, i, a) => a.findIndex((v2) => v2.name === v.name) === i
  );

  useEffect(() => {
    if (address) {
      closeModal();
    }
  }, [address]);
  return (
    <div className="mt-3 flex gap-4 flex-col">
      {connectors.map((connector) => (
        <ConnectorButton
          key={connector.uid}
          connector={connector}
          onClick={() => handleConnectAndSign(connector)}
        />
      ))}
      {/* <button
        onClick={connectSolWallet}
        className={cn(
          "flex items-center gap-4 disabled:bg-[#8f8f8f] disabled:cursor-not-allowed disabled:px-4 disabled:py-2 disabled:rounded-md",
          "w-full bg-[#fff] hover:bg-neutral-100 rounded-xl px-6"
        )}
        type="button"
      >
        <div className="p-2 relative overflow-hidden rounded-full">
          <img className="w-[32px] h-[32px] relative" src={SolanaIcon} />
        </div>
        <span>Solana</span>
      </button> */}
    </div>
  );
}
