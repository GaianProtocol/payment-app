import {
  useClearProfile,
  useFetchProfile,
  useProfile,
} from "@/hooks/useProfile";
import { ACCESS_TOKEN } from "@/utils/constant";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { ReactNode, useEffect, useMemo } from "react";

export default function SignWalletSolProvider({
  children,
}: {
  children: ReactNode;
}) {
  const profile = useProfile();
  const clearProfile = useClearProfile();

  const { getProfile } = useFetchProfile();
  const { wallets } = useSolanaWallets();
  const { user } = usePrivy();
  const wallet = useMemo(
    () => wallets.find((w) => w.address === user?.wallet?.address),
    [wallets, user]
  );

  const isExpired = useMemo(() => {
    if (!profile) return true;
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return true;

    try {
      // Assuming token is a JWT formatted as "header.payload.signature"
      const parts = token.split(".");
      if (parts.length !== 3) {
        // Token is not a valid JWT structure
        console.error("Invalid token format");
        return true;
      }

      // Decode the payload part only
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      return now >= payload.exp;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }, [profile]);

  useEffect(() => {
    if (!wallet && isExpired) {
      clearProfile();
      return;
    }
    if (
      wallet &&
      profile?.publicAddress?.toLowerCase() !==
        wallet.address.toString().toLowerCase() &&
      isExpired
    ) {
      // onSignSolWallet();
      return;
    } else {
      getProfile();
    }
  }, [wallet, profile?.publicAddress, isExpired]);

  return <>{children}</>;
}
