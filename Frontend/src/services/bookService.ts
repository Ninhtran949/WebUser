import axios from 'axios';
import { APIBook } from '../data/books';

const API_URL = import.meta.env.VITE_API_URL;

export const getBestsellerBooks = async (): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/api/books/bestsellers`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch bestseller books: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching bestseller books');
  }
};

export const getBooksByCategory = async (category: string): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/books/${category}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch books by category: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching books');
  }
};