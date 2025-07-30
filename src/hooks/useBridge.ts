// const getMetamaskSigner = async () => {
//   if (typeof window.ethereum === "undefined") {
//     throw new Error("Metamask is not installed");
//   }
//   const accounts = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   return { signer: window.ethereum, address: accounts[0] };
// };

// export const TEST_NTT_TOKENS: NttContracts = {
//   Solana: {
//     token: "5MSmNyrsBvDXyZkgXS4wV3wbDR3dNQb8nsShjC7dMyi1",
//     manager: "ntttrzSyHs5e695fZmXYEsDPvP1K7QjGmiU6a4bKA7R",
//     transceiver: {
//       wormhole: "727zu1Wr4nPrgg5SfTPaJ3SWtT3u28aZqqMtgofDbjQU",
//     },
//   },
//   Sepolia: {
//     token: "0x81FF8a6db017c8C995eAeC3D19aD103b258d9896",
//     manager: "0x1d07108E2929aD0c8928e6dEdff571d3BB5C5E1F",
//     transceiver: { wormhole: "0xFbD80d2B2472f3a85950058cFBc315200c64fD4e" },
//   },
// };

export default function useBridge() {
  // const wallet = useWallet();
  // const { connection } = useConnection();
  const onBridge = async () => {
    //   if (!wallet?.publicKey) return;
    //   const wh = new Wormhole("Testnet", [solana.Platform, evm.Platform], {
    //     chains: {
    //       Solana: {
    //         rpc: "https://devnet.helius-rpc.com/?api-key=157fe572-a0f8-4015-b058-9280134620ac",
    //       },
    //     },
    //   });
    //   const src = wh.getChain("Solana");
    //   const dst = wh.getChain("Sepolia");
    //   src;
    //   const srcNtt = await src.getProtocol("Ntt", {
    //     ntt: TEST_NTT_TOKENS[src.chain],
    //   });
    //   console.log("srcNtt: ", srcNtt);
    //   const dstNtt = await dst.getProtocol("Ntt", {
    //     ntt: TEST_NTT_TOKENS[dst.chain],
    //   });
    //   // const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   // const dstSigner = provider.getSigner();
    //   const srcSigner = await getBrowserSigner(src);
    //   // const srcSigner ={
    //   //   signer: {
    //   //     ...wallet,
    //   //     address: wallet.publicKey.toString(),
    //   //     sign: wallet.signAllTransactions,
    //   //     signAndSend: wallet.sendTransaction,
    //   //     chain: "Solana",
    //   //     network: "Testnet",
    //   //   },
    //   //   address: wallet.publicKey.toBase58(),
    //   // };
    //   const dstSigner = await getMetamaskSigner();
    //   // src.getProtocol('Ntt', {
    //   // })
    //   console.log("dstNtt", dstNtt);
    //   console.log("dstSigner", dstSigner.address);
    //   const amt = amount.units(
    //     amount.parse("0.001", await srcNtt.getTokenDecimals())
    //   );
    //   console.log("amt", amt);
    //   const xfer = () =>
    //     srcNtt.transfer(srcSigner.address as any, amt, dstSigner.address, {
    //       queue: false,
    //       automatic: false,
    //       gasDropoff: 0n,
    //     });
    //   const data = await srcNtt.transfer(
    //     srcSigner.address.address,
    //     amt,
    //     dstSigner.address,
    //     {
    //       queue: false,
    //       automatic: false,
    //       gasDropoff: 0n,
    //     }
    //   );
    //   console.log("---12312-", data);
    //   const txids: TransactionId[] = await signSendWait(
    //     src,
    //     xfer(),
    //     srcSigner.signer
    //   );
    //   console.log("Source txs", txids);
    //   const vaa = await wh.getVaa(
    //     txids[txids.length - 1]!.txid,
    //     "Ntt:WormholeTransfer",
    //     25 * 60 * 1000
    //   );
    //   console.log("vaa: ", vaa);
    //   const dstTxids = await signSendWait(
    //     dst,
    //     dstNtt.redeem([vaa!], dstSigner.address),
    //     dstSigner.signer
    //   );
    //   console.log("dstTxids", dstTxids);
    //   // const xfer = await wh.tokenTransfer(
    //   //   amt,
    //   //   source.address,
    //   //   destination.address,
    //   //   false
    //   // );
  };

  return { onBridge };
}
