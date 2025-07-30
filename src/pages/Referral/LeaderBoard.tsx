// components/leaderboard/leaderboard.tsx
import { Cup, Point } from "@/assets/svgs";
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
import { useUser } from "@/hooks/use-user";
import authSolApi from "@/services/authSol.service";
import { cn } from "@/utils/cn";
import { formatLargeNumber } from "@/utils/utils";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  address: string;
  commission: number;
  invitees: number;
  isCurrentUser?: boolean;
}

const ITEMS_PER_PAGE = 10;

export const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();

  const fetchLeaderboard = async () => {
    try {
      const data = await authSolApi.getLeaderboard();
      if (!data.results?.length) return;

      const dataConvert = data.results.map(
        (item: any, index: number): LeaderboardEntry => ({
          address: `${item.publicAddress.slice(
            0,
            4
          )}...${item.publicAddress.slice(-4)}`,
          rank: index + 1,
          commission: item.incomeEarned,
          invitees: item.frens,
          isCurrentUser: user
            ? item.publicAddress === user.publicAddress
            : false,
        })
      );
      setLeaderboard(dataConvert);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  // Calculate pagination data
  const totalPages = Math.ceil(leaderboard.length / ITEMS_PER_PAGE);
  const paginatedData = leaderboard.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="self-stretch p-4 md:p-6 bg-white rounded-2xl outline outline-1 outline-[#e2e8ea] flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 relative overflow-hidden">
          <img src={Cup} alt="Leaderboard icon" />
        </div>
        <div className="text-[#151b11] text-xl font-semibold">Leaderboard</div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-full rounded-lg mb-4 max-h-[500px] overflow-y-auto">
          <TableHeader className="rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#e2e8ea]">
            <TableRow className="bg-gray-100 border-none">
              <TableHead className="w-32 px-4 py-3 text-left text-[#a7acae] text-sm font-medium">
                Rank
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-[#a7acae] text-sm font-medium">
                Address
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-[#a7acae] text-sm font-medium">
                GPoints
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-[#a7acae] text-sm font-medium">
                Frens
              </TableHead>
            </TableRow>
          </TableHeader>
          <div className="h-2 border-none" />
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((item) => (
                <TableRow
                  key={item.address}
                  className={cn(
                    "border-none",
                    item.isCurrentUser ? "bg-[#effae8] rounded-2xl" : ""
                  )}
                >
                  <TableCell className="px-4 py-3 flex items-center gap-2">
                    <span className="text-[#151b11] text-sm font-semibold">
                      {item.rank}
                    </span>
                    {item.isCurrentUser && (
                      <span className="h-5 px-2 pt-0.5 bg-[#57803e] text-[#d3f4bd] text-xs font-semibold rounded">
                        You
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[#151b11] text-sm font-normal">
                    {item.address}
                  </TableCell>
                  <TableCell className="px-4 py-3 flex items-center justify-center gap-2">
                    <img src={Point} alt="Point icon" className="w-4 h-4" />
                    <span className="text-[#151b11] text-sm font-medium">
                      {formatLargeNumber(item.commission)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-[#151b11] text-sm font-normal">
                    {item.invitees}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={cn(
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              className={cn(
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
