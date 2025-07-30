import {
  ArrowRight,
  gUSD,
  PaypalIcon,
  StarContainer,
  Usdc,
  USDS,
  Usdt,
} from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import { connection, owner } from "@/utils/config";
import { tokenAddresses } from "@/utils/utils";
import { usePrivy } from "@privy-io/react-auth";
import {
  amountToUiAmount,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import TokenBoxPrimary from "./TokenBoxPrimary";

type ITokenOption = {
  name: string;
  balance: string;
  icon: any;
  symbol: string;
};

interface TokenInfo {
  mint: PublicKey;
  ata?: PublicKey;
  balance?: number;
}

const network = import.meta.env.VITE_NETWORK || "devnet";

const tokensDropdown: ITokenOption[] = [
  { name: "USDC", balance: "", icon: Usdc, symbol: "USDC" },
  { name: "USDT", balance: "", icon: Usdt, symbol: "USDT" },
  { name: "USDS", balance: "", icon: USDS, symbol: "USDS" },
  { name: "PYUSD", balance: "", icon: PaypalIcon, symbol: "PYUSD" },
];
export const Withdraw = () => {
  const [tokenSelected, setTokenSelected] = useState<ITokenOption>(
    tokensDropdown[0]
  );
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [rateGUSD, setRateGUSD] = useState<number>(1);
  const { user } = usePrivy();
  const textToShow = useMemo(() => {
    if (errorMsg) return errorMsg;
    if (loading) return "Withdrawing...";
    return "Withdraw " + tokenSelected.name;
  }, [errorMsg, valueInput, loading, tokenSelected]);

  const fetchToken = useCallback(async () => {
    if (!user) {
      setTokenInfo(null);
      return;
    }

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

      setTokenInfo({
        mint,
        ata,
        balance: Number(balance) / 1e6,
      });
    } catch (error) {
      console.error("Failed to fetch gUSD info:", error);
      setTokenInfo(null);
    }
  }, [user]);

  const fetchGUSDRate = useCallback(async () => {
    try {
      const mint = new PublicKey(tokenAddresses[network].gusdMint);
      const amount = BigInt(1e6); // 1 gUSD in lamports
      const uiAmount = await amountToUiAmount(
        connection,
        owner,
        mint,
        amount,
        TOKEN_2022_PROGRAM_ID
      );
      setRateGUSD(Number(uiAmount));
    } catch (error) {
      console.error("Error fetching gUSD rate:", error);
      setRateGUSD(1); // Fallback to 1 if fetch fails
    }
  }, []);

  // const handleRedeem = useCallback(
  //   async (amount: string) => {
  //     if (!publicKey || !sendTransaction) return;

  //     try {
  //       setLoading(true);
  //       const provider = new AnchorProvider(
  //         connection,
  //         { publicKey, sendTransaction } as any,
  //         {
  //           preflightCommitment: "processed",
  //         }
  //       );
  //       const program = new Program(idl as GaianStablecoin, provider);

  //       const signerUsdcAta = getAssociatedTokenAddressSync(
  //         tokenAddresses[network].usdcMint,
  //         publicKey,
  //         false
  //       );
  //       const signerGusdAta = getAssociatedTokenAddressSync(
  //         tokenAddresses[network].gusdMint,
  //         publicKey,
  //         false,
  //         TOKEN_2022_PROGRAM_ID
  //       );
  //       const [pda] = PublicKey.findProgramAddressSync(
  //         [Buffer.from("gaian"), tokenAddresses[network].usdcMint.toBuffer()],
  //         program.programId
  //       );

  //       const amountSend = new BN(Number(amount) * 1e6);
  //       const ix = await program.methods
  //         .redeem(amountSend)
  //         .accountsPartial({
  //           usdcMint: tokenAddresses[network].usdcMint,
  //           signerUsdcAta,
  //           gusdMint: tokenAddresses[network].gusdMint,
  //           signerGusdAta,
  //           gaian: pda,
  //         })
  //         .instruction();

  //       const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  //         microLamports: 100_000,
  //       });
  //       const transaction = new Transaction().add(addPriorityFee).add(ix);

  //       const signature = await sendTransaction(transaction, connection, {
  //         preflightCommitment: "processed",
  //       });
  //       await connection.confirmTransaction(signature, "processed");
  //       toast.success("Withdrawal successful!");
  //       await fetchToken();
  //     } catch (error) {
  //       console.error("Withdrawal failed:", error);
  //       toast.error("Withdrawal failed. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [publicKey, sendTransaction, fetchToken]
  // );

  const handleChangeValueSwap = (valueToken: string) => {
    setValueInput(valueToken);
  };

  const handleTokenSelectChange = async (name: string) => {
    const token = tokensDropdown.find((t) => t.name === name);
    if (token) {
      setTokenSelected(token);
      // await fetchPrice(token.symbol);
      setValueInput("");
    }
  };

  useEffect(() => {
    if (user) {
      fetchToken();
      fetchGUSDRate();
      const interval = setInterval(fetchGUSDRate, 60000);
      return () => clearInterval(interval);
    } else {
      setTokenInfo(null);
      setValueInput("");
      setErrorMsg("");
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center gap-4 overflow-hidden">
      <div className="relative flex flex-col gap-1 w-full">
        {/* Deposit Form */}
        <div className="w-full p-5 bg-[#f6fdf2] relative rounded-2xl inline-flex flex-col justify-center items-start gap-2 overflow-hidden">
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="justify-start text-[#151b11] text-sm font-medium leading-tight">
              Total gUSD Balance
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="text-right justify-start text-[#151b11] text-xl font-semibold">
                {tokenInfo?.balance?.toLocaleString("en-US", {
                  maximumFractionDigits: 4,
                  minimumFractionDigits: 0,
                }) || "0"}
              </div>
              <div className="w-6 h-6 relative overflow-hidden">
                <img src={gUSD} alt="" />
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="text-right justify-start text-[#a7acae] text-sm font-medium leading-tight">
                $
                {tokenInfo?.balance?.toLocaleString("en-US", {
                  maximumFractionDigits: 4,
                  minimumFractionDigits: 0,
                }) || "0"}
              </div>
            </div>
          </div>
          <img src={StarContainer} className="absolute right-10" alt="" />
        </div>
        <div className="relative">
          {/* Floating Arrow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 h-10 bg-[#f5f8fa] rounded-lg shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] outline outline-[3px] outline-offset-[-3px] outline-white">
            <div className="relative w-6 h-6 overflow-hidden">
              <img
                src={ArrowRight}
                alt="Arrow"
                className="w-full h-full rotate-90 object-cover"
              />
            </div>
          </div>
        </div>
        {/* Receive Section */}

        <TokenBoxPrimary
          isTokenPrimary
          valueInput={valueInput}
          handleChangeValueInput={handleChangeValueSwap}
          handleTokenSelectChange={handleTokenSelectChange}
          title="Choose output token"
          handleErrorMsg={setErrorMsg}
          price={1}
          max={Number(tokenInfo?.balance || 0) * (1 / rateGUSD)}
        />
      </div>

      {/* Price & Fee */}
      <div className="flex items-start justify-between w-full">
        <span className="text-sm font-medium text-[#a7acae]">Fee</span>
        <span className="text-sm font-medium text-[#616566]">0.01%</span>
      </div>

      {/* Connect Wallet */}
      {!user ? (
        <Button
          variant="default"
          className="w-full"
          onClick={() => document.getElementById("header-connect")?.click()}
        >
          <span className="text-base font-semibold text-[#151b11]">
            Connect Wallet
          </span>
        </Button>
      ) : (
        // <Button
        //   onClick={() => handleRedeem(valueInput)}
        //   disabled={!!errorMsg || !Number(valueInput) || loading}
        //   className="w-full text-black"
        // >
        //   {textToShow}
        // </Button>
        <Button disabled className="w-full text-black">
          Withdraw (coming soon)
        </Button>
      )}
    </div>
  );
};
