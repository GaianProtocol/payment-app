import { SpinIcon } from "@/assets/svgs";
import { Header } from "@/components";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { ROUTES } from "@/routes/paths.route";
import spinService from "@/services/spin.service";
import { IReward } from "@/types/spin.type";
import { ChevronLeft, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface RewardPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

function RewardPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: RewardPaginationProps) {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export const Reward = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function loadRewards() {
      try {
        const data = await spinService.getReward();

        setRewards(data);
        setIsLoading(false);
      } catch {
        setHasError(true);
        setIsLoading(false);
      }
    }
    loadRewards();
  }, []);

  const totalPages = Math.ceil(rewards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const displayedRewards = rewards.slice(startIndex, endIndex);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="flex flex-col w-full px-2.5 md:px-[30px] py-16 max-md:pt-2 max-w-screen-md mx-auto">
            <div className="relative  w-full text-center text-base font-semibold py-3">
              <div
                onClick={() => navigate(ROUTES.SPIN)}
                className="absolute left-0 text-primary-dark flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft color="#57803E" className="w-5 h-5" /> Back
              </div>
              Reward History
            </div>
            {isLoading ? (
              <div className="text-center py-6">Loading rewards...</div>
            ) : hasError ? (
              <div className="text-center py-6 text-red-500">
                Failed to load rewards. Please try again.
              </div>
            ) : rewards.length === 0 ? (
              <div className="text-center py-6 border bg-white rounded-xl">
                No rewards found.
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <div className=" mx-auto  w-full">
                    <div className="p-4 w-full border bg-white rounded-xl">
                      <Table className="max-w-screen-md bg-white">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reward</TableHead>
                            <TableHead>Voucher Code</TableHead>
                            <TableHead>Voucher PIN</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-end">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedRewards.map((reward) => (
                            <TableRow key={reward.id}>
                              <TableCell>{reward.reward}</TableCell>

                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{reward.code}</span>
                                  <Copy
                                    className="text-primary-dark cursor-pointer"
                                    size={16}
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        reward.code
                                      );
                                      toast.success("Copied to clipboard");
                                    }}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{reward.pin}</span>
                                  <Copy
                                    className="text-primary-dark cursor-pointer"
                                    size={16}
                                    onClick={() => {
                                      navigator.clipboard.writeText(reward.pin);
                                      toast.success("Copied to clipboard");
                                    }}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(reward.expiredAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </TableCell>
                              <TableCell className="justify-end flex">
                                <Button
                                  disabled={reward.status === 0}
                                  onClick={() => {
                                    window.open(reward.extendLink, "_blank");
                                  }}
                                  className="px-3 bg-primary-dark py-2 rounded-lg inline-flex justify-start items-center gap-1"
                                >
                                  <div className="justify-start text-white text-sm font-semibold leading-tight">
                                    Use Voucher
                                  </div>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <RewardPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  </div>
                </div>

                <div className="block md:hidden ">
                  <div className="space-y-4">
                    {displayedRewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="w-full max-w-md mx-auto pl-3 pr-4 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#e7e9ea] flex flex-col justify-end items-end gap-5"
                      >
                        <div className="self-stretch inline-flex justify-between items-center">
                          <div className="flex justify-start items-center gap-3 flex-1">
                            <div className="w-14 h-14 relative bg-[#e6fed7] rounded-xl overflow-hidden">
                              <img
                                className="w-10 h-10 left-[9.23px] top-[9.10px] absolute"
                                src={SpinIcon}
                                alt="Reward icon"
                              />
                            </div>
                            <div className="inline-flex flex-col justify-center items-start gap-0.5 flex-1">
                              <div className="justify-start text-[#151b11] text-base font-semibold leading-normal">
                                {reward.code}
                              </div>
                              <div className="justify-start text-[#151b11]/80 text-xs ">
                                {reward.reward}
                              </div>
                              <div className="justify-start text-[#acadae] text-sm font-normal leading-tight">
                                {new Date(reward.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="inline-flex flex-col justify-end items-end gap-2">
                            <div className="justify-start text-[#646566] text-xs font-normal leading-none">
                              Pin Unlock Voucher
                            </div>
                            <div className="inline-flex justify-center items-center gap-2">
                              <div className="justify-start text-[#151b11] text-lg font-semibold">
                                {reward.pin}
                              </div>
                              <Copy
                                size={16}
                                onClick={() => {
                                  navigator.clipboard.writeText(reward.pin);
                                  toast.success("Copied to clipboard");
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          disabled={reward.status === 0}
                          onClick={() => {
                            window.open(reward.extendLink, "_blank");
                          }}
                          className="px-3 bg-primary-dark py-2 rounded-lg inline-flex justify-start items-center gap-1"
                        >
                          <div className="justify-start text-white text-sm font-semibold leading-tight">
                            Use Voucher
                          </div>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <RewardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
};
