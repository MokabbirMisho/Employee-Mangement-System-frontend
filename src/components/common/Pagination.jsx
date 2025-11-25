// components/Pagination.jsx
export default function Pagination({
  totalItems,
  itemsPerPage = 5,
  currentPage,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (totalPages === 1) return null;

  const go = (p) => {
    if (p >= 1 && p <= totalPages) onPageChange(p);
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        className="btn btn-sm"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="join">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => go(i + 1)}
            className={`join-item btn btn-sm ${
              currentPage === i + 1 ? "btn-success btn-active" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        className="btn btn-sm"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
