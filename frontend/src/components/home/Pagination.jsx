import { s } from '../../styles/pages/homepageStyles';

function Pagination({
  loading,
  problems,
  pg,
  totalPages,
  totalProblems,
  hasNextPage,
  hasPrevPage,
  setCurrentPage,
  pageLimit,
}) {
  if (loading || problems.length === 0) {
    return null;
  }

  return (
    <>
      <div style={s.paginationInfo}>
        Showing {(pg - 1) * pageLimit + 1}–{Math.min(pg * pageLimit, totalProblems)} of{' '}
        {totalProblems} problems
      </div>

      <div style={s.pagination}>
        <button
          disabled={!hasPrevPage}
          onClick={() => setCurrentPage((p) => p - 1)}
          style={{ ...s.pageBtn, opacity: hasPrevPage ? 1 : 0.4 }}
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((n) => n === 1 || n === totalPages || Math.abs(n - pg) <= 2)
          .reduce((acc, n, i, arr) => {
            if (i > 0 && n - arr[i - 1] > 1) {
              acc.push('...');
            }

            acc.push(n);
            return acc;
          }, [])
          .map((item, i) =>
            item === '...' ? (
              <span key={`ellipsis-${i}`} style={{ color: '#4b5563', padding: '0 4px' }}>
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                style={{
                  ...s.pageBtn,
                  ...(pg === item ? s.pageBtnActive : {}),
                }}
              >
                {item}
              </button>
            )
          )}

        <button
          disabled={!hasNextPage}
          onClick={() => setCurrentPage((p) => p + 1)}
          style={{ ...s.pageBtn, opacity: hasNextPage ? 1 : 0.4 }}
        >
          Next →
        </button>
      </div>
    </>
  );
}

export default Pagination;
