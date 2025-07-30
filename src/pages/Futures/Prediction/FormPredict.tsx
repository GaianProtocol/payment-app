import {
  useInputPriceFuture,
  useSetInputPriceFuture,
} from "@/store/futureStore";
import { cn } from "@/utils/cn";
import { balanceDisplayer } from "@/utils/convert";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface IFormInput {
  amount: number;
  price: number;
}

const schema = yup.object().shape({
  amount: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .required()
    .typeError("Amount must be a valid number"),
  price: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue.trim() === "" ? null : value;
    })
    .required()
    .typeError("Price must be a valid number"),
});

export default function FormPredict() {
  const [price, setPrice] = [useInputPriceFuture(), useSetInputPriceFuture()];
  const [balance, setBalance] = useState(2536812);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    values: {
      amount: 0,
      price: 0,
    },
    mode: "onChange",
  });
  const errorMsg = useMemo(() => {
    const firstErrorKey = Object.keys(errors)[0] as "amount" | "price";
    return firstErrorKey ? errors[firstErrorKey]?.message : null;
  }, [errors?.price, errors?.amount]);

  const amountWatch = watch("amount") || "";
  const priceWatch = watch("price") || "";

  useEffect(() => {
    setPrice(61316);
  }, []);
  return (
    <form className="relative">
      <div className="flex flex-col gap-2.5 w-full">
        <div className="flex justify-between items-center">
          <div className="text-sm font-normal tracking-base">
            <span className="text-[#7780A1]">Avbl -</span>{" "}
            <span className="text-white">USDC</span>
          </div>
          <div className="text-[#7780A1] text-sm font-normal tracking-base">
            {balanceDisplayer(balance)}
          </div>
        </div>
        <div className="flex gap-3 px-5 rounded-2xl justify-between items-center h-14 bg-[#2F3136] border border-white border-opacity-15">
          <span className="text-base tracking-base font-normal text-white">
            Price
          </span>
          <div className="flex items-center w-full gap-3">
            <input
              {...register("price")}
              className={cn(
                "w-full text-end bg-transparent text-white",
                "focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none"
              )}
            />
            <button className="bg-[#2f3136] h-[23px] flex items-center justify-center p-2 border border-white border-opacity-15 rounded-lg">
              <span className="text-sm font-normal text-white tracking-base">
                ETH
              </span>
            </button>
          </div>
        </div>
        <div className="flex gap-3 px-5 rounded-2xl justify-between items-center h-14 bg-[#2F3136] border border-white border-opacity-15">
          <span className="text-base tracking-base font-normal text-white">
            Amount
          </span>
          <div className="flex items-center w-full gap-3">
            <input
              {...register("amount")}
              autoFocus
              className={cn(
                "w-full text-end bg-transparent text-white",
                "focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none"
              )}
            />
          </div>
        </div>
        <div className="flex w-full justify-between">
          {[25, 50, 75, 100].map((element) => (
            <button
              onClick={() => {
                setValue("amount", (element * balance) / 100);
              }}
              type="button"
              key={`select-percent-${element}`}
              className="h-10 px-4 flex items-center justify-center border border-white border-opacity-15 rounded-lg"
            >
              <span className="text-white text-sm font-normal tracking-base">
                {element}%
              </span>
            </button>
          ))}
        </div>
      </div>
      {errorMsg && (
        <div className="text-red-500 text-xs font-light text-center absolute left-1/2 -translate-x-1/2 -bottom-5">
          {errorMsg}
        </div>
      )}
    </form>
  );
}
