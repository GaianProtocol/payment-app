"use client";

import TokenBg from "@/assets/images/token-bg.svg";
import VietQR from "@/assets/images/viet-qr.png";
import { Scan } from "@/assets/svgs";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { QRScanner } from "@/components/qr-scanner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { ROUTES } from "@/routes/paths.route";
import paymentService from "@/services/payment.service";
import { QRInfo, ScanCodeProps } from "@/types/payment.type";
import { cn } from "@/utils/cn";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TransactionForm } from "../TransactionForm";

// type PaymentPhase = (typeof PAYMENT_PHASES)[number];

export const ScanCode = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [qrResult, setQrResult] = useState<ScanCodeProps | null>(null);
  const [qrRawData, setQrRawData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleScan = useCallback(async (data: string | null) => {
    if (data) {
      setQrRawData(data);
      await fetchDataFromResult(data);
      setShowScanner(false);
    }
  }, []);

  const handleUpdateUrl = useCallback(async (data: string | null) => {
    if (data) {
      const newQuery = new URLSearchParams({ data }).toString();
      navigate(ROUTES.SCAN_QR + `?${newQuery}`, {
        replace: true,
      });
    }
  }, []);

  const fetchDataFromResult = useCallback(async (data: string) => {
    setLoading(true);
    try {
      const result = await paymentService.fetchInfoQR(data);
      const resultData: QRInfo = result.info;

      if (!resultData || !resultData.success) {
        toast.error("This QR code is not supported. Please try another code.");
        navigate(ROUTES.SCAN_QR, {
          replace: true,
        });
        setLoading(false);
        return;
      }

      setQrResult({
        paymentMethod: resultData.data.qrType ?? "vietqr",
        bankName: resultData.data.bankName ?? "",
        bankCode: resultData.data.bankCode ?? "",
        accountNumber: resultData.data.bankAccountNumber ?? "",
        beneficiaryName: resultData.data.recipientName ?? "",
        transactionAmount: String(resultData.data.amount ?? ""),
        countryCode: resultData.data.countryCode ?? "VN",
      });
    } catch (error) {
      console.log("🚀 ~ fetchDataFromResult ~ error:", error);
      toast.error("This QR code is not supported. Please try another code.");
      navigate(ROUTES.SCAN_QR, {
        replace: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleError = useCallback((error: any) => {
    console.error("QR scan error:", error);
    setShowScanner(false);
  }, []);

  const handleScanQR = useCallback(async () => {
    if (!user) {
      document.getElementById("header-connect")?.click();
      return;
    }
    setShowScanner(true);
  }, [user]);

  const handleReScanQR = () => {
    setShowScanner(true);
    setQrResult(null);
    setQrRawData(null);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataFromUrl = urlParams.get("data");
    if (dataFromUrl) {
      handleScan(dataFromUrl);
    }
  }, []);

  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div
            className={cn(
              "bg-gradient-to-b flex-1 relative from-[#E1F8D3] to-white max-w-[674px]  w-full flex mx-auto flex-col items-end justify-center gap-8 px-2.5 md:px-[30px] pb-12"
            )}
          >
            <div>
              <img
                src={TokenBg}
                alt="Background token"
                className="absolute top-16 left-1/2 -translate-x-1/2"
              />
            </div>
            {/* <ConnectButton className="bg-white" /> */}
            {/* <SpinBanner /> */}
            <div className="self-stretch relative z-[1] px-2 inline-flex flex-col justify-center items-center gap-12">
              <div className="self-stretch flex flex-col justify-center items-center gap-6">
                {/* <div className="flex flex-col justify-center items-center gap-2.5">
                  <img
                    src={LogoSVG}
                    className="h-[37px] cursor-pointer"
                    alt="Logo"
                  />
                </div> */}
                <div className="self-stretch justify-center text-center text-primary-dark text-4xl font-semibold">
                  Scan Bank QR <br />
                  Pay By Crypto
                </div>
              </div>
              <Button
                id="scan-qr-button"
                disabled={loading}
                onClick={handleScanQR}
                className="self-stretch p-4 bg-primary-darker rounded-full inline-flex justify-center items-center gap-2"
              >
                {user ? (
                  <div className="flex items-center gap-2">
                    <img src={Scan} alt="Scan QR Icon" />
                    <div className="justify-start text-primary-light text-base font-semibold leading-normal">
                      Scan QR Code
                    </div>
                  </div>
                ) : (
                  <div className="justify-start text-primary-light text-base font-semibold leading-normal">
                    Connect Wallet
                  </div>
                )}
              </Button>
              <div className="flex flex-col justify-start items-center gap-5">
                <div className="justify-start text-text-sub-600 text-sm font-medium leading-tight">
                  Supported QR
                </div>
                <div className="w-28 h-10 relative">
                  <img
                    className="w-28 h-10 left-0 top-0 absolute"
                    src={VietQR}
                    alt="Supported QR"
                  />
                </div>
              </div>
            </div>
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>

      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onError={handleError}
          onClose={() => setShowScanner(false)}
        />
      )}
      {qrResult && qrRawData && user && (
        <TransactionForm
          onBackClick={() => setQrResult(null)}
          onReScan={handleReScanQR}
          qrData={{
            ...qrResult,
            transactionAmount: qrResult.transactionAmount.replace(/,/g, ""),
          }}
          rawDataQR={qrRawData}
        />
      )}
    </PageLayout>
  );
};

export default ScanCode;
