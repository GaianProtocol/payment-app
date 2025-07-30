// import tokenList from "@/assets/idl/all.json";
// import { SwapWidget, Theme, TokenInfo } from "@uniswap/widgets";
import { ethers } from "ethers";
// import { sepolia } from "viem/chains";
// const enableColorExtractionTheme: Theme = {
//   tokenColorExtraction: true, // Enable color extraction of the output token
// };
export const JSON_RPC_URL = "https://cloudflare-eth.com";
export default function BridgePage() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("tokenList: ");
  return (
    <div className="Uniswap">
      {/* <SwapWidget
        tokenList={(tokenList as unknown as TokenInfo[]).splice(0, 10000)}
        // provider={provider}
        // defaultChainId={sepolia.id}
        locale={"en-US"}
        jsonRpcUrlMap={{
          [sepolia.id]: "https://rpc.sepolia.org",
        }}
        // onConnectWallet={focusConnectors}
        // defaultInputTokenAddress="NATIVE"
        // defaultInputAmount="1"
        // defaultOutputTokenAddress={"0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"}
      /> */}
    </div>
  );
}
