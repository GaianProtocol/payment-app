import { ChainId } from "@/utils/ChainId";
import { publicClient } from "@/utils/viem";
import { useEffect, useState } from "react";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";

export default function useBalaceErc20(tokenAddress: `0x${string}`) {
  const { address } = useAccount();
  const [token, setToken] = useState({
    balance: 0n,
    symbol: "",
    decimals: 0,
  });
  useEffect(() => {
    if (!tokenAddress || !address) return;
    (async () => {
      const client = publicClient({
        chainId: ChainId.SEPOLIA,
      });
      try {
        const [{ result: balance }, { result: symbol }, { result: decimals }] =
          await client.multicall({
            contracts: [
              {
                abi: erc20Abi,
                address: tokenAddress,
                functionName: "balanceOf",
                args: [address],
              },
              {
                abi: erc20Abi,
                address: tokenAddress,
                functionName: "symbol",
                args: [],
              },
              {
                abi: erc20Abi,
                address: tokenAddress,
                functionName: "decimals",
                args: [],
              },
            ],
          });
        setToken({
          balance: balance || 0n,
          symbol: symbol || "",
          decimals: decimals || 0,
        });
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, [tokenAddress]);
  return {
    ...token,
  };
}
