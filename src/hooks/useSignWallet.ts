import authSolApi from "@/services/authSol.service";
import { ACCESS_TOKEN } from "@/utils/constant";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import base58 from "bs58";
import { useMemo } from "react";
import { useFetchProfile } from "./useProfile";

export default function useSignWallet() {
  const { wallets } = useSolanaWallets();
  const { user } = usePrivy();
  const wallet = useMemo(
    () => wallets.find((w) => w.address === user?.wallet?.address),
    [wallets, user]
  );
  const { getProfile } = useFetchProfile();

  const onSignSolWallet = async () => {
    if (!wallet) return;
    const addressPubkey = wallet.address.toString();
    const result = await authSolApi.requestNonce(addressPubkey);
    const { nonce, publicAddress } = result as any;

    const msg = new TextEncoder().encode(`${nonce}`);
    const res = await wallet.signMessage(msg);
    const bytes = Uint8Array.from(res);
    const messageSignedBase58 = base58.encode(bytes);
    const data = await authSolApi.login(publicAddress, messageSignedBase58, nonce, {});

    if (data.token) {
      localStorage.setItem(ACCESS_TOKEN, data.token);
      await getProfile();
    } else {
      // TODO display error
    }
  };
  return { onSignSolWallet };
}
