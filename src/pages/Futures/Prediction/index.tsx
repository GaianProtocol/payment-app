import { cn } from "@/utils/cn";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import ButtonPrediction from "./ButtonPrediction";
import EstEntryPrice from "./EstEntryPrice";
import Leverage from "./Leverage";
import Order from "./Order";
import Slippage from "./Slippage";
import TradeSize from "./TradeSize";

export type FormValuesPrediction = {
  amount: number;
  leverage: number;
  entryPrice: number;
  action: string;
};
export default function Prediction() {
  const { publicKey } = useWallet();
  const schema = yup.object().shape({
    amount: yup
      .number()
      .required("Amount is required")
      .transform((_, originalValue) =>
        typeof originalValue === "string" ? Number(originalValue.trim()) : NaN
      ), // Transform string to number
    leverage: yup.number().required("Leverage is required"),
    entryPrice: yup
      .number()
      .required("Entry price is required")
      .transform((_, originalValue) =>
        typeof originalValue === "string" ? Number(originalValue.trim()) : NaN
      ),
    action: yup.string().required(),
  });
  const methods = useForm<FormValuesPrediction>({
    resolver: yupResolver(schema),
    values: {
      leverage: 0,
    } as any,
  });

  const onSubmit: SubmitHandler<FormValuesPrediction> = (data) => {
    console.log("🚀 ~ Prediction ~ data:", data);
    if (data.action === "buy") {
      console.log("Buy/Long button was clicked");
      toast.success("Buy/Long predicted");
    } else if (data.action === "sell") {
      console.log("Short/Sell button was clicked");
      toast.success("Short/Sell predicted");
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        className="w-full max-w-[380px]"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div
          className={cn(
            " bg-[#202225] border border-white border-opacity-15 lg:mt-20 md:mt-12 mt-8",
            "w-full p-8 rounded-[20px] flex flex-col gap-5"
          )}
        >
          <Order />
          <ButtonPrediction />
          <TradeSize />
          <Leverage />
          <EstEntryPrice />
          <Slippage />
          {!publicKey && (
            <div className="future-connect w-full">
              <WalletMultiButton>
                <span className="text-base items-center text-center">
                  Connect Wallet
                </span>
              </WalletMultiButton>
            </div>
          )}
          {/* <FormPredict /> */}
        </div>
      </form>
    </FormProvider>
  );
}
