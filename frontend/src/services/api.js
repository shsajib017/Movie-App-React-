const API_KEY = "e1f251c02561a4791de1147510abc2d8";
const API_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return {
      results: data.results,
      totalPages: data.total_pages,
      currentPage: data.page,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      results: data.results,
      totalPages: data.total_pages,
      currentPage: data.page,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};
