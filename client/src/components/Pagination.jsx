import React from "react";

const Pagination = ({
  pageCount,
  page,
  handlePrevPageBtn,
  handleNextPageBtn,
  setPage,
}) => {
  // Function to generate an array of page numbers around the current page
  const getPageRange = () => {
    const maxPagesToShow = 5;
    const range = [];

    // Start page number
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2));

    // End page number
    let end = Math.min(pageCount, start + maxPagesToShow - 1);

    // If there are fewer pages than maxPagesToShow, adjust the start
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <nav className="flex justify-center mt-4">
      <ul className="pagination">
        <li>
          <button
            className={`pagination-button ${
              page === 1 ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={handlePrevPageBtn}
            disabled={page === 1}
          >
            Prev
          </button>
        </li>
        {getPageRange().map((pageNumber, index) => (
          <li key={index}>
            <button
              className={`pagination-button ${
                page === pageNumber ? "active" : ""
              }`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        {page > 1 && (
          <li>
            <span className="pagination-ellipsis">...</span>
          </li>
        )}
        {page < pageCount && (
          <li>
            <span className="pagination-ellipsis">...</span>
          </li>
        )}
        <li>
          <button
            className={`pagination-button ${
              page === pageCount ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={handleNextPageBtn}
            disabled={page === pageCount}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
