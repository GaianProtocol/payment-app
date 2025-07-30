import { useTokenSuffix } from "@/store/tokenStore";
import { connection } from "@/utils/config";
import { USDC_SOL_ADDRESS } from "@/utils/constant";
import { usePrivy, useSolanaWallets, } from "@privy-io/react-auth";
import { createMemoInstruction } from "@solana/spl-memo";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ComputeBudgetProgram, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useCallback, useMemo } from "react";

export default function useTransferUSDC() {
  const { wallets, ready } = useSolanaWallets();
  const { user, ready: privyReady } = usePrivy();
  const wallet = useMemo(
    () => wallets.find((w) => w.address === user?.wallet?.address),
    [wallets, user, privyReady, ready]
  );
  const tokenSuffix = useTokenSuffix();

  // const onTransferUSDC = async ({ destination, amount, memo }: { destination: string; amount: number, memo?: string }) => {
  //   if (!user || !wallet) {
  //     console.error("Wallet not connected");
  //     return;
  //   }
  //   if (isNaN(amount) || amount <= 0) {
  //     console.error("Invalid amount");
  //     return;
  //   }

  //   try {
  //     const publicKey = new PublicKey(user.wallet?.address!);
  //     const USDC_MINT = new PublicKey(USDC_SOL_ADDRESS);

  //     const senderATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
  //     const destinationPublicKey = new PublicKey(destination);
  //     const destinationATA = await getAssociatedTokenAddress(USDC_MINT, destinationPublicKey);

  //     const decimals = 6;
  //     const amountStr = amount.toFixed(decimals);
  //     const transferAmountStr = amountStr.replace('.', '');
  //     const transferAmountBigInt = BigInt(transferAmountStr);

  //     const transferIx = createTransferInstruction(
  //       senderATA,
  //       destinationATA,
  //       publicKey,
  //       transferAmountBigInt,
  //       [],
  //       TOKEN_PROGRAM_ID
  //     );

  //     const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  //       microLamports: 1,
  //     });

  //     const memoIx = createMemoInstruction(memo ?? "", [publicKey]);

  //     const transaction = new Transaction()
  //       .add(addPriorityFee)
  //       .add(memoIx)
  //       .add(transferIx);
  //     transaction.feePayer = publicKey;
  //     transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  //     const txSignature = await wallet.sendTransaction(transaction, connection, {
  //       preflightCommitment: "processed",
  //     });
  //     await connection.confirmTransaction(txSignature, "processed");
  //     return txSignature;

  //   } catch (error) {
  //     console.log(error);

  //   }
  // };
  async function checkTransactionStatus(txSignature: string | undefined) {
    if (!txSignature) return null;

    try {
      const status = await connection.getSignatureStatus(txSignature);
      if (status.value?.confirmationStatus === "confirmed" || status.value?.confirmationStatus === "finalized") {
        console.log("Transaction succeeded:", txSignature);
        return txSignature;
      } else if (status.value?.err) {
        console.error("Transaction failed:", status.value.err);
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return await checkTransactionStatus(txSignature);
    } catch (error) {
      console.error("Error checking transaction status:", error);
      return null;
    }
  }

  const onTransfer = useCallback(
    async ({ destination, amount, memo, token }: { destination: string; amount: number, memo?: string, token: string }) => {
      if (!user || !wallet) {
        console.error("Wallet not connected");
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        console.error("Invalid amount");
        return;
      }
      let tokenMint;
      if (token === 'USDC') {
        tokenMint = new PublicKey(USDC_SOL_ADDRESS);
      } else if (token === 'USD*') {
        tokenMint = new PublicKey(tokenSuffix.usdstar);
      } else if (token === 'USDT') {
        tokenMint = new PublicKey(tokenSuffix.usdt);
      }

      if (!tokenMint) {
        console.error("Invalid token");
        return;
      }

      const mintToken = await getMint(connection, tokenMint);
      if (!mintToken) {
        console.error("Invalid token");
        return;
      }
      const publicKey = new PublicKey(user.wallet?.address!);

      const senderATA = await getAssociatedTokenAddress(tokenMint, publicKey);
      const destinationPublicKey = new PublicKey(destination);
      const destinationATA = await getAssociatedTokenAddress(tokenMint, destinationPublicKey);

      const decimals = mintToken.decimals;
      const amountStr = amount.toFixed(decimals);
      const transferAmountStr = amountStr.replace('.', '');
      const transferAmountBigInt = BigInt(transferAmountStr);
      const recentFees = await connection.getRecentPrioritizationFees([publicKey.toBase58()]);
      const priorityFee = Math.max(10_000, Math.ceil(Math.max(...recentFees.map((fee: any) => fee.prioritizationFee)) * 2));
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee,
      });
      const minCus = ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 })

      const instructions = [];
      instructions.push(addPriorityFee);
      instructions.push(minCus);
      instructions.push(createMemoInstruction(memo ?? "", [publicKey]));

      const destinationATAInfo = await connection.getAccountInfo(destinationATA);
      if (!destinationATAInfo) {
        const createATAIx = createAssociatedTokenAccountInstruction(
          publicKey,
          destinationATA,
          destinationPublicKey,
          tokenMint
        );
        instructions.push(createATAIx);
      }

      const transferIx = createTransferInstruction(
        senderATA,
        destinationATA,
        publicKey,
        transferAmountBigInt,
        [],
        TOKEN_PROGRAM_ID
      );
      instructions.push(transferIx);

      const transaction = new Transaction().add(...instructions);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const txSignature = await wallet.sendTransaction(transaction, connection, {
        preflightCommitment: "processed",
        skipPreflight: false,
        maxRetries: 3,
      });
      try {
        await connection.confirmTransaction(
          {
            signature: txSignature,
            blockhash: transaction.recentBlockhash!,
            lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
          },
          "confirmed",
          { timeout: 120_000 }
        );
        console.log("🚀 ~ onTransfer ~ tx:", txSignature);
        return txSignature;
      } catch (error) {
        console.error("Transaction error:", error);
        if (error instanceof Error && error.message.includes("timeout")) {
          return await checkTransactionStatus(txSignature);
        }
        throw error;
      }
    }, [user, wallet, ready, privyReady, tokenSuffix]
  );

  const onTransferSOL = useCallback(
    async ({ destination, amount, memo }: { destination: string; amount: number, memo?: string }) => {
      if (!user || !wallet) {
        console.error("Wallet not connected");
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        console.error("Invalid amount");
        return;
      }
      const publicKey = new PublicKey(user.wallet?.address!);
      const destinationPublicKey = new PublicKey(destination);

      const instructions = [];
      const minCus = ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 })
      instructions.push(minCus);

      const recentFees = await connection.getRecentPrioritizationFees([publicKey.toBase58()]);
      const priorityFee = Math.max(10_000, Math.ceil(Math.max(...recentFees.map((fee: any) => fee.prioritizationFee)) * 2));
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee,
      });
      instructions.push(addPriorityFee);

      instructions.push(createMemoInstruction(memo ?? "", [publicKey]));

      const lamports = BigInt(Math.floor(amount * 1e9));
      const transferIx = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: destinationPublicKey,
        lamports: lamports,
      });
      instructions.push(transferIx);
      const transaction = new Transaction().add(...instructions);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const txSignature = await wallet.sendTransaction(transaction, connection, {
        preflightCommitment: "processed",
        skipPreflight: false,
        maxRetries: 3,
      });
      try {
        await connection.confirmTransaction(
          { signature: txSignature, blockhash: transaction.recentBlockhash!, lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight },
          "confirmed",
          { timeout: 120_000 }
        );
        console.log("🚀 ~ onTransfer ~ tx:", txSignature);
        return txSignature;
      } catch (error) {
        console.error("Transaction error:", error);
        if (error instanceof Error && error.message.includes("timeout")) {
          return await checkTransactionStatus(txSignature);
        }
        throw error;
      }
    }, [user, wallet, ready, privyReady, tokenSuffix]
  )

  return { onTransfer, onTransferSOL, wallet };
}