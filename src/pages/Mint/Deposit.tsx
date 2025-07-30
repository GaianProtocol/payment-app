import {
  ArrowRight,
  EmptyWallet,
  gUSD,
  PaypalIcon,
  Usdc,
  USDS,
  Usdt,
} from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
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

export const Deposit = () => {
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
    if (loading) return "Approving...";
    return "Approve " + tokenSelected.name;
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

  // const handleMint = useCallback(
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
  //         .deposit(amountSend)
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
  //       toast.success("Deposit successful!");
  //       await fetchToken();
  //     } catch (error) {
  //       console.error("Deposit failed:", error);
  //       toast.error("Deposit failed. Please try again.");
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
        <TokenBoxPrimary
          isTokenPrimary
          valueInput={valueInput}
          handleChangeValueInput={handleChangeValueSwap}
          handleTokenSelectChange={handleTokenSelectChange}
          title="Choose a stablecoin"
          handleErrorMsg={setErrorMsg}
          price={1}
        />
        <div className="relative">
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
        <div className="p-5 bg-[#f6fdf2] rounded-2xl flex flex-col gap-4">
          <span className="text-sm font-medium text-[#616566]">
            You will receive
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <TokenReceive />
              <span className="text-[32px] font-semibold text-[#151b11]">
                {valueInput && rateGUSD
                  ? Number(Number(valueInput) * rateGUSD).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 4,
                        minimumFractionDigits: 0,
                      }
                    )
                  : "0"}
              </span>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium text-[#a7acae]">
                ≈ $
                {(valueInput && rateGUSD
                  ? Number(valueInput) * rateGUSD
                  : 0
                ).toFixed(2)}{" "}
                USD
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EmptyWalletIcon small />
              <span className="text-sm font-semibold text-[#616566]">
                {tokenInfo?.balance?.toLocaleString("en-US", {
                  maximumFractionDigits: 4,
                  minimumFractionDigits: 0,
                }) || "0"}{" "}
                gUSD
              </span>
            </div>
            <span className="text-sm font-semibold text-[#07a22c]">
              8.21% APY
            </span>
          </div>
        </div>
      </div>

      {/* Price & Fee */}
      <div className="flex items-start justify-between w-full">
        <span className="text-sm font-medium text-[#a7acae]">Est. Price</span>
        <span className="text-sm font-medium text-[#616566]">
          1 gUSD ≈ {rateGUSD.toFixed(4)} USDC
        </span>
      </div>
      <div className="flex items-start justify-between w-full">
        <span className="text-sm font-medium text-[#a7acae]">Swap fee</span>
        <span className="text-sm font-medium text-[#616566]">0.01%</span>
      </div>

      {/* Action Button */}
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
        //   onClick={() => handleMint(valueInput)}
        //   disabled={!!errorMsg || !Number(valueInput) || loading}
        //   className="w-full text-black"
        // >
        //   {textToShow}
        // </Button>
        <Button disabled className="w-full text-black">
          Mint (coming soon)
        </Button>
      )}
    </div>
  );
};

interface EmptyWalletIconProps {
  small?: boolean;
}

const EmptyWalletIcon = ({ small }: EmptyWalletIconProps) => {
  const sizeClass = small ? "w-4 h-4" : "w-6 h-6";
  return <img src={EmptyWallet} alt="Wallet" className={sizeClass} />;
};

const TokenReceive = () => (
  <button
    type="button"
    className={cn(
      "info-wallet h-[36px] text-sm font-normal flex items-center gap-2 rounded-full bg-white",
      "px-3 pl-1 border"
    )}
  >
    <img src={gUSD} alt="gUSD" />
    <span className="text-base font-semibold text-[#151b11]">gUSD</span>
  </button>
);
