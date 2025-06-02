import axios from 'axios';
import { Book } from '../types/book';

const API_URL = import.meta.env.VITE_API_URL;

interface FavoriteResponse {
  userId: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
}

function isFavoriteResponseArray(value: unknown): value is FavoriteResponse[] {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'bookId' in item &&
    'title' in item
  );
}

export async function getUserFavorites(phoneNumber: string): Promise<Book[]> {
  try {
    if (!phoneNumber) throw new Error('Phone number is required');

    const response = await axios.get(`${API_URL}/favorites/user/${phoneNumber}`);
    const favorites = response.data;

    if (!isFavoriteResponseArray(favorites)) {
      console.warn('Invalid response format from server');
      return [];
    }

    return favorites.map(fav => ({
      id: fav.bookId,
      _id: fav.bookId,
      title: fav.title,
      author: fav.author,
      price: fav.price,
      coverImage: fav.coverImage,
      category: fav.category
    }));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export async function addToFavorites(phoneNumber: string, book: Book): Promise<void> {
  try {
    if (!phoneNumber) throw new Error('Phone number is required');
    if (!book.id && !book._id) throw new Error('Book ID is required');

    const payload = {
      phoneNumber,
      bookId: book.id || book._id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
      category: book.category
    };

    await axios.post(`${API_URL}/favorites`, payload);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw new Error('Failed to add to favorites');
  }
}

export async function removeFromFavorites(phoneNumber: string, bookId: string): Promise<void> {
  try {
    if (!phoneNumber) throw new Error('Phone number is required');
    if (!bookId) throw new Error('Book ID is required');

    await axios.delete(`${API_URL}/favorites/${phoneNumber}/${bookId}`);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Failed to remove from favorites');
  }
}

export async function clearFavorites(phoneNumber: string): Promise<void> {
  try {
    if (!phoneNumber) throw new Error('Phone number is required');
    await axios.delete(`${API_URL}/favorites/user/${phoneNumber}`);
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw new Error('Failed to clear favorites');
  }
}