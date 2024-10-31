import React, { useMemo, useState } from "react";

function Pagination() {
  const [page, setPage] = useState<number[]>([1, 2, 3]);
  const [selectedPage, setSelectedPage] = useState<number>(1)

  const handleNextPage = () => {
    const newPage = page.map((item) => item + 3)
    setPage(newPage)
  }
  
  const handlePreviousPage = () => {
    if (page[0] - 3 > 0) {
      const newPage = page.map((item) => item - 3)
      setPage(newPage)
    }
  }
  return (
    <nav className="flex items-center gap-x-1" aria-label="Pagination">
      <button
        type="button"
        className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        aria-label="Previous"
        disabled={false}
        onClick={handlePreviousPage}
      >
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        <span>Previous</span>
      </button>
      <div className="flex items-center gap-x-1">
        {page.map((item) => (
          <button
            type="button"
            className={`min-h-[38px] min-w-[38px] flex justify-center items-center bg-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg ${selectedPage === item ? "outline-none bg-gray-400 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:bg-neutral-500": ""} `}
            aria-current="page"
            onClick={() => setSelectedPage(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        aria-label="Next"
        onClick={handleNextPage}
      >
        <span>Next</span>
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
