import { createContext, useContext, useState, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setfavorites] = useState([]);

  useEffect(() => {
    try {
      const storefavs = localStorage.getItem("favorites");
      if (storefavs) {
        setfavorites(JSON.parse(storefavs));
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      setfavorites([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  const addToFavorites = (movie) => {
    setfavorites((prev) => [...prev, movie]);
  };
  const removeFromFavorites = (movieId) => {
    setfavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  };
  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
