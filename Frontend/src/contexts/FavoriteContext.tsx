import { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../data/books';
import { useAuth } from './AuthContext';

interface FavoriteContextType {
  favorites: Book[];
  addToFavorites: (book: Book) => void;
  removeFromFavorites: (bookId: string) => void;
  clearFavorites: () => void;
  isFavorite: (bookId: string) => boolean;
  favoriteCount: number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Load favorites from localStorage when component mounts
    if (isAuthenticated && user) {
      const savedFavorites = localStorage.getItem(`favorites-${user.id}`);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
          console.error('Failed to parse saved favorites', e);
        }
      }
    } else {
      const savedFavorites = localStorage.getItem('favorites-guest');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
          console.error('Failed to parse saved favorites', e);
        }
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Save favorites to localStorage whenever it changes
    if (isAuthenticated && user) {
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites));
    } else {
      localStorage.setItem('favorites-guest', JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated, user]);

  const addToFavorites = (book: Book) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(fav => fav.id === book.id)) {
        return [...prevFavorites, book];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (bookId: string) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(book => book.id !== bookId)
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (bookId: string) => {
    return favorites.some(book => book.id === bookId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isFavorite,
    favoriteCount: favorites.length
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};