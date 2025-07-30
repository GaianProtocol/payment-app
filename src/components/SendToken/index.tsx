import { Solana, Usdc, UsdStar, Usdt } from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import useSolBalance from "@/hooks/useSolBalance";
import useTokenBalanceSol from "@/hooks/useTokenBalanceSol";
import useTransferUSDC from "@/hooks/useTransferAndSign";
import { useTokenSuffix } from "@/store/tokenStore";
import { ITokenOption } from "@/types/swap.type";
import { connection } from "@/utils/config";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { TokenSelector } from "./TokenSelector";

interface SendTokenPopupProps {
  children: React.ReactNode;
}

const TokenOptions: ITokenOption[] = [
  {
    name: "SOL",
    logoURI: Solana,
    symbol: "SOL",
  },
  {
    name: "USDC",
    logoURI: Usdc,
    symbol: "USDC",
  },
  {
    name: "USD*",
    logoURI: UsdStar,
    symbol: "USD*",
  },
  {
    name: "USDT",
    logoURI: Usdt,
    symbol: "USDT",
  },
];
const SendTokenPopup: React.FC<SendTokenPopupProps> = ({ children }) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isValidRecipient, setIsValidRecipient] = useState<boolean | null>(
    null
  );
  const { onTransfer, onTransferSOL } = useTransferUSDC();
  const { balance, fetchBalance } = useSolBalance();

  const { tokens, fetchBalance: fetchBalanceToken } = useTokenBalanceSol();
  const suffix = useTokenSuffix();
  const [tokenSelected, setTokenSelected] = useState<ITokenOption>(
    TokenOptions[0]
  );
  const currentBalance = useMemo(() => {
    switch (tokenSelected.symbol) {
      case "SOL":
        return balance;
      case "USDC":
        return tokens[suffix.usdc] ?? 0;
      case "USD*":
        return tokens[suffix.usdstar] ?? 0;
      case "USDT":
        return tokens[suffix.usdt] ?? 0;
      default:
        return 0;
    }
  }, [tokens, suffix, tokenSelected, balance]);

  const getBalanceByToken = useCallback(
    (token: string) => {
      switch (token) {
        case "SOL":
          return balance;
        case "USDC":
          return tokens[suffix.usdc] ?? 0;
        case "USD*":
          return tokens[suffix.usdstar] ?? 0;
        case "USDT":
          return tokens[suffix.usdt] ?? 0;
        default:
          return 0;
      }
    },
    [tokens, suffix, balance]
  );

  const buttonText = useMemo(() => {
    const currentBalance = getBalanceByToken(tokenSelected.symbol);
    if (currentBalance < Number(amount)) {
      return "Insufficient balance";
    }

    return loading ? "Sending..." : "Send";
  }, [tokenSelected, amount, loading]);

  const isDisable = useMemo(() => {
    if (Number(amount) <= 0) {
      return true;
    }
    const currentBalance = getBalanceByToken(tokenSelected.symbol);
    if (currentBalance < Number(amount)) {
      return true;
    }
    if (loading) {
      return true;
    }

    if (!isValidRecipient) {
      return true;
    }
    return false;
  }, [amount, loading, tokenSelected, isValidRecipient]);

  const handleChangeToken = (token: ITokenOption) => {
    setTokenSelected(token);
  };
  useEffect(() => {
    const checkRecipient = async () => {
      if (recipient) {
        try {
          const pubKey = new PublicKey(recipient);
          const accountInfo = await connection.getAccountInfo(pubKey);
          setIsValidRecipient(!!accountInfo);
        } catch {
          setIsValidRecipient(false);
        }
      } else {
        setIsValidRecipient(null);
      }
    };
    checkRecipient();
  }, [recipient, connection]);

  const handleSend = useCallback(async () => {
    if (!user) {
      toast("Wallet not connected");
      return;
    }
    if (!isValidRecipient) {
      toast("Invalid recipient address");
      return;
    }
    const loadingToastId = toast.loading("Processing transaction...");
    try {
      setLoading(true);
      let tx;
      if (tokenSelected.symbol === "SOL") {
        tx = await onTransferSOL({
          amount: Number(amount),
          memo: `Sending ${amount} ${tokenSelected.name} to ${recipient}`,
          destination: recipient,
        });
        await fetchBalance();
      } else {
        tx = await onTransfer({
          amount: Number(amount),
          destination: recipient,
          memo: `Sending ${amount} ${tokenSelected.name} to ${recipient}`,
          token: tokenSelected.symbol,
        });
        await fetchBalanceToken();
      }

      if (!tx) {
        toast.error(
          "Transaction failed. Check if the connect wallet is correct and reload app!",
          {
            autoClose: 2000,
            draggable: false,
          }
        );
        return;
      }
      toast.success("Transaction successful!");
    } catch (error) {
      console.error("🚀 ~ handleContinue ~ error:", error);
      toast.error(
        "Transaction failed. Check if the connect wallet is correct and reload app!",
        {
          autoClose: 2000,
          draggable: false,
        }
      );
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  }, [
    amount,
    isValidRecipient,
    onTransfer,
    recipient,
    tokenSelected.name,
    tokenSelected.symbol,
    user,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Token</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-[#616566]">
              Recipient:{" "}
            </div>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="col-span-3 self-stretch pl-4 pr-2 py-3 h-10  rounded-lg inline-flex justify-between items-center"
            />
          </div>
          {isValidRecipient === false && (
            <p className="text-red-500 text-sm">Invalid recipient address</p>
          )}
          <div className=" flex flex-col gap-2">
            <div className="text-sm font-medium text-[#616566]">Amount: </div>
            <div className="flex items-center gap-2">
              <Input
                id="amount"
                type="number"
                min={0}
                step={0.01}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 self-stretch pl-4 pr-2 py-3 h-10 rounded-lg inline-flex justify-between items-center"
              />
              <Button
                onClick={() =>
                  setAmount(
                    currentBalance > 0 ? currentBalance.toString() : "0"
                  )
                }
                className="h-10 text-dark"
              >
                Max
              </Button>
            </div>
          </div>
          <div className=" flex flex-col gap-2">
            <div className="text-sm font-medium text-[#616566]">Token:</div>
            <TokenSelector
              selectedToken={tokenSelected}
              tokenOptions={TokenOptions.map((token) => ({
                ...token,
                balance: getBalanceByToken(token.symbol),
              }))}
              currentBalance={currentBalance}
              onSelect={handleChangeToken}
            />
          </div>
        </div>
        <Button onClick={handleSend} disabled={isDisable} className="text-dark">
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SendTokenPopup;
