import { tokensProgram } from "@/configs/buyToken";
import { useTokenSuffix } from "@/store/tokenStore";
import { connection } from "@/utils/config";
import { NETWORK } from "@/utils/constant";
import { usePrivy } from "@privy-io/react-auth";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

export default function useTokenBalanceSol() {
  const [tokens, setTokens] = useState<Record<string, number>>({});
  const { user } = usePrivy();
  const tokenSuffix = useTokenSuffix();
  const fetchBalance = useCallback(async () => {

    if (!user) return;
    const ownerPublicKey = new PublicKey(user.wallet?.address!);
    if (!tokensProgram[NETWORK]) {
      console.log("Not found contract");
      return;
    }
    const tokenMints = Object.values(tokenSuffix).map((e) => e);

    try {
      // Fetch all token accounts by owner
      const parsedTokens = await connection.getParsedTokenAccountsByOwner(
        ownerPublicKey,
        {
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        }
      );

      const tokenBalances: Record<string, number> = {};

      // Filter and process tokens
      parsedTokens.value.forEach(({ account }: any) => {
        const mintAddress = account.data.parsed.info.mint.toLowerCase();
        const mintAddressRaw = account.data.parsed.info.mint;

        const tokenAmount = account.data.parsed.info.tokenAmount;
        if (tokenMints.includes(mintAddress)) {
          tokenBalances[mintAddress] =
            tokenAmount.amount / 10 ** tokenAmount.decimals;
        }
        if (tokenMints.includes(mintAddressRaw)) {
          tokenBalances[mintAddressRaw] =
            tokenAmount.amount / 10 ** tokenAmount.decimals;
        }
      });

      setTokens(tokenBalances);
    } catch (err) {
      console.error("Failed to fetch token balances", err);
    }
  }, [user, tokenSuffix]);

  const resetBalance = () => {
    setTokens({});
  };

  useEffect(() => {
    if (!user) {
      resetBalance();
      return;
    }
    if (!tokenSuffix.usdc || !tokenSuffix.usdstar) return;

    fetchBalance();

    const intervalId = setInterval(() => {
      fetchBalance();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [user, tokenSuffix]);

  return { tokens, fetchBalance };
}
