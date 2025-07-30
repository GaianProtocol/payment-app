import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Gaian } from "@/assets/idl/gaian";
import idl from "@/assets/idl/gaian.json";
import { tokensProgram } from "@/configs/buyToken";
import { NETWORK } from "@/utils/constant";
import { getPTTokenPda, getYTTokenPda, tokenAddresses } from "@/utils/utils";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { ComputeBudgetProgram, Transaction } from "@solana/web3.js";

export default function useMint() {
  const { sendTransaction } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const onMintSol = async ({ amount }: { amount: number }) => {
    if (!wallet?.publicKey) return;
    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    });
    const program = new Program(idl as unknown as Gaian, provider as any);
    const suffix = tokenAddresses[NETWORK].solSuffix;

    const { bump: ptBump } = getPTTokenPda(program, suffix);
    const { bump: ytBump } = getYTTokenPda(program, suffix);
    const ix = await program.methods
      .deposit(
        suffix,
        new BN(amount * Math.pow(10, tokensProgram[NETWORK].decimals)),
        ptBump,
        ytBump
      )
      .accounts({})
      .instruction();

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });
    const transaction = new Transaction().add(addPriorityFee).add(ix);
    const tx = await sendTransaction(transaction, connection);
    console.log("🚀 ~ onMintSol ~ tx:", tx);
    return tx;
  };

  const onMintMSol = async ({ amount }: { amount: number }) => {
    if (!wallet?.publicKey) return;
    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    });
    const program = new Program(idl as unknown as Gaian, provider as any);
    const suffix = tokenAddresses[NETWORK].msolSuffix;

    const { bump: ptBump } = getPTTokenPda(program, suffix);
    const { bump: ytBump } = getYTTokenPda(program, suffix);

    const ix = await program.methods
      .depositToken(
        suffix,
        new BN(amount * Math.pow(10, tokensProgram[NETWORK].decimals)),
        ptBump,
        ytBump
      )
      .accounts({
        mint: tokenAddresses[NETWORK].msol,
      })
      .instruction();

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });
    const transaction = new Transaction().add(addPriorityFee).add(ix);
    const tx = await sendTransaction(transaction, connection);
    console.log("🚀 ~ onMintSol ~ tx:", tx);
    return tx;
  };

  const onRedeemSol = async ({ value }: { value: number }) => {
    if (!wallet?.publicKey) return;
    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    });
    const program = new Program(idl as unknown as Gaian, provider as any);

    const suffix = tokenAddresses[NETWORK].solSuffix;
    const amount = new BN(
      value * Math.pow(10, tokensProgram[NETWORK].decimals)
    );
    const ptAmount = new BN(
      value * Math.pow(10, tokensProgram[NETWORK].decimals)
    );
    const ytAmount = new BN(
      value * Math.pow(10, tokensProgram[NETWORK].decimals)
    );

    const { pt, bump: ptBump } = getPTTokenPda(program, suffix);
    const { yt, bump: ytBump } = getYTTokenPda(program, suffix);
    console.log("pt:", pt.toBase58(), "bump:", ptBump);
    console.log("yt:", yt.toBase58(), "bump:", ytBump);

    const ix = await program.methods
      .redeem(suffix, amount, ptAmount, ytAmount)
      .accounts({
        // ptMint: pt,
        // ytMint: yt,
      })
      .instruction();

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });
    const transaction = new Transaction().add(addPriorityFee).add(ix);
    const tx = await sendTransaction(transaction, connection);
    console.log("🚀 ~ onMintSol ~ tx:", tx);
    return tx;
  };

  const onRedeemMSol = async ({ value }: { value: number }) => {
    if (!wallet?.publicKey) return;
    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    });
    const program = new Program(idl as unknown as Gaian, provider as any);

    const suffix = tokenAddresses[NETWORK].msolSuffix;
    const amount = new BN(
      value * Math.pow(10, tokensProgram[NETWORK].decimals)
    );
    const ptAmount = new BN(
      value * Math.pow(10, tokensProgram[NETWORK].decimals)
    );
    const ytAmount = new BN(
      value * Math.pow(10, tokensProgram[NETWORK].decimals)
    );

    const { pt, bump: ptBump } = getPTTokenPda(program, suffix);
    const { yt, bump: ytBump } = getYTTokenPda(program, suffix);
    console.log("pt:", pt.toBase58(), "bump:", ptBump);
    console.log("yt:", yt.toBase58(), "bump:", ytBump);

    const ix = await program.methods
      .redeemToken(suffix, amount, ptAmount, ytAmount)
      .accounts({
        mint: tokenAddresses[NETWORK].msol,
      })
      .instruction();

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });
    const transaction = new Transaction().add(addPriorityFee).add(ix);
    const tx = await sendTransaction(transaction, connection);
    console.log("🚀 ~ onMintSol ~ tx:", tx);
    return tx;
  };

  return { onMintSol, onRedeemSol, onRedeemMSol, onMintMSol };
}
