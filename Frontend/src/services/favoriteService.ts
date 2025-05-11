import axios from 'axios';
import { Book } from '../types/book';

const API_URL = import.meta.env.VITE_API_URL;

interface FavoriteItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
}

export const getUserFavorites = async (userId: string): Promise<Book[]> => {
  try {
    const response = await axios.get<FavoriteItem[]>(`${API_URL}/favorites/user/${userId}`);
    return response.data.map((item) => ({
      id: item.bookId,
      _id: item.bookId,
      title: item.title,
      author: item.author,
      price: item.price,
      coverImage: item.coverImage,
      category: item.category
    }));
  } catch (error) {
    if ((error as any).response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const addToFavorites = async (userId: string, book: Book): Promise<void> => {
  try {
    await axios.post(`${API_URL}/favorites`, {
      userId: userId,
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
      category: book.category
    });
  } catch (error) {
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, bookId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/favorites/${userId}/${bookId}`);
  } catch (error) {
    throw error;
  }
};

export const clearFavorites = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/favorites/user/${userId}`);
  } catch (error) {
    throw error;
  }
};