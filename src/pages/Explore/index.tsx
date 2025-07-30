import { Usd, Usdc, UsdStar, Usdt } from "@/assets/svgs";
import { Header } from "@/components";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { Pagination } from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { SquareArrowOutUpRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Explore = () => {
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
      navigate(`${ROUTES.EXPLORE}/${id}`);
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
  const getTransactionUrl = (transactionId: string) => {
    return `https://solscan.io/tx/${transactionId}`;
  };
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
          <div className="max-w-screen-lg mx-auto py-16 px-2 w-full">
            <div className="p-4 w-full border bg-white rounded-xl">
              <div className="text-[#151b11] text-xl font-semibold mb-4">
                History
              </div>
              {!loading && (
                <>
                  {invoices && invoices.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                      <Table className="max-md:w-[800px]">
                        <TableHeader className="rounded-lg [&_tr]:border-none outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] ">
                          <TableRow>
                            <TableHead>Invoice Code</TableHead>
                            <TableHead>Amount USD</TableHead>
                            <TableHead>Amount VND</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Status Crypto</TableHead>
                            <TableHead>Status Fiat</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead className="text-end">
                              Created At
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableRow className="h-2 border-none"> </TableRow>
                        <TableBody>
                          {invoices.map((invoice) => (
                            <TableRow
                              key={invoice.InvoiceCode}
                              onClick={() => {
                                handleNavigate(invoice.ID);
                              }}
                              className="cursor-pointer"
                            >
                              <TableCell className="max-w-fit whitespace-nowrap">
                                {invoice.InvoiceCode}
                              </TableCell>

                              <TableCell className="flex items-center justify-center gap-1 p-4">
                                <img
                                  src={getLogoBySymbol(
                                    invoice.CryptoPayment.Currency
                                  )}
                                  alt=""
                                  className="w-6 h-6"
                                />
                                {invoice.TokenAmount.toLocaleString("en-US", {
                                  maximumFractionDigits: 6,
                                  minimumFractionDigits: 0,
                                })}
                              </TableCell>
                              <TableCell className="">
                                {invoice.FiatAmount.toLocaleString("en-US", {
                                  maximumFractionDigits: 6,
                                  minimumFractionDigits: 0,
                                })}
                              </TableCell>
                              <TableCell className="justify-center">
                                <div
                                  className={cn(
                                    "text-sm capitalize",
                                    invoice.Status == PAYMENT_STATUS.SUCCESS
                                      ? "p-2 py-1 text-center rounded-md text-white bg-green-500 "
                                      : "p-2 py-1 text-center rounded-md text-white bg-red-500"
                                  )}
                                >
                                  {invoice.Status === PAYMENT_STATUS.SUCCESS &&
                                    "Completed"}
                                  {invoice.Status ===
                                    PAYMENT_STATUS.AWAITING_PAYMENT &&
                                    "Processing"}
                                  {invoice.Status === PAYMENT_STATUS.FAILED &&
                                    "Failed"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  className={cn(
                                    "text-sm capitalize",
                                    invoice.StatusCrypto ==
                                      PAYMENT_STATUS.SUCCESS
                                      ? "p-2 py-1 text-center rounded-md text-white bg-green-500 "
                                      : "p-2 py-1 text-center rounded-md text-white bg-red-500"
                                  )}
                                >
                                  {invoice.StatusCrypto ===
                                    PAYMENT_STATUS.SUCCESS && "Completed"}
                                  {invoice.StatusCrypto ===
                                    PAYMENT_STATUS.AWAITING_PAYMENT &&
                                    "Processing"}
                                  {invoice.StatusCrypto ===
                                    PAYMENT_STATUS.FAILED && "Failed"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  className={cn(
                                    "text-sm capitalize",
                                    invoice.StatusFiat == PAYMENT_STATUS.SUCCESS
                                      ? "p-2 py-1 text-center rounded-md text-white bg-green-500 "
                                      : "p-2 py-1 text-center rounded-md text-white bg-red-500"
                                  )}
                                >
                                  {invoice.StatusFiat ===
                                    PAYMENT_STATUS.SUCCESS && "Completed"}
                                  {invoice.StatusFiat ===
                                    PAYMENT_STATUS.AWAITING_PAYMENT &&
                                    "Processing"}
                                  {invoice.StatusFiat ===
                                    PAYMENT_STATUS.FAILED && "Failed"}
                                </div>
                              </TableCell>

                              <TableCell className=" flex items-center">
                                <div className="max-w-[100px] truncate">
                                  {invoice.CryptoPayment.TransactionID}
                                </div>
                                {invoice.CryptoPayment.TransactionID && (
                                  <a
                                    href={getTransactionUrl(
                                      invoice.CryptoPayment.TransactionID
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <SquareArrowOutUpRight size={16} />
                                  </a>
                                )}
                              </TableCell>

                              <TableCell className="text-end whitespace-nowrap">
                                {new Date(invoice.CreatedAt).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
