import { useEffect, useState, useCallback, useRef } from 'react';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router';
import { getErrorMessage } from '../../utils/errorHandler';
import TableSkeleton from '../skeletons/TableSkeleton';

import useDebounce from '../../hooks/useDebounce';

import Chevron from '../home/Chevron';
import CustomSelect from '../home/CustomSelect';

import { tagOptions } from '../../constants/problemTags';

import { PAGE_LIMIT, difficultyOptions } from '../../constants/filterOptions';

import { s } from '../../styles/admin/deleteProblemStyles';

// ─────────────────────────────────────────────────────────────────────────────

const DeleteProblem = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProblems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ difficulty: '', tags: [] });

  // "difficulty" | "tags" | null
  const [openPanel, setOpenPanel] = useState(null);
  const toggle = (panel) => setOpenPanel((prev) => (prev === panel ? null : panel));

  const difficultyRef = useRef(null);
  const tagDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !difficultyRef.current?.contains(e.target) &&
        !tagDropdownRef.current?.contains(e.target)
      ) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const debouncedSearch = useDebounce(searchInput, 400);

  const buildQueryString = useCallback((page, search, f) => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', PAGE_LIMIT);
    if (search.trim()) params.set('q', search.trim());
    if (f.difficulty) params.set('difficulty', f.difficulty);
    if (f.tags.length > 0) params.set('tags', f.tags.join(','));
    return params.toString();
  }, []);

  const fetchProblems = useCallback(
    async (page, search, f) => {
      try {
        setLoading(true);
        /// For testing purpose add here an await delay of 5s to see the skeleton loader in action
        // await new Promise(resolve => setTimeout(resolve, 5000));

        const qs = buildQueryString(page, search, f);
        const { data } = await axiosClient.get(`/problem/getProblems?${qs}`);
        if (!data.success) {
          toast.error(data.errors?.[0] || 'Failed to fetch problems');
          return;
        }
        setProblems(data.problems);
        setPagination(data.pagination);
      } catch (err) {
        toast.error(getErrorMessage(err));
        if (import.meta.env.DEV) console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [buildQueryString]
  );

  useEffect(() => {
    fetchProblems(currentPage, debouncedSearch, filters);
  }, [currentPage, debouncedSearch, filters]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, filters]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag) =>
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));

  const clearAllFilters = () => {
    setSearchInput('');
    setFilters({ difficulty: '', tags: [] });
    setCurrentPage(1);
    setOpenPanel(null);
  };

  const hasActiveFilters = searchInput.trim() || filters.difficulty || filters.tags.length > 0;

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      setDeletingId(id);
      await axiosClient.delete(`/problem/delete/${id}`);
      toast.success('Problem deleted successfully');
      const isLastItemOnPage = problems.length === 1 && currentPage > 1;
      if (isLastItemOnPage) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchProblems(currentPage, debouncedSearch, filters);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      if (import.meta.env.DEV) console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const { currentPage: pg, totalPages, totalProblems, hasNextPage, hasPrevPage } = pagination;

  if (loading) return <TableSkeleton rows={5} />;

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <span style={s.logo}>CodeArena</span>
          </NavLink>
        </div>
        <NavLink to="/admin" style={{ textDecoration: 'none' }}>
          <span style={s.adminBox}>Admin Dashboard</span>
        </NavLink>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <h1 style={s.heading}>Delete Problems</h1>
          <p style={s.subheading}>Remove outdated or invalid coding problems from the platform</p>
        </div>

        <div style={s.searchWrapper}>
          <svg
            style={s.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search by problem number or title…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button style={s.searchClear} onClick={() => setSearchInput('')}>
              ✕
            </button>
          )}
        </div>

        <div style={s.filterRow}>
          {/* Difficulty — custom dropdown */}
          <CustomSelect
            value={filters.difficulty}
            onChange={(v) => updateFilter('difficulty', v)}
            options={difficultyOptions}
            placeholder="All Difficulties"
            dropdownRef={difficultyRef}
            isOpen={openPanel === 'difficulty'}
            onToggle={() => toggle('difficulty')}
          />

          {/* Tags — multi-select panel */}
          <div style={s.tagDropdownWrapper} ref={tagDropdownRef}>
            <button type="button" style={s.selectBtn} onClick={() => toggle('tags')}>
              <span style={{ color: filters.tags.length > 0 ? '#e2e8f0' : '#9ca3af' }}>
                {filters.tags.length === 0
                  ? 'All Tags'
                  : `${filters.tags.length} tag${filters.tags.length > 1 ? 's' : ''} selected`}
              </span>
              <Chevron open={openPanel === 'tags'} />
            </button>

            {openPanel === 'tags' && (
              <div style={s.tagDropdownPanel}>
                <div style={s.tagGrid}>
                  {tagOptions.map((tag) => {
                    const active = filters.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        style={{ ...s.tagPill, ...(active ? s.tagPillActive : {}) }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {filters.tags.length > 0 && (
                  <button
                    style={s.clearTagsBtn}
                    onClick={() => updateFilter('tags', [])}
                    type="button"
                  >
                    Clear tags
                  </button>
                )}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button style={s.clearAllBtn} onClick={clearAllFilters} type="button">
              ✕ Clear all
            </button>
          )}
        </div>

        {/* ── Active tag pills ── */}
        {filters.tags.length > 0 && (
          <div style={s.activeTagsRow}>
            {filters.tags.map((tag) => (
              <span key={tag} style={s.activeTagPill}>
                {tag}
                <button style={s.removeTagBtn} onClick={() => toggleTag(tag)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['#', 'Title', 'Difficulty', 'Tags', 'Action'].map((h) => (
                  <th key={h} style={s.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: '40px', textAlign: 'center', color: '#4b5563' }}
                  >
                    No problems found
                  </td>
                </tr>
              ) : (
                problems.map((problem, index) => (
                  <tr key={problem._id} style={s.tr}>
                    <td style={s.td}>{problem.problemNo ?? (pg - 1) * PAGE_LIMIT + index + 1}</td>
                    <td style={{ ...s.td, color: '#e2e8f0', fontWeight: 600 }}>{problem.title}</td>
                    <td style={s.td}>
                      <span style={getDifficultyStyle(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={s.tagRow}>
                        {problem.tags.map((tag, i) => (
                          <span key={i} style={s.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={s.td}>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        disabled={deletingId === problem._id}
                        style={{
                          ...s.deleteBtn,
                          opacity: deletingId === problem._id ? 0.6 : 1,
                          cursor: deletingId === problem._id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {deletingId === problem._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {problems.length > 0 && (
          <>
            <div style={s.paginationInfo}>
              Showing {(pg - 1) * PAGE_LIMIT + 1}–{Math.min(pg * PAGE_LIMIT, totalProblems)} of{' '}
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
                  if (i > 0 && n - arr[i - 1] > 1) acc.push('...');
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
                      style={{ ...s.pageBtn, ...(pg === item ? s.pageBtnActive : {}) }}
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
        )}
      </div>
    </div>
  );
};

const getDifficultyStyle = (difficulty) => {
  const base = {
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 10px',
    textTransform: 'capitalize',
  };
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return {
        ...base,
        background: 'rgba(34,197,94,0.1)',
        color: '#22c55e',
        border: '1px solid rgba(34,197,94,0.2)',
      };
    case 'medium':
      return {
        ...base,
        background: 'rgba(234,179,8,0.1)',
        color: '#eab308',
        border: '1px solid rgba(234,179,8,0.2)',
      };
    case 'hard':
      return {
        ...base,
        background: 'rgba(239,68,68,0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239,68,68,0.2)',
      };
    default:
      return {
        ...base,
        background: 'rgba(99,102,241,0.1)',
        color: '#a5b4fc',
        border: '1px solid rgba(99,102,241,0.2)',
      };
  }
};

export default DeleteProblem;
