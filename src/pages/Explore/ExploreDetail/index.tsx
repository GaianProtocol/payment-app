import VietQR from "@/assets/images/viet-qr.png";
import { Usd, Usdc, UsdStar, Usdt } from "@/assets/svgs";
import { Header } from "@/components";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import authSolApi from "@/services/authSol.service";
import paymentService from "@/services/payment.service";
import { IInvoice } from "@/types/payment.type";
import { cn } from "@/utils/cn";
import { ChevronLeft, SquareArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@/hooks/use-user";
import { ROUTES } from "@/routes/paths.route";

interface RowFieldProps {
  label: string;
  value: React.ReactNode;
  extra?: React.ReactNode;
}

function RowField({ label, value, extra }: RowFieldProps) {
  return (
    <div
      className={cn(
        "self-stretch py-3 inline-flex justify-between items-center"
      )}
    >
      <div className="text-center text-[#616566] text-sm font-medium leading-tight">
        {label}
      </div>
      {extra ? (
        <div className="flex-1 flex justify-end items-center gap-2">
          <div className="text-right text-[#1b1b1b] text-sm font-medium">
            {value}
          </div>
          {extra}
        </div>
      ) : (
        <div className="text-right text-[#1b1b1b] text-sm font-medium leading-tight">
          {value}
        </div>
      )}
    </div>
  );
}

export const ExploreDetail = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [qrCodeImg, setQRCodeImg] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const isAdmin = await authSolApi.checkAdminRole();
      setIsAdmin(isAdmin);
    } catch (error) {
      console.log("🚀 ~ checkAuth ~ error:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const result = await paymentService.getInvoice(Number(id));
      if (result) {
        setInvoice(result.invoice);
        setQRCodeImg(result.qrcodeImg);
      } else {
        setInvoice(null);
        setQRCodeImg(null);
      }
    } catch (error) {
      console.log("🚀 ~ fetchInvoice ~ error:", error);
    }
  };

  const handleSubmitConfirm = async () => {
    try {
      const result = await paymentService.updateFiatProof(Number(id));
      if (result) {
        await fetchInvoice();
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (user) {
      checkAuth();
    } else {
      navigate(ROUTES.HISTORY);
    }
    fetchInvoice();
  }, [user]);

  const getLogoBySymbol = (symbol: string) => {
    switch (symbol) {
      case "USDT":
        return Usdt;
      case "USDC":
        return Usdc;
      case "USDStar":
        return UsdStar;
      default:
        return Usd;
    }
  };

  const invoiceFields = [
    { label: "Invoice Code", value: invoice?.InvoiceCode },
    {
      label: "Amount VND",
      value: invoice ? (
        <div>
          {invoice.FiatAmount.toLocaleString("en-US", {
            maximumFractionDigits: 6,
            minimumFractionDigits: 0,
          })}{" "}
          VND
        </div>
      ) : (
        ""
      ),
    },
    {
      label: "Amount USD",
      value: invoice ? (
        <div className="flex items-center gap-1">
          <img
            src={getLogoBySymbol(invoice.CryptoPayment?.Currency || "")}
            alt=""
            className="w-6 h-6"
          />
          {invoice.TokenAmount.toLocaleString("en-US", {
            maximumFractionDigits: 6,
            minimumFractionDigits: 0,
          })}
        </div>
      ) : (
        ""
      ),
    },
    {
      label: "Status",
      value: invoice ? (
        <div
          className={cn(
            "w-fit",
            invoice.Status === "Pending"
              ? "p-2 py-1 rounded-md text-white bg-red-500"
              : "p-2 py-1 rounded-md text-white bg-green-500"
          )}
        >
          {invoice.Status}
        </div>
      ) : (
        ""
      ),
    },
    {
      label: "Status Crypto",
      value: invoice ? (
        <div
          className={cn(
            "w-fit mx-auto",
            invoice.StatusCrypto === "PendingUSDC"
              ? "p-2 py-1 rounded-md text-white bg-red-500"
              : "p-2 py-1 rounded-md text-white bg-green-500",
            !invoice.StatusCrypto && "invisible"
          )}
        >
          {invoice.StatusCrypto === "PendingUSDC" ? "Pending" : "Success"}
        </div>
      ) : (
        ""
      ),
    },
    {
      label: "Status Fiat",
      value: invoice ? (
        <div
          className={cn(
            "w-fit",
            invoice.StatusFiat === "Pending"
              ? "p-2 py-1 rounded-md text-white bg-red-500"
              : "p-2 py-1 rounded-md text-white bg-green-500",
            !invoice.StatusFiat && "invisible"
          )}
        >
          {invoice.StatusFiat === "Pending" ? "Pending" : "Success"}
        </div>
      ) : (
        ""
      ),
    },
    {
      label: "Created At",
      value: invoice
        ? new Date(invoice.CreatedAt).toLocaleString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    },
  ];

  const adminFields = isAdmin
    ? [
        {
          label: "Payment Method",
          value: invoice?.QRCode.IsVietQR ? (
            <img src={VietQR} alt="VietQR" className="w-14 h-5" />
          ) : (
            invoice?.QRCode.IsVietQR
          ),
        },
        { label: "Recipient", value: invoice?.QRCode.MerchantName },
        { label: "Bank", value: invoice?.QRCode.BankName },
        {
          label: "Beneficiary account number",
          value: invoice?.QRCode.BankAccountNumber,
        },
      ]
    : [];

  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="max-w-screen-lg mx-auto py-16 px-2 max-md:w-full">
            <div className="p-4 w-full border bg-white rounded-xl md:min-w-[700px] flex flex-col gap-4">
              <div className="text-[#151b11] text-xl font-semibold mb-4 flex items-center gap-2">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(ROUTES.HISTORY)}
                >
                  <ChevronLeft />
                </div>{" "}
                History Detail
              </div>
              {invoice && (
                <div className="border p-4 rounded-xl">
                  <div className="border p-3 w-fit rounded-lg font-bold">
                    INVOICE INFO
                  </div>
                  <div className="mt-4 w-full justify-between items-center flex flex-col px-2">
                    {invoiceFields.map((field, index) => (
                      <RowField
                        key={index}
                        label={field.label}
                        value={field.value}
                      />
                    ))}
                    {adminFields.map((field, index) => (
                      <RowField
                        key={`admin-${index}`}
                        label={field.label}
                        value={field.value}
                      />
                    ))}
                    {isAdmin && qrCodeImg && (
                      <div
                        className={cn(
                          "self-stretch py-3 inline-flex justify-between  flex-col"
                        )}
                      >
                        <div className="text-start text-[#616566] text-sm font-medium leading-tight">
                          QR Image
                        </div>
                        <div className="text-right text-[#1b1b1b] text-sm font-medium leading-tight">
                          <img
                            src={qrCodeImg}
                            alt=""
                            className="mx-auto max-w-[300px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* {invoice?.Payments &&
                invoice.Payments.map((payment) => {
                  const isCrypto = payment.PaymentType === "USDC";
                  return (
                    <div
                      key={payment.TransactionID}
                      className="border p-4 rounded-xl"
                    >
                      <div className="border p-3 w-fit rounded-lg font-bold">
                        {isCrypto ? "USD TRANSACTION" : "VND TRANSACTION"}
                      </div>
                      <div className="mt-4 w-full justify-between items-center flex flex-col px-2">
                        <RowField
                          label={"Transaction ID"}
                          value={
                            <a
                              href={
                                isCrypto
                                  ? `https://solscan.io/tx/${payment.TransactionID}`
                                  : ``
                              }
                              target="_blank"
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              {`${payment.TransactionID.slice(
                                0,
                                6
                              )}...${payment.TransactionID.slice(-6)}`}
                              {isCrypto && (
                                <SquareArrowUpRight size={16} color="#000000" />
                              )}
                            </a>
                          }
                        />
                        <RowField
                          label={"Amount"}
                          value={payment.Amount.toLocaleString("en-US", {
                            maximumFractionDigits: 6,
                            minimumFractionDigits: 0,
                          })}
                        />
                        <RowField label={"Currency"} value={payment.Currency} />
                        <RowField
                          label={"Checked Count"}
                          value={payment.CheckCount}
                        />
                        <RowField
                          label={"Status"}
                          value={
                            <div
                              className={cn(
                                "w-fit",
                                payment.Status === "Pending"
                                  ? "p-2 py-1 rounded-md text-white bg-red-500"
                                  : "p-2 py-1 rounded-md text-white bg-green-500"
                              )}
                            >
                              {payment.Status}
                            </div>
                          }
                        />
                        <RowField
                          label={"Created At"}
                          value={new Date(payment.CreatedAt).toLocaleString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        />
                        {!isCrypto && payment.Status === "Pending" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="capitalize text-dark">
                                submit confirm fiat paid
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. You will not be
                                  able to revert this.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleSubmitConfirm}
                                  className="text-dark"
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  );
                })} */}

              {invoice?.CryptoPayment && (
                <div className="border p-4 rounded-xl">
                  <div className="border p-3 w-fit rounded-lg font-bold">
                    USD TRANSACTION
                  </div>
                  <div className="mt-4 w-full justify-between items-center flex flex-col px-2">
                    <RowField
                      label={"Transaction ID"}
                      value={
                        <a
                          href={`https://solscan.io/tx/${invoice?.CryptoPayment.TransactionID}`}
                          target="_blank"
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          {`${invoice?.CryptoPayment.TransactionID.slice(
                            0,
                            6
                          )}...${invoice?.CryptoPayment.TransactionID.slice(
                            -6
                          )}`}
                          <SquareArrowUpRight size={16} color="#000000" />
                        </a>
                      }
                    />
                    <RowField
                      label={"Amount"}
                      value={invoice?.TokenAmount.toLocaleString("en-US", {
                        maximumFractionDigits: 6,
                        minimumFractionDigits: 0,
                      })}
                    />
                    <RowField
                      label={"Currency"}
                      value={invoice.CryptoPayment.Currency}
                    />
                    <RowField
                      label={"Checked Count"}
                      value={invoice.CryptoPayment.CheckCount}
                    />
                    <RowField
                      label={"Status"}
                      value={
                        <div
                          className={cn(
                            "w-fit",
                            invoice.CryptoPayment.Status === "Pending"
                              ? "p-2 py-1 rounded-md text-white bg-red-500"
                              : "p-2 py-1 rounded-md text-white bg-green-500"
                          )}
                        >
                          {invoice.CryptoPayment.Status}
                        </div>
                      }
                    />
                    <RowField
                      label={"Created At"}
                      value={new Date(
                        invoice.CryptoPayment.CreatedAt
                      ).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  </div>
                </div>
              )}
              {invoice?.BankPayment && (
                <div
                  key={invoice.BankPayment.TransactionID}
                  className="border p-4 rounded-xl"
                >
                  <div className="border p-3 w-fit rounded-lg font-bold">
                    VND TRANSACTION
                  </div>
                  <div className="mt-4 w-full justify-between items-center flex flex-col px-2">
                    <RowField
                      label={"Transaction ID"}
                      value={
                        <a
                          href={``}
                          target="_blank"
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          {`${invoice.BankPayment.TransactionID.slice(
                            0,
                            6
                          )}...${invoice.BankPayment.TransactionID.slice(-6)}`}
                        </a>
                      }
                    />
                    <RowField
                      label={"Amount"}
                      value={invoice.BankPayment.Amount.toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 6,
                          minimumFractionDigits: 0,
                        }
                      )}
                    />
                    <RowField
                      label={"Currency"}
                      value={invoice.BankPayment.Currency}
                    />
                    <RowField
                      label={"Checked Count"}
                      value={invoice.BankPayment.CheckCount}
                    />
                    <RowField
                      label={"Status"}
                      value={
                        <div
                          className={cn(
                            "w-fit",
                            invoice.BankPayment.Status === "Pending"
                              ? "p-2 py-1 rounded-md text-white bg-red-500"
                              : "p-2 py-1 rounded-md text-white bg-green-500"
                          )}
                        >
                          {invoice.BankPayment.Status}
                        </div>
                      }
                    />
                    <RowField
                      label={"Created At"}
                      value={new Date(
                        invoice.BankPayment.CreatedAt
                      ).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                    {invoice.BankPayment.Status === "Pending" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="capitalize text-dark">
                            submit confirm fiat paid
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. You will not be able
                              to revert this.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleSubmitConfirm}
                              className="text-dark"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              )}
              {!invoice?.BankPayment && isAdmin && (
                <div className="border p-4 rounded-xl">
                  <div className="border p-3 w-fit rounded-lg font-bold">
                    VND TRANSACTION
                  </div>
                  <div className="mt-4 w-full justify-between items-center flex flex-col px-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="capitalize text-dark">
                          submit confirm fiat paid
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. You will not be able
                            to revert this.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleSubmitConfirm}
                            className="text-dark"
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
};
