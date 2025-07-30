import { Button } from "@/components/ui/button";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selected: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageClick = (data: { selected: number }) => {
    onPageChange(data.selected + 1); // Convert to 1-based index
  };

  return (
    <ReactPaginate
      previousLabel={
        <Button
          variant="outline"
          size="icon"
          className="text-sm text-dark h-8 w-8 rounded-xl"
          disabled={currentPage === 1}
        >
          {"<"}
        </Button>
      }
      nextLabel={
        <Button
          variant="outline"
          className="text-sm text-dark h-8 w-8 rounded-xl"
          size="icon"
          disabled={currentPage === totalPages}
        >
          {">"}
        </Button>
      }
      breakLabel={<span className="px-2">...</span>}
      pageCount={totalPages}
      forcePage={currentPage - 1} // Adjust for 0-based index
      marginPagesDisplayed={2}
      pageRangeDisplayed={2}
      onPageChange={handlePageClick}
      containerClassName="flex items-center gap-1"
      activeClassName="bg-blue-500 text-white bg-primary"
      pageClassName="p-2 rounded-xl h-8 w-8 flex justify-center items-center text-sm border"
      pageLinkClassName=""
      breakClassName="px-2"
      previousClassName="mr-1"
      nextClassName="ml-1"
      renderOnZeroPageCount={null}
    />
  );
}
