"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CustomPagination = ({ pagination, handlePageChange }) => {

  const { currentPage, resultsPerPage, totalResults, totalPages } = pagination;

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, totalResults);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-4 py-2">
      <div className="text-sm text-muted-foreground w-full">
        {`Showing appointments from ${startIndex + 1} to ${endIndex} of ${totalResults}`}
      </div>
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className={currentPage === page? "bg-blue-600 text-white hover:bg-blue-700": "hover:bg-gray-300"}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages? "pointer-events-none opacity-50": "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
