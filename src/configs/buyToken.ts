import { SOL_RPC } from "@/utils/constant";

export interface Config {
  rpcUrl: string;
  // programId: PublicKey;
  // ptToken: PublicKey;
  // ytToken: PublicKey;
  // msolToken: PublicKey;
  // mptToken: PublicKey;
  // mytToken: PublicKey;
  decimals: number;
}

export interface ConfigEVM {
  contractAddress: `0x${string}`;
  ptToken: `0x${string}`;
  ytToken: `0x${string}`;
  decimals: number;
}

export const tokensProgram: Record<string, Config> = {
  devnet: {
    rpcUrl: SOL_RPC,
    // programId: new PublicKey("BAtBfoaCJhniuSpuvm1JCFW6iTRZ1biypy4Xio7bMiK6"),
    // ptToken: new PublicKey("39pUGAeV3WA8wnL3NGZfpnrKUE6w6ivkFr9MB61HRmQE"),
    // ytToken: new PublicKey("5MSmNyrsBvDXyZkgXS4wV3wbDR3dNQb8nsShjC7dMyi1"),
    // msolToken: new PublicKey("2A8vKToJrRGQwQyCZgVmp6jDd2gqZquRPZLhvNCaU4QD"),
    // mptToken: new PublicKey("3EtHQdwRfaUwwbTLWeRZCDKpPH47P5GdTJNU6n2jmu6x"),
    // mytToken: new PublicKey("Db1M9vUpaT13seB6UMKxiiPX2vMjZQaPYAbDYHoxKA6J"),
    decimals: 9,
  },
  mainnet: {
    rpcUrl:
      "https://mainnet.helius-rpc.com/?api-key=157fe572-a0f8-4015-b058-9280134620ac",
    // programId: new PublicKey("BAtBfoaCJhniuSpuvm1JCFW6iTRZ1biypy4Xio7bMiK6"),
    // ptToken: new PublicKey("39pUGAeV3WA8wnL3NGZfpnrKUE6w6ivkFr9MB61HRmQE"),
    // ytToken: new PublicKey("5MSmNyrsBvDXyZkgXS4wV3wbDR3dNQb8nsShjC7dMyi1"),
    // msolToken: new PublicKey("2A8vKToJrRGQwQyCZgVmp6jDd2gqZquRPZLhvNCaU4QD"),
    // mptToken: new PublicKey("3EtHQdwRfaUwwbTLWeRZCDKpPH47P5GdTJNU6n2jmu6x"),
    // mytToken: new PublicKey("Db1M9vUpaT13seB6UMKxiiPX2vMjZQaPYAbDYHoxKA6J"),
    decimals: 9,
  },
};
