import { connection } from "@/utils/config";
import { usePrivy } from "@privy-io/react-auth";
import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from "react";
export default function useSolBalance() {
  const [balance, setBalance] = useState(0);
  const { user } = usePrivy();

  const fetchBalance = useCallback(async () => {
    if (!user || !user.wallet?.address) return;
    try {
      const balance = await connection.getBalance(new PublicKey(user.wallet?.address!));
      setBalance(balance / 1000000000); // Convert from lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [user, connection]);
  useEffect(() => {
    if (user) {
      fetchBalance();
      const intervalId = setInterval(() => {
        fetchBalance();
      }, 10_000);
      return () => clearInterval(intervalId);
    } else {
      setBalance(0);
    }
  }, [user, connection]);

  return { balance, fetchBalance };
}
