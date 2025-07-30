import { connection } from "@/utils/config";
import { tokenAddresses } from "@/utils/utils";
import { usePrivy } from "@privy-io/react-auth";
import {
  getAccount,
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

const network = import.meta.env.VITE_NETWORK || "devnet";

export default function useTokenGUSDInfo() {
  const [tokens, setTokens] = useState({
    totalMinted: 0,
    tvl: 0,
    balance: 0,
    decimals: 6,
  });
  const { user } = usePrivy();

  const fetchTokenInfo = async () => {
    try {
      const mint = new PublicKey(tokenAddresses[network].gusdMint);

      const mintInfo = await getMint(
        connection,
        mint, // Mint Account Address
        undefined, // Optional commitment
        TOKEN_2022_PROGRAM_ID // Token Extension Program ID
      );

      if (mintInfo) {
        setTokens({
          totalMinted: Number(mintInfo.supply) / 10 ** mintInfo.decimals || 0,
          tvl: 0,
          balance: 0,
          decimals: mintInfo.decimals,
        });
      }
    } catch (error) {
      console.log("🚀 ~ fetchToken ~ error:", error);
    }
  };

  const fetchBalance = async () => {
    if (!user) return;
    try {
      const mint = new PublicKey(tokenAddresses[network].gusdMint);
      const ata = getAssociatedTokenAddressSync(
        mint,
        new PublicKey(user.wallet?.address!),
        false,
        TOKEN_2022_PROGRAM_ID
      );
      let balance: bigint = BigInt(0);

      try {
        const account = await getAccount(
          connection,
          ata,
          undefined,
          TOKEN_2022_PROGRAM_ID
        );
        balance = account.amount;
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "TokenAccountNotFoundError"
        ) {
          console.log("ATA does not exist yet.");
        } else {
          console.error("Error fetching ATA:", error);
        }
      }

      setTokens((prevTokens) => ({
        ...prevTokens,
        balance: Number(balance) / 10 ** prevTokens.decimals,
      }));
    } catch (error) {
      console.error("Failed to fetch gUSD info:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
      const intervalId = setInterval(fetchBalance, 10000);
      return () => clearInterval(intervalId);
    } else {
      setTokens((prevTokens) => ({
        ...prevTokens,
        balance: 0,
      }));
    }
  }, [user]);
  useEffect(() => {
    fetchTokenInfo();
    const interval = setInterval(fetchTokenInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  return { tokens };
}
