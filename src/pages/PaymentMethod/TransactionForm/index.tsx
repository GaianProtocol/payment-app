"use client";

import { gUSD, Usdc, UsdStar, Usdt } from "@/assets/svgs";
import { Numpad } from "@/components/Numpad";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import useTokenBalanceSol from "@/hooks/useTokenBalanceSol";
import useTransferUSDC from "@/hooks/useTransferAndSign";
import authSolApi from "@/services/authSol.service";
import paymentService from "@/services/payment.service";
import { useTokenSuffix } from "@/store/tokenStore";
import { CurrencyLimit, IInvoice, ScanCodeProps } from "@/types/payment.type";
import { ITokenOption } from "@/types/swap.type";
import { CurrencyByCode } from "@/utils/constant";
import { calcUSDCWithFee } from "@/utils/utils";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ActionButton } from "./ActionButton";
import { AmountDisplay } from "./AmountDisplay";
import { Header } from "./Header";
import { PaymentInfo } from "./PaymentInfo";
import { TokenSelector } from "./TokenSelector";

// Main TransactionForm Component
export interface TransactionFormProps {
  qrData: ScanCodeProps;
  onBackClick: () => void;
  rawDataQR: string;
  onReScan: () => void;
}

const TokenOptions: ITokenOption[] = [
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
  {
    name: "gUSD",
    logoURI: gUSD,
    symbol: "gUSD",
  },
];

export function TransactionForm({
  qrData,
  onBackClick,
  rawDataQR,
}: TransactionFormProps) {
  const isMobile = useIsMobile();
  const { onTransfer, wallet } = useTransferUSDC();
  const { ready: walletsReady, wallets } = useSolanaWallets();
  const { ready: privyReady } = usePrivy();
  const [amount, setAmount] = useState<string>(qrData?.transactionAmount ?? "");
  const [numpadOpen, setNumpadOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const suffix = useTokenSuffix();
  const { tokens } = useTokenBalanceSol();
  const amountRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<string | null>(
    null
  );
  const [currencyLimit, setCurrencyLimit] = useState<CurrencyLimit>();

  const currencyCountry = useMemo(() => {
    const currency = CurrencyByCode[qrData?.countryCode];
    return currency ?? "";
  }, [qrData]);

  const [rateUSD, setRateUSD] = useState<number>(0);
  const [tokenSelected, setTokenSelected] = useState<ITokenOption>(
    TokenOptions[0]
  );
  const navigate = useNavigate();

  const currentBalance = useMemo(() => {
    switch (tokenSelected.symbol) {
      case "USDC":
        return tokens[suffix.usdc] ?? 0;
      case "USD*":
        return tokens[suffix.usdstar] ?? 0;
      case "USDT":
        return tokens[suffix.usdt] ?? 0;
      default:
        return 0;
    }
  }, [tokens, suffix, tokenSelected]);

  const getBalanceByToken = useCallback(
    (token: string) => {
      switch (token) {
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
    [tokens, suffix]
  );

  const isOverBalance = useMemo(() => {
    if (!amount || !rateUSD) return false;
    const amountUSDC = calcUSDCWithFee(
      Number(amount) / rateUSD,
      currencyLimit?.MinimunFee,
      currencyLimit?.TranferFee,
      currencyLimit?.FixedFee
    );

    return amountUSDC.total > currentBalance;
  }, [currentBalance, rateUSD, amount, currencyLimit]);

  const isBrowserInApp = useMemo(() => {
    const userAgent = navigator.userAgent;
    if (isMobile && /Phantom|Solflare/i.test(userAgent)) {
      return true;
    }
    return false;
  }, [isMobile]);

  const fetchProductStatus = async () => {
    try {
      const response = await authSolApi.checkProductStatus();
      if (response.productStatus.status === 0) {
        return { status: true, text: response.productStatus.text };
      } else {
        return { status: false, text: "" };
      }
    } catch (error) {
      console.log("🚀 ~ fetchProductStatus ~ error:", error);
      return { status: false, text: "" };
    }
  };
  const fetchRateUSD = async (currencyCountry: string) => {
    try {
      const response = await paymentService.getRateUSD();
      if (!response) {
        return;
      }
      const rate = response[`USDC/${currencyCountry}`];
      const limit: CurrencyLimit = response.limit[currencyCountry];
      if (!rate || !limit) {
        return;
      }
      setRateUSD(rate);
      setCurrencyLimit({
        FixedFee: limit.FixedFee,
        MaxTranfer: Number(limit.MaxTranfer ?? 0) * rate,
        MinimunFee: limit.MinimunFee,
        MinimunTranfer: Number(limit.MinimunTranfer ?? 0) * rate,
        TranferFee: limit.TranferFee,
      });
      setDestinationAddress(response.reciverAddress);
    } catch (error) {
      console.log("🚀 ~ fetchRateVNDUSD ~ error:", error);
      return 0;
    }
  };

  const handleNumpadClick = (value: string): void => {
    if (value === "DEL") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (value === "." && !amount.includes(".")) {
      setAmount((prev) => (prev === "" ? "0." : prev + "."));
    } else if (value !== ".") {
      if (Number(amount) == 0 && Number(value) == 0) return;

      setAmount((prev) => {
        if (prev === "0") {
          return value;
        }
        return prev + value;
      });
    }
    setInvoice(null);
  };

  const handleConfirm = useCallback(
    async (amount: string) => {
      if (currencyLimit) {
        if (Number(amount) < currencyLimit?.MinimunTranfer) {
          toast.error(
            `Minimum amount is ${currencyLimit?.MinimunTranfer.toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }
            )} ${currencyCountry}`
          );
          return;
        }
        if (Number(amount) > currencyLimit?.MaxTranfer) {
          toast.error(
            `Maximum amount is ${currencyLimit?.MaxTranfer.toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }
            )} ${currencyCountry}`
          );
          return;
        }
      }

      if (!destinationAddress) {
        return;
      }

      if (!walletsReady || !privyReady || !wallet) {
        toast.error(
          "Unable to connect wallet. Please reconnect your wallet and try again."
        );
        return;
      }
      const loadingToastId = toast.loading("Processing transaction...");
      try {
        setLoading(true);
        const showMaintenance = await fetchProductStatus();
        if (showMaintenance.status) {
          toast.error(showMaintenance.text ?? "Product is under maintenance");
          return;
        }
        const result = await paymentService.createInvoice(
          rawDataQR,
          parseFloat(amount),
          tokenSelected.symbol,
          qrData.countryCode
        );
        if (!result.invoice && result?.message) {
          toast.error(result?.message, {
            autoClose: 3000,
            draggable: false,
          });
          return;
        }
        const invoice = result.invoice as IInvoice;
        setInvoice(result.invoice);
        const tx = await onTransfer({
          amount: invoice.TokenAmount,
          destination: destinationAddress,
          memo: invoice.InvoiceCode,
          token: tokenSelected.symbol,
        });
        if (!tx) {
          toast.error(
            !isBrowserInApp
              ? "Transaction failed! Please try again using the in-app browser of your wallet to ensure the transaction is processed."
              : "Transaction failed. Check if the connect wallet is correct and reload app!",
            {
              autoClose: isBrowserInApp ? 2000 : 5000,
              draggable: false,
            }
          );
          toast.dismiss(loadingToastId);
          return;
        }
        await updateTx(tx, invoice.ID, invoice.InvoiceCode);
        toast.success("Transaction successful!");
      } catch (error) {
        console.log("🚀 ~ handleConfirm ~ error:", error);
        toast.error(
          !isBrowserInApp
            ? "Transaction failed! Please try again using the in-app browser of your wallet to ensure the transaction is processed."
            : "Transaction failed. Check if the connect wallet is correct and reload app!",
          {
            autoClose: isBrowserInApp ? 2000 : 5000,
            draggable: false,
          }
        );
        toast.dismiss(loadingToastId);
      } finally {
        toast.dismiss(loadingToastId);
        setLoading(false);
      }
    },
    [
      isBrowserInApp,
      isOverBalance,
      destinationAddress,
      walletsReady,
      privyReady,
      wallet,
      tokenSelected,
      qrData,
      currencyLimit,
      wallets,
    ]
  );

  const updateTx = async (
    tx: string,
    invoiceId: number,
    invoiceCode: string
  ) => {
    try {
      const result = await paymentService.updateCrytoTx(
        tx,
        invoiceId,
        invoiceCode
      );
      if (result && result.invoice) {
        navigate(`/invoice/${invoiceId}`);
        return;
      }
    } catch (error) {
      console.log("🚀 ~ updateTx ~ error:", error);
    }
  };

  const handleOpenNumberpad = () => {
    setNumpadOpen(true);
  };

  const handleCloseNumberpad = () => {
    setNumpadOpen(false);
  };

  const handleClearInput = useCallback(() => {
    // setAmount("");
    setInvoice(null);
  }, [onBackClick]);

  const handleChangeToken = useCallback(
    (token: ITokenOption) => {
      setTokenSelected(token);
      if (invoice) {
        handleClearInput();
      }
    },
    [invoice]
  );

  useEffect(() => {
    if (currencyCountry) fetchRateUSD(currencyCountry);
  }, [currencyCountry]);

  return (
    <div className="fixed bottom-0 w-screen h-[100dvh] z-[200] bg-white overflow-y-auto">
      <div className="mx-auto p-4 flex flex-col gap-8">
        <Header onBackClick={onBackClick} />
        <div className="flex flex-col items-center gap-4 w-full">
          <PaymentInfo
            paymentMethod={qrData.paymentMethod}
            bankName={qrData.bankName}
            bankCode={qrData.bankCode}
            accountNumber={qrData.accountNumber}
            beneficiaryName={qrData.beneficiaryName}
          />
          <AmountDisplay
            amount={amount}
            tokenSelected={tokenSelected}
            onClick={handleOpenNumberpad}
            isOverLimit={isOverBalance}
            rateUSD={rateUSD}
            amountRef={amountRef}
            currencyCountry={currencyCountry}
            currencyLimit={currencyLimit}
          />
          <TokenSelector
            selectedToken={tokenSelected}
            tokenOptions={TokenOptions.map((token) => ({
              ...token,
              balance: getBalanceByToken(token.symbol),
            }))}
            currentBalance={currentBalance}
            onSelect={handleChangeToken}
          />
          {!numpadOpen && (
            <ActionButton
              amount={amount}
              loading={loading}
              isOverBalance={isOverBalance}
              handleConfirm={handleConfirm}
              handleClearInput={handleClearInput}
              countryCode={qrData.countryCode}
              currencyLimit={currencyLimit}
            />
          )}
        </div>
        <Drawer open={numpadOpen} onOpenChange={handleCloseNumberpad}>
          <DrawerContent className="rounded-t-lg border-t p-0">
            <Numpad
              onKeyPress={handleNumpadClick}
              actionButton={
                <ActionButton
                  amount={amount}
                  loading={loading}
                  isOverBalance={isOverBalance}
                  handleConfirm={handleConfirm}
                  handleClearInput={handleClearInput}
                  className="flex-1 rounded-none"
                  countryCode={qrData.countryCode}
                  currencyLimit={currencyLimit}
                />
              }
            />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
