import MovieCard from "../components/movieCard";
import { useState, useEffect } from "react";
import { searchMovies } from "../services/api";
import { getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const data = await getPopularMovies(currentPage);
        setMovies(data.results || []);
        setTotalPages(data.totalPages || 0);
        setTotalResults(data.totalResults || 0);
        setError(null);
      } catch (error) {
        setError(
          "Failed to load movies. Please check your internet connection."
        );
        // Set empty state on error
        setMovies([]);
        setTotalPages(0);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    if (!isSearchMode) {
      loadPopularMovies();
    }
  }, [currentPage, isSearchMode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    setIsSearchMode(true);
    setCurrentPage(1);

    try {
      const data = await searchMovies(searchQuery, 1);
      setMovies(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPageChange = async (page) => {
    if (loading || !isSearchMode) return;

    setLoading(true);
    setCurrentPage(page);

    try {
      const data = await searchMovies(searchQuery, page);
      setMovies(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to load movies...");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (loading) return;

    if (isSearchMode) {
      handleSearchPageChange(page);
    } else {
      setCurrentPage(page);
      setLoading(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    setCurrentPage(1);
    setLoading(true);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn"
          disabled={loading}
        >
          Previous
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
          disabled={loading}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? "active" : ""}`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
          disabled={loading}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn"
          disabled={loading}
        >
          Next
        </button>
      );
    }

    return (
      <div className="pagination">
        <div className="pagination-info">
          Showing page {currentPage} of {totalPages} ({totalResults} total
          results)
        </div>
        <div className="pagination-controls">{pages}</div>
      </div>
    );
  };
  // Temporary simple render for debugging
  if (loading) {
    return (
      <div className="home">
        <div
          className="loading"
          style={{ color: "white", textAlign: "center", padding: "2rem" }}
        >
          Loading movies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div
          className="error-message"
          style={{ color: "red", textAlign: "center", padding: "2rem" }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          Search
        </button>
        {isSearchMode && (
          <button
            type="button"
            onClick={clearSearch}
            className="clear-search-btn"
          >
            Clear Search
          </button>
        )}
      </form>

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
      {renderPagination()}
    </div>
  );
}

export default Home;
