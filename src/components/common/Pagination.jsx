// src/components/common/Pagination.jsx
import React from "react";
import IconChevronLeft from "../../icons/IconChevronLeft";
import IconChevronRight from "../../icons/IconChevronRight";

const Pagination = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  loading,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Page <span className="font-medium">{currentPage + 1}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 0 || loading}
          className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
            ${
              currentPage === 0 || loading
                ? "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
        >
          <IconChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages - 1 || loading}
          className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
            ${
              currentPage >= totalPages - 1 || loading
                ? "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
        >
          Next
          <IconChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
