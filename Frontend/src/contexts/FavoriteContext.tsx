import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as favoriteService from '../services/favoriteService';
import { Book } from '../types/book';

interface FavoriteContextType {
  favorites: Book[];
  addToFavorites: (book: Book) => void;
  removeFromFavorites: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  clearFavorites: () => void;
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

export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const { user, isAuthenticated } = useAuth();
  const favoriteCount = favorites.length;

  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const userFavorites = await favoriteService.getUserFavorites(user.id);
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Failed to load favorites:', error);
        }
      } else {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      }
    };

    loadFavorites();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated]);

  const addToFavorites = async (book: Book) => {
    if (!isFavorite(book.id)) {
      setFavorites([...favorites, book]);
      
      if (isAuthenticated && user?.id) {
        try {
          await favoriteService.addToFavorites(user.id, book);
        } catch (error) {
          console.error('Failed to add to favorites:', error);
        }
      }
    }
  };

  const removeFromFavorites = async (bookId: string) => {
    setFavorites(favorites.filter(book => book.id !== bookId));
    
    if (isAuthenticated && user?.id) {
      try {
        await favoriteService.removeFromFavorites(user.id, bookId);
      } catch (error) {
        console.error('Failed to remove from favorites:', error);
      }
    }
  };

  const isFavorite = (bookId: string) => {
    return favorites.some(book => book.id === bookId);
  };

  const clearFavorites = async () => {
    setFavorites([]);
    
    if (isAuthenticated && user?.id) {
      try {
        await favoriteService.clearFavorites(user.id);
      } catch (error) {
        console.error('Failed to clear favorites:', error);
      }
    }
  };

  return (
    <FavoriteContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite,
      clearFavorites,
      favoriteCount
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};