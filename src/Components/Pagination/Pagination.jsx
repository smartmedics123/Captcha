import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="border-top">
      <div className="container py-4 border-top">
        <div className="custom-pagination-wrapper ">
          {/* Previous Button */}
          <button
            className="custom-pagination-btn flex justify-content-center align-items-center gap-3"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaArrowLeftLong className="icon-left" />
            <span className="d-none d-md-block">Previous</span>
          </button>

          {/* Page Numbers */}
          <ul className="custom-pagination">
            {getPageNumbers().map((page, idx) => (
              <li
                key={idx}
                className={`custom-page-item ${
                  page === currentPage
                    ? "active"
                    : page === "..."
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="custom-page-link"
                  onClick={() => typeof page === "number" && onPageChange(page)}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          {/* Next Button */}
          <button
            className="custom-pagination-btn flex justify-content-center align-items-center gap-3"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="d-none d-md-block">Next</span>
            <FaArrowRightLong className="icon-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
