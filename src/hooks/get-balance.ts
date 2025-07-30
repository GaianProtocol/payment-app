import { connection } from "@/utils/config";
import { loadKeypairFromFile, tokenAddresses } from "@/utils/utils";
import {
  amountToUiAmount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddressSync,
  getInterestBearingMintConfigState,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const network = import.meta.env.VITE_NETWORK || "devnet";

export async function useGetBalance() {

  const payer = loadKeypairFromFile("./deployer.json");
  console.log("payer", payer.publicKey.toBase58());

  const mint = tokenAddresses[network].gusdMint;
  console.log("keypair", mint.toBase58());

  const susd = new PublicKey("susdabGDNbhrnCa6ncrYo81u4s9GM8ecK2UwMyZiq4X");

  // Fetch Mint Account data
  const mintAccount = await getMint(
    connection,
    mint, // Mint Account Address
    undefined, // Optional commitment
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  // Get Interest Config for Mint Account
  const interestBearingMintConfig = getInterestBearingMintConfigState(
    mintAccount // Mint Account data
  );
  console.log(
    "\nMint Config:",
    JSON.stringify(interestBearingMintConfig, null, 2)
  );

  const rate = interestBearingMintConfig?.currentRate;

  // Get the associated token account address
  const associatedTokenAccount = getAssociatedTokenAddressSync(
    mint,
    payer.publicKey,
    false, // allowOwnerOffCurve
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  console.log("ataAddress", associatedTokenAccount.toBase58());

  const tokenInfo = await getAccount(
    connection,
    associatedTokenAccount,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("tokenInfo", tokenInfo);

  // Convert amount to UI amount with accrued interest
  const uiAmount = await amountToUiAmount(
    connection,
    payer,
    mint,
    tokenInfo.amount,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(
    `Amount with accrued interest at ${rate}: ${tokenInfo.amount} tokens = ${uiAmount}`
  );
}
