import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Gaian } from "@/assets/idl/gaian";
import idl from "@/assets/idl/gaian.json";
import { useSetTokenSuffix } from "@/store/tokenStore";
import { NETWORK } from "@/utils/constant";
import { getPTTokenPda, getYTTokenPda, tokenAddresses } from "@/utils/utils";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useEffect } from "react";

export default function useGetTokenSuffix() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const setTokens = useSetTokenSuffix();

  const getTokenSuffix = () => {
    if (!wallet?.publicKey) return;
    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    });
    const program = new Program(idl as unknown as Gaian, provider as any);
    const solSuffix = tokenAddresses[NETWORK].solSuffix;
    const mSolSuffix = tokenAddresses[NETWORK].msolSuffix;

    const { pt } = getPTTokenPda(program, solSuffix);
    const { yt } = getYTTokenPda(program, solSuffix);

    const { pt: mpt } = getPTTokenPda(program, mSolSuffix);
    const { yt: myt } = getYTTokenPda(program, mSolSuffix);

    setTokens({
      pt: pt.toString().toLowerCase(),
      yt: yt.toString().toLowerCase(),
      mpt: mpt.toString().toLowerCase(),
      myt: myt.toString().toLowerCase(),
    });
  };
  useEffect(() => {
    getTokenSuffix();
  }, [wallet.publicKey]);
  return null;
}
