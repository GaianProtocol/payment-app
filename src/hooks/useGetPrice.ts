import { useEffect, useState } from "react";

export default function useGetPrice({
  symbol = "SOL",
  syms = ["USD"],
}: {
  symbol?: string;
  syms?: string[];
}) {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPrice = async (currentSymbol: string) => {
    try {
      setLoading(true);
      const data = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${currentSymbol}&tsyms=${syms.join(",")}`
      ).then((res) => res.json());
      setPrice(data["USD"]);
    } catch (error) {
      console.log("🚀 ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(symbol);
    const intervalId = setInterval(() => {
      fetchPrice(symbol);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [symbol, syms.join(',')]);

  return { price, loading, fetchPrice };
}