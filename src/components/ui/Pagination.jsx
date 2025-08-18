import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = false,
  siblingCount = 1,
}) => {
  // Generate page numbers to show
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last

    // Case 1: Total pages less than total page numbers we want to show
    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        totalPages
      );

      // Add dots if needed before the left sibling
      if (leftSiblingIndex > 2) {
        pageNumbers.push("...");
      }

      // Add page numbers around current page
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i);
        }
      }

      // Add dots if needed after the right sibling
      if (rightSiblingIndex < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center">
      <nav
        className="inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        {/* Previous page button */}
        <button
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50"
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* First page button (optional) */}
        {showFirstLast && currentPage > siblingCount + 2 && (
          <>
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {currentPage > siblingCount + 3 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}
          </>
        )}

        {/* Page number buttons */}
        {pageNumbers.map((pageNumber, index) => (
          <React.Fragment key={index}>
            {pageNumber === "..." ? (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            ) : (
              <button
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  pageNumber === currentPage
                    ? "z-10 bg-cyan-50 border-cyan-500 text-cyan-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() =>
                  pageNumber !== currentPage && onPageChange(pageNumber)
                }
                aria-current={pageNumber === currentPage ? "page" : undefined}
              >
                {pageNumber}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Last page button (optional) */}
        {showFirstLast && currentPage < totalPages - siblingCount - 1 && (
          <>
            {currentPage < totalPages - siblingCount - 2 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next page button */}
        <button
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50"
          }`}
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <FiChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
