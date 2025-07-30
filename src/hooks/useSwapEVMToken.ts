import { CurrentConfig } from "@/configs/configs";
import { TransactionState } from "@/providers";
import {
  ERC20_ABI,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  V3_SWAP_ROUTER_ADDRESS,
} from "@/utils/constant";
import {
  AlphaRouter,
  SwapOptions,
  SwapRoute,
  SwapType,
} from "@uniswap/smart-order-router";

import { fromReadableAmount } from "@/utils/conversion";
import {
  BigintIsh,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import { BigNumber, ethers } from "ethers";
export default function useSwapEVMToken() {
  const swapEVMToken = async (
    address: `0x${string}`,
    amount: number
  ): Promise<TransactionState | any> => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    if (!address || !provider || !signer) {
      return TransactionState.Failed;
    }

    console.log("address==========: ", provider);

    const router = new AlphaRouter({
      chainId: 1,
      provider: provider as any,
    });

    // Give approval to the router contract to transfer tokens
    const tokenInApproval = await getTokenTransferApproval(
      address,
      amount,
      CurrentConfig.tokens.token0,
      V3_SWAP_ROUTER_ADDRESS
    );

    // Fail if transfer approvals are not granted
    if (tokenInApproval !== TransactionState.Sent) {
      return TransactionState.Failed;
    }

    const token0CurrencyAmount = CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      fromReadableAmount(
        amount,
        CurrentConfig.tokens.token0.decimals
      ).toString() as BigintIsh
    );

    const swapOptions: SwapOptions = {
      type: SwapType.SWAP_ROUTER_02,
      recipient: address,
      slippageTolerance: new Percent(50, 10_000),
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    };

    const routeToRatioResponse: SwapRoute | null = await router.route(
      token0CurrencyAmount,
      CurrentConfig.tokens.token1,
      TradeType.EXACT_INPUT,
      swapOptions
    );

    console.log("routeToRatioResponse: ", routeToRatioResponse);

    if (!routeToRatioResponse || !routeToRatioResponse.methodParameters) {
      throw new Error("No route found for the given trade.");
    }
    const transaction = {
      data: routeToRatioResponse.methodParameters?.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: routeToRatioResponse.methodParameters?.value,
      from: address,
      gasPrice: ethers.utils.parseUnits("20", "gwei"),
    };
    console.log("transaction: ", transaction);
    const txResponse = await signer.sendTransaction(transaction);
    await txResponse.wait();
    console.log("🚀 ~ useSwapEVMToken ~ txResponse:", txResponse);
  };

  const getTokenTransferApproval = async (
    address: string,
    amount: number,
    token: Token,
    spenderAddress: string
  ): Promise<TransactionState | any> => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      if (!provider || !address) {
        console.log("No Provider Found");
        return TransactionState.Failed;
      }

      const tokenContract = new ethers.Contract(
        token.address,
        ERC20_ABI,
        signer
      );

      const currentAllowance = await tokenContract.allowance(
        address,
        spenderAddress
      );

      if (BigNumber.from(currentAllowance).lt(BigNumber.from(amount))) {
        const transaction = await tokenContract.populateTransaction.approve(
          spenderAddress,
          TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER
        );

        return signer.sendTransaction({
          ...transaction,
          from: address,
        });
      } else {
        console.log("Sufficient allowance already set");
        return TransactionState.Sent;
      }
    } catch (e) {
      console.log("Error: ", e);
      return TransactionState.Failed;
    }
  };

  return { swapEVMToken };
}
