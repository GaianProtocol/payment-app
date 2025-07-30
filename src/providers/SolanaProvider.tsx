import { NETWORK, PRIVY_APP_ID, SOL_RPC } from "@/utils/constant";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { clusterApiUrl } from "@solana/web3.js";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});
function SolanaAdapterProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          accentColor: "#38CCCD",
          theme: "#FFFFFF",
          showWalletLoginFirst: true,
          logo: "https://app.gaian.network/icons/icon-512x512.png",
          walletChainType: "solana-only",
          walletList: ["detected_wallets", "metamask", "phantom"],
        },
        loginMethods: ["wallet", "google", "twitter"],
        externalWallets: {
          solana: {
            connectors: solanaConnectors as any,
          },
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
          ethereum: {
            createOnLogin: "off",
          },
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        // fundingMethodConfig: {
        //   moonpay: {
        //     useSandbox: true,
        //   },
        // },
        mfa: {
          noPromptOnMfaRequired: false,
        },
        solanaClusters: [
          { name: "mainnet-beta", rpcUrl: SOL_RPC || clusterApiUrl(NETWORK) },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default SolanaAdapterProvider;
