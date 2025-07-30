import { txVersion } from "@/utils/config";
import { tokenAddresses } from "@/utils/utils";
import {
  ApiV3PoolInfoConcentratedItem,
  CLMM_PROGRAM_ID,
  ClmmKeys,
  ComputeClmmPoolInfo,
  DEVNET_PROGRAM_ID,
  PoolUtils,
  Raydium,
  ReturnTypeFetchMultiplePoolTickArrays,
  Token,
} from "@raydium-io/raydium-sdk-v2";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";

const VALID_PROGRAM_ID = new Set([
  CLMM_PROGRAM_ID.toBase58(),
  DEVNET_PROGRAM_ID.CLMM.toBase58(),
]);

export const isValidClmm = (id: string) => VALID_PROGRAM_ID.has(id);

// export const swap = async () => {
//   const raydium = await initSdk();
//   let poolInfo: ApiV3PoolInfoConcentratedItem;
//   const poolId = "DhFs8xnfvE66b5XEHBrRCuwFxRVRux9yf1ufyCXqPy2G";
//   const inputMint = Token.WSOL.mint.toBase58();
//   let poolKeys: ClmmKeys | undefined;
//   let clmmPoolInfo: ComputeClmmPoolInfo;
//   let tickCache: ReturnTypeFetchMultiplePoolTickArrays;

//   const inputAmount = new BN(1000);

//   if (raydium.cluster === "mainnet") {
//     // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
//     // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
//     const data = await raydium.api.fetchPoolById({ ids: poolId });
//     poolInfo = data[0] as ApiV3PoolInfoConcentratedItem;
//     if (!isValidClmm(poolInfo.programId))
//       throw new Error("target pool is not CLMM pool");

//     clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
//       connection: raydium.connection,
//       poolInfo,
//     });
//     tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
//       connection: raydium.connection,
//       poolKeys: [clmmPoolInfo],
//     });
//   } else {
//     const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
//     poolInfo = data.poolInfo;
//     poolKeys = data.poolKeys;
//     clmmPoolInfo = data.computePoolInfo;
//     tickCache = data.tickData;
//   }

//   if (
//     inputMint !== poolInfo.mintA.address &&
//     inputMint !== poolInfo.mintB.address
//   )
//     throw new Error("input mint does not match pool");

//   const baseIn = inputMint === poolInfo.mintA.address;

//   const { minAmountOut, remainingAccounts } = PoolUtils.computeAmountOutFormat({
//     poolInfo: clmmPoolInfo,
//     tickArrayCache: tickCache[poolId],
//     amountIn: inputAmount,
//     tokenOut: poolInfo[baseIn ? "mintB" : "mintA"],
//     slippage: 0.01,
//     epochInfo: await raydium.fetchEpochInfo(),
//   });

//   const { execute } = await raydium.clmm.swap({
//     poolInfo,
//     poolKeys,
//     inputMint: poolInfo[baseIn ? "mintA" : "mintB"].address,
//     amountIn: inputAmount,
//     amountOutMin: minAmountOut.amount.raw,
//     observationId: clmmPoolInfo.observationId,
//     ownerInfo: {
//       useSOLBalance: true, // if wish to use existed wsol token account, pass false
//     },
//     remainingAccounts,
//     txVersion,

//     // optional: set up priority fee here
//     // computeBudgetConfig: {
//     //   units: 600000,
//     //   microLamports: 1000000,
//     // },
//   });

//   const { txId } = await execute();
//   console.log("swapped in clmm pool:", {
//     txId: `https://explorer.solana.com/tx/${txId}`,
//   });
// };
const cluster = "devnet"; // 'mainnet' | 'devnet'

export default function useSwapToken() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const onSwap = async ({
    amount,
    ytToSol,
  }: {
    amount: number;
    ytToSol: boolean;
  }) => {
    const raydium = await Raydium.load({
      owner: wallet.publicKey,
      connection,
      cluster,
      signAllTransactions: wallet.signAllTransactions,
      disableFeatureCheck: true,
      disableLoadToken: true,
      blockhashCommitment: "finalized",
      // urlConfigs: {
      //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
      // },
    } as any);
    let poolInfo: ApiV3PoolInfoConcentratedItem;
    const poolId = "DhFs8xnfvE66b5XEHBrRCuwFxRVRux9yf1ufyCXqPy2G";
    const inputMint = Token.WSOL.mint.toBase58();
    let poolKeys: ClmmKeys | undefined;
    let clmmPoolInfo: ComputeClmmPoolInfo;
    let tickCache: ReturnTypeFetchMultiplePoolTickArrays;

    const inputAmount = new BN(amount * 1e9);

    if (raydium.cluster === "mainnet") {
      // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
      // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
      const data = await raydium.api.fetchPoolById({ ids: poolId });
      poolInfo = data[0] as ApiV3PoolInfoConcentratedItem;
      if (!isValidClmm(poolInfo.programId))
        throw new Error("target pool is not CLMM pool");

      clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
        connection: raydium.connection,
        poolInfo,
      });
      tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
        connection: raydium.connection,
        poolKeys: [clmmPoolInfo],
      });
    } else {
      const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
      console.log("🚀 ~ onSwap ~ data:", data);
      poolInfo = data.poolInfo;
      poolKeys = data.poolKeys;
      clmmPoolInfo = data.computePoolInfo;
      tickCache = data.tickData;
    }

    if (
      inputMint !== poolInfo.mintA.address &&
      inputMint !== poolInfo.mintB.address
    )
      throw new Error("input mint does not match pool");
    const baseAddress = ytToSol
      ? poolInfo.mintB.address
      : poolInfo.mintA.address;
    const baseIn = inputMint === baseAddress;

    const { minAmountOut, remainingAccounts } =
      PoolUtils.computeAmountOutFormat({
        poolInfo: clmmPoolInfo,
        tickArrayCache: tickCache[poolId],
        amountIn: inputAmount,
        tokenOut: poolInfo[baseIn ? "mintB" : "mintA"],
        slippage: 0.01,
        epochInfo: await raydium.fetchEpochInfo(),
      });

    const { execute } = await raydium.clmm.swap({
      poolInfo,
      poolKeys,
      inputMint: poolInfo[baseIn ? "mintA" : "mintB"].address,
      amountIn: inputAmount,
      amountOutMin: minAmountOut.amount.raw,
      observationId: clmmPoolInfo.observationId,
      ownerInfo: {
        useSOLBalance: true, // if wish to use existed wsol token account, pass false
      },
      remainingAccounts,
      txVersion,

      // optional: set up priority fee here
      // computeBudgetConfig: {
      //   units: 600000,
      //   microLamports: 1000000,
      // },
    });

    const { txId } = await execute();
    console.log("swapped in clmm pool:", {
      txId: `https://explorer.solana.com/tx/${txId}`,
    });
  };

  const onEstAmount = async ({
    amount,
    ytToSol,
  }: {
    amount: number;
    ytToSol: boolean;
  }) => {
    const raydium = await Raydium.load({
      owner: wallet.publicKey,
      connection,
      cluster,
      signAllTransactions: wallet.signAllTransactions,
      disableFeatureCheck: true,
      disableLoadToken: true,
      blockhashCommitment: "finalized",
      // urlConfigs: {
      //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
      // },
    } as any);
    let poolInfo: ApiV3PoolInfoConcentratedItem;
    const poolId = "DhFs8xnfvE66b5XEHBrRCuwFxRVRux9yf1ufyCXqPy2G";
    const inputMint = Token.WSOL.mint.toBase58();
    let poolKeys: ClmmKeys | undefined;
    let clmmPoolInfo: ComputeClmmPoolInfo;
    let tickCache: ReturnTypeFetchMultiplePoolTickArrays;

    const inputAmount = new BN(amount * 1e9);

    if (raydium.cluster === "mainnet") {
      // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
      // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
      const data = await raydium.api.fetchPoolById({ ids: poolId });
      poolInfo = data[0] as ApiV3PoolInfoConcentratedItem;
      if (!isValidClmm(poolInfo.programId))
        throw new Error("target pool is not CLMM pool");

      clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
        connection: raydium.connection,
        poolInfo,
      });
      tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
        connection: raydium.connection,
        poolKeys: [clmmPoolInfo],
      });
    } else {
      const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
      console.log("🚀 ~ onSwap ~ data:", data);
      poolInfo = data.poolInfo;
      poolKeys = data.poolKeys;
      clmmPoolInfo = data.computePoolInfo;
      tickCache = data.tickData;
    }

    if (
      inputMint !== poolInfo.mintA.address &&
      inputMint !== poolInfo.mintB.address
    )
      throw new Error("input mint does not match pool");
    const baseAddress = ytToSol
      ? poolInfo.mintB.address
      : poolInfo.mintA.address;
    const baseIn = inputMint === baseAddress;

    const { minAmountOut } = PoolUtils.computeAmountOutFormat({
      poolInfo: clmmPoolInfo,
      tickArrayCache: tickCache[poolId],
      amountIn: inputAmount,
      tokenOut: poolInfo[baseIn ? "mintB" : "mintA"],
      slippage: 0.01,
      epochInfo: await raydium.fetchEpochInfo(),
    });

    return { estAmount: minAmountOut.amount.numerator.toNumber() / 1e9 };
  };
  const onEstAmountGUSD = async ({
    amount,
    usdcToGusd,
  }: {
    amount: number;
    usdcToGusd: boolean;
  }) => {
    const raydium = await Raydium.load({
      owner: wallet.publicKey,
      connection,
      cluster,
      signAllTransactions: wallet.signAllTransactions,
      disableFeatureCheck: true,
      disableLoadToken: true,
      blockhashCommitment: "finalized",
    } as any);

    const poolId = "guiy6LGPes3WS81JiW5DZu6jT6sG5BGGCqLuwEZ4ZG3";
    const config = tokenAddresses["devnet"];
    const usdcMint = config.usdcMint.toBase58();
    const gusdMint = config.gusdMint.toBase58();

    const inputMint = usdcToGusd ? usdcMint : gusdMint;

    let poolInfo: ApiV3PoolInfoConcentratedItem;
    let poolKeys: ClmmKeys | undefined;
    let clmmPoolInfo: ComputeClmmPoolInfo;
    let tickCache: ReturnTypeFetchMultiplePoolTickArrays;

    const inputAmount = new BN(amount * 1e6);

    if (raydium.cluster === "mainnet") {
      const data = await raydium.api.fetchPoolById({ ids: poolId });
      poolInfo = data[0] as ApiV3PoolInfoConcentratedItem;
      if (!isValidClmm(poolInfo.programId))
        throw new Error("target pool is not CLMM pool");

      clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
        connection: raydium.connection,
        poolInfo,
      });
      tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
        connection: raydium.connection,
        poolKeys: [clmmPoolInfo],
      });
    } else {
      const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
      poolInfo = data.poolInfo;
      poolKeys = data.poolKeys;
      clmmPoolInfo = data.computePoolInfo;
      tickCache = data.tickData;
    }

    if (
      inputMint !== poolInfo.mintA.address &&
      inputMint !== poolInfo.mintB.address
    )
      throw new Error("input mint does not match pool");

    const baseAddress = usdcToGusd ? poolInfo.mintA.address : poolInfo.mintB.address;
    const baseIn = inputMint === baseAddress;

    const { minAmountOut } = PoolUtils.computeAmountOutFormat({
      poolInfo: clmmPoolInfo,
      tickArrayCache: tickCache[poolId],
      amountIn: inputAmount,
      tokenOut: poolInfo[baseIn ? "mintB" : "mintA"],
      slippage: 0.01,
      epochInfo: await raydium.fetchEpochInfo(),
    });

    return { estAmount: minAmountOut.amount.numerator.toNumber() / 1e6 };
  };
  return { onSwap, onEstAmount, onEstAmountGUSD };
}
