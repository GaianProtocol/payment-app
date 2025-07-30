import { useWallet } from "@solana/wallet-adapter-react";
import {
  BitgetWalletName,
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";

const WalletType = BitgetWalletName || PhantomWalletName || SolflareWalletName;

export default function ConnectWalletModal() {
  const { select, connect } = useWallet();
  const onConnect = (name: typeof WalletType) => {
    select(name);
    connect();
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col gap-3">
        {[PhantomWalletName, SolflareWalletName, BitgetWalletName].map(
          (name) => (
            <button
              key={name}
              onClick={() => onConnect(name as typeof WalletType)}
              className="w-full h-10 flex gap-3 items-center rounded-xl bg-neutral-600 text-white px-6"
            >
              {name}
            </button>
          )
        )}
      </div>
    </div>
  );
}
