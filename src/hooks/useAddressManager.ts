import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export enum ConnectType {
  SOLANA = "SOLANA",
  EVM = "EVM",
  NONE = "NONE",
}

export default function useAddressManager() {
  const { publicKey } = useWallet();
  const { address: addressEVM } = useAccount();

  const address = useMemo(
    () => publicKey?.toString() || addressEVM?.toString(),
    [publicKey, addressEVM]
  );

  const connectType = useMemo(() => {
    if (publicKey) {
      return ConnectType.SOLANA;
    }
    if (address) {
      return ConnectType.EVM;
    }
    return ConnectType.NONE;
  }, [publicKey, addressEVM]);

  return { address, connectType };
}
