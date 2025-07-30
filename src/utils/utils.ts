import { Gaian } from "@/assets/idl/gaian";
import { GaianStablecoin } from "@/assets/idl/gaian_stablecoin";
import { ProductStatusResponse } from "@/types/install-reload-cache.type";
import { Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
interface Config {
  rpcUrl: string;

  solSuffix: string;

  msol: PublicKey;
  msolSuffix: string;
  programId: PublicKey;
  usdcMint: PublicKey;
  gusdMint: PublicKey;
}

export const tokenAddresses: Record<string, Config> = {
  devnet: {
    // rpcUrl: SOL_RPC,

    solSuffix: "311224",

    msol: new PublicKey("2A8vKToJrRGQwQyCZgVmp6jDd2gqZquRPZLhvNCaU4QD"),
    msolSuffix: "msolQ4",
    rpcUrl: clusterApiUrl("devnet"),
    programId: new PublicKey("8aoKBDm4p8xnjdNyk9dD5bMNczkG1A4igf9WkVLLLgwG"),
    usdcMint: new PublicKey("39ctNDFFtHrnE1nvKXXywdrpTNHWQJGzGrfkVRdN1Aju"),
    gusdMint: new PublicKey("guiy6LGPes3WS81JiW5DZu6jT6sG5BGGCqLuwEZ4ZG3"),
  },
  mainnet: {
    solSuffix: "311224",

    msol: new PublicKey("2A8vKToJrRGQwQyCZgVmp6jDd2gqZquRPZLhvNCaU4QD"),
    msolSuffix: "msolQ4",
    rpcUrl: clusterApiUrl("mainnet-beta"),
    programId: new PublicKey("8aoKBDm4p8xnjdNyk9dD5bMNczkG1A4igf9WkVLLLgwG"),
    usdcMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    gusdMint: new PublicKey("guiy6LGPes3WS81JiW5DZu6jT6sG5BGGCqLuwEZ4ZG3"),

  }
};

export function getGaianPda(
  program: Program<GaianStablecoin>,
  usdcMint: PublicKey
): {
  gaian: PublicKey;
  bump: number;
} {
  const [gaian, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("gaian"), usdcMint.toBuffer()],
    program.programId
  );

  return { gaian, bump };
}

export function getGaianTokenPda(
  program: Program<GaianStablecoin>,
  ptMint: PublicKey,
  ytMint: PublicKey
): {
  gaian: PublicKey;
  bump: number;
} {
  const [gaian, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("gaian_token"), ptMint.toBuffer(), ytMint.toBuffer()],
    program.programId
  );

  return { gaian, bump };
}

export function getPTTokenPda(
  program: Program<Gaian>,
  suffix: string
): {
  pt: PublicKey;
  bump: number;
} {
  const [pt, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("gaian_pt"), Buffer.from(suffix)],
    // [Buffer.from("gaian_pt")],
    program.programId
  );

  return { pt, bump };
}

export function getYTTokenPda(
  program: Program<Gaian>,
  suffix: string
): {
  yt: PublicKey;
  bump: number;
} {
  const [yt, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("gaian_yt"), Buffer.from(suffix)],
    // [Buffer.from("gaian_yt")],
    program.programId
  );

  return { yt, bump };
}


export function roundToFourDecimals(value: number, precision = 4): number {
  return Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function loadKeypairFromFile(filePath: string): Keypair {
  const secretKeyString = fs.readFileSync(filePath, { encoding: "utf8" });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

interface FormatOptions {
  decimalPlaces?: number;
  fixed?: number;
}

export function formatLargeNumber(value: number | bigint, options: FormatOptions = {}): string {
  const { decimalPlaces = 1, fixed = 4 } = options;

  const thresholds = [
    { limit: 1_000_000_000, suffix: 'B' },
    { limit: 1_000_000, suffix: 'M' },
    { limit: 1_000, suffix: 'K' },
  ];

  const num = typeof value === 'bigint' ? Number(value) : value;

  if (Math.abs(num) < 1_000) {
    return num.toLocaleString('en-US', { maximumFractionDigits: fixed, minimumFractionDigits: 0 });
  }

  for (const { limit, suffix } of thresholds) {
    if (Math.abs(num) >= limit) {
      const formatted = (num / limit).toFixed(decimalPlaces).replace(/\.0$/, '');
      return `${formatted}${suffix}`;
    }
  }

  return num.toString();
}

export function compareVersions(current: string, latest: string): boolean {
  const parseVersion = (version: string) =>
    version.replace("V.", "").split(".").map(Number);
  const currentParts = parseVersion(current);
  const latestParts = parseVersion(latest);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentNum = currentParts[i] || 0;
    const latestNum = latestParts[i] || 0;
    if (latestNum > currentNum) return true;
    if (currentNum > latestNum) return false;
  }
  return false;
}

export function shouldShowClearCache(
  response: ProductStatusResponse | null,
  currentVersion: string | null
): boolean {
  if (!response || !currentVersion) return false;
  return compareVersions(currentVersion, response.version.text);
}

const FEE_RATE = 0.012;
const MIN_FEE = 0.16;
export function calcUSDCWithFee(usdc: number, minFee: number = MIN_FEE, transFee: number = FEE_RATE, fixedFee: number = 0): { usdc: number, fee: number, total: number } {
  if (!usdc) return {
    usdc: 0,
    fee: minFee,
    total: 0
  };
  const fee = Math.max(minFee, transFee * usdc + fixedFee);
  const total = usdc + fee;
  return {
    usdc,
    fee: Math.ceil(fee * 100) / 100,
    total: Math.ceil(total * 100) / 100
  };
}