import { CurrentConfig, Environment } from "@/configs/configs";
import { BaseProvider } from "@ethersproject/providers";
import { BigNumber, ethers, providers } from "ethers";
const mainnetProvider = new ethers.providers.JsonRpcProvider(
  CurrentConfig.rpc.mainnet
);
const wallet = createWallet();
const browserExtensionProvider = createBrowserExtensionProvider();

export function getProvider(): providers.Provider | null {
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? browserExtensionProvider
    : wallet.provider;
}
function createBrowserExtensionProvider(): ethers.providers.Web3Provider | null {
  try {
    return new ethers.providers.Web3Provider(window?.ethereum, "any");
  } catch (e) {
    console.log("No Wallet Extension Found");
    return null;
  }
}
function createWallet(): ethers.Wallet {
  let provider = mainnetProvider;
  if (CurrentConfig.env == Environment.LOCAL) {
    provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.local);
  }
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider);
}

export enum TransactionState {
  Failed = "Failed",
  New = "New",
  Rejected = "Rejected",
  Sending = "Sending",
  Sent = "Sent",
}
export async function sendTransaction(
  transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  console.log("🚀 ~ CurrentConfig.env:", CurrentConfig.env);

  if (CurrentConfig.env === Environment.WALLET_EXTENSION) {
    return sendTransactionViaExtension(transaction);
  } else {
    return sendTransactionViaWallet(transaction);
  }
}

async function sendTransactionViaExtension(
  transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  try {
    const receipt = await browserExtensionProvider?.send(
      "eth_sendTransaction",
      [transaction]
    );
    if (receipt) {
      return TransactionState.Sent;
    } else {
      return TransactionState.Failed;
    }
  } catch (e) {
    console.log(e);
    return TransactionState.Rejected;
  }
}

export function getMainnetProvider(): BaseProvider {
  return mainnetProvider;
}

async function sendTransactionViaWallet(
  transaction: ethers.providers.TransactionRequest
): Promise<TransactionState | any> {
  try {
    if (transaction.value) {
      transaction.value = BigNumber.from(transaction.value);
    }
    console.log("transaction: ", transaction);
    transaction.from = wallet.address;

    const txRes = await wallet.sendTransaction(transaction);

    console.log("txRes: ", txRes);

    let receipt = null;
    const provider = getProvider();

    if (!provider) {
      return TransactionState.Failed;
    }

    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(txRes.hash);

        if (receipt === null) {
          continue;
        }
      } catch (e) {
        console.log(`Receipt error:`, e);
        break;
      }
    }

    // Transaction was successful if status === 1
    if (receipt) {
      return TransactionState.Sent;
    } else {
      return TransactionState.Failed;
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: index.tsx:sendTransactionViaWallet ~ error:",
      error
    );
  }
}
