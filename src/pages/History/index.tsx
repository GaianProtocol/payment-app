import { ArrowUp, Usd, Usdc, UsdStar, Usdt } from "@/assets/svgs";
import { Header } from "@/components";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { Pagination } from "@/components/Pagination";
import { useUser } from "@/hooks/use-user";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/paths.route";
import authSolApi from "@/services/authSol.service";
import paymentService from "@/services/payment.service";
import { IInvoice } from "@/types/payment.type";
import { PAYMENT_STATUS } from "@/utils/constant";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const History = () => {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const fetchInvoices = async (offset: number, limit: number) => {
    try {
      setLoading(true);
      const result = await paymentService.getInvoiceHistories(offset, limit);
      if (result) {
        setInvoices(result.invoices);
        setTotal(result.total);
      }
    } catch (error) {
      console.log("🚀 ~ fetchInvoices ~ error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const isAdmin = await authSolApi.checkAdminRole();
      setIsAdmin(isAdmin);
    } catch (error) {
      console.log("🚀 ~ checkAuth ~ error:", error);
    }
  };

  const handleNavigate = useCallback(
    (id: number) => {
      if (!user) return;
      navigate(`${ROUTES.HISTORY}/${id}`);
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      fetchInvoices(offset, limit);
      checkAuth();
    } else {
      setInvoices([]);
      setTotal(0);
      setIsAdmin(false);
    }
  }, [user, page, limit]);

  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

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

  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="max-w-screen-sm mx-auto py-16 max-md:pt-6 px-2 w-full">
            <div className="p-4 w-full border bg-white rounded-xl">
              <div className="text-[#151b11] text-xl font-semibold mb-4 pl-2 flex justify-between">
                Transaction History{" "}
                {isAdmin && (
                  <div
                    className="text-sm text-dark hover:underline cursor-pointer"
                    onClick={() => navigate(ROUTES.EXPLORE)}
                  >
                    Admin Explore
                  </div>
                )}
              </div>
              {!loading && (
                <>
                  {invoices && invoices.length > 0 ? (
                    <div className="w-full overflow-x-auto max-w-screen-sm">
                      <div className="flex flex-col gap-1">
                        {invoices.map((invoice) => (
                          <div
                            key={invoice.ID}
                            className="flex items-center gap-2 cursor-pointer hover:bg-primary/20 p-2 rounded-lg"
                            onClick={() => handleNavigate(invoice.ID)}
                          >
                            <div className="p-2 bg-primary/40 rounded-full">
                              <img src={ArrowUp} alt="" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm ">Sent </div>
                              <div className="text-xs text-black/30 flex flex-wrap">
                                {invoice.InvoiceCode}  {" "}
                                <br className="md:hidden" />
                                {new Date(invoice.CreatedAt).toLocaleTimeString(
                                  "en-GB",
                                  {
                                    minute: "2-digit",
                                    hour: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              <div className="items-center text-sm text-end flex gap-1 justify-end">
                                <img
                                  src={getLogoBySymbol(
                                    invoice.CryptoPayment.Currency
                                  )}
                                  className="w-4 h-4"
                                  alt=""
                                />
                                {invoice.TokenAmount.toLocaleString("en-US", {
                                  maximumFractionDigits: 4,
                                  minimumFractionDigits: 0,
                                })}{" "}
                              </div>
                              <div
                                className={cn(
                                  "text-sm capitalize",
                                  invoice.Status == PAYMENT_STATUS.SUCCESS &&
                                    "text-green-500",
                                  invoice.Status ==
                                    PAYMENT_STATUS.AWAITING_PAYMENT &&
                                    "text-yellow-500",
                                  invoice.Status == PAYMENT_STATUS.FAILED &&
                                    "text-red-500",
                                  invoice.Status == PAYMENT_STATUS.REFUND &&
                                    "text-yellow-500",
                                  invoice.Status == PAYMENT_STATUS.REFUNDED &&
                                    "text-blue-500"
                                )}
                              >
                                {invoice.Status === PAYMENT_STATUS.SUCCESS &&
                                  "Completed"}
                                {invoice.Status ===
                                  PAYMENT_STATUS.AWAITING_PAYMENT &&
                                  "Processing"}
                                {invoice.Status === PAYMENT_STATUS.FAILED &&
                                  "Failed"}
                                {invoice.Status === PAYMENT_STATUS.REFUND &&
                                  "Refunding"}
                                {invoice.Status === PAYMENT_STATUS.REFUNDED &&
                                  "Refunded"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                          <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) =>
                              setSearchParams({
                                page: newPage.toString(),
                                limit: limit.toString(),
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No invoices found.
                    </p>
                  )}
                </>
              )}
              {loading && (
                <div className="text-center">
                  <Loading />
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
