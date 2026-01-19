interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled:boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <>
    {disabled?(
      ""
    ):(
      <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-600">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm rounded-md border
            ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700"
            }`}
        >
          Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm rounded-md border
            ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700"
            }`}
        >
          Next
        </button>
      </div>
    </div>
    )}
    </>
  );
};


export default Pagination;