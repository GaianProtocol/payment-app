import { connection } from "@/utils/config";
import { tokenAddresses } from "@/utils/utils";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useUser } from "./use-user";

const network = import.meta.env.VITE_NETWORK || "devnet";

const arrayPublic = {
  'USDC': {
    publicAddress: tokenAddresses[network].usdcMint,
    decimals: 6
  }
};

export default function useTokenBalanceSolV2() {
  const [tokens, setTokens] = useState<Record<string, number>>({});
  const { user, } = useUser();

  const fetchBalance = async () => {
    if (!user) return;

    const balancePromises = Object.entries(arrayPublic).map(async ([tokenName, mintAddress]) => {
      try {
        const mint = new PublicKey(mintAddress.publicAddress);
        const ata = getAssociatedTokenAddressSync(mint, new PublicKey(user.privyUser.wallet?.address!), false);

        const account = await getAccount(connection, ata);
        const balance = Number(account.amount) / 10 ** mintAddress.decimals; // Convert BigInt to number
        return { tokenName, balance };
      } catch (error) {
        if (error instanceof Error && error.name === "TokenAccountNotFoundError") {
          // console.log(`ATA for ${tokenName} not found. Balance is 0.`);
          return { tokenName, balance: 0 };
        } else {
          // console.error(`Error fetching balance for ${tokenName}:`, error);
          return { tokenName, balance: 0 };
        }
      }
    });

    const balances = await Promise.all(balancePromises);
    const newTokens = balances.reduce((acc, { tokenName, balance }) => {
      acc[tokenName] = balance;
      return acc;
    }, {} as Record<string, number>);

    setTokens(newTokens);
  };

  useEffect(() => {
    if (!user || !connection) {
      setTokens({});
      return
    };

    fetchBalance();
    const intervalId = setInterval(() => {
      fetchBalance();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user, connection]);

  return { tokens };
}