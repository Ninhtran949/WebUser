import axios from 'axios';
import { APIBook } from '../data/books';

const API_URL = import.meta.env.VITE_API_URL;

export const getBestsellerBooks = async (): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/books/bestsellers`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch bestseller books: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching bestseller books');
  }
};

export const getTrendingBooks = async (): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/books/trending`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch trending books: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching trending books');
  }
};

export const getNewArrivals = async (): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/books/new-arrivals`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch new arrivals: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching new arrivals');
  }
};

export const getFeaturedBooks = async (): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/books/featured`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch featured books: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching featured books');
  }
};

export const getChildrensBooks = async (): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/books/childrens`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch children's books: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching children's books");
  }
};

export const getBookById = async (id: string): Promise<APIBook> => {
  try {
    const response = await axios.get<APIBook>(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch book details: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching book details');
  }
};

export const getBookByProductId = async (productId: string): Promise<APIBook> => {
  try {
    const response = await axios.get<APIBook>(`${API_URL}/books/product/${productId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch book details: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching book details');
  }
};

export const getRelatedBooks = async (category: string, currentBookId: string): Promise<APIBook[]> => {
  try {
    const response = await axios.get<APIBook[]>(`${API_URL}/books/related/${category}?excludeId=${currentBookId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch related books: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching related books');
  }
};

export const getBooksByCategory = async (codeCategory: string): Promise<APIBook[]> => {
  try {
    // Lấy danh sách Product theo category
    const response = await axios.get<{ _id: string }[]>(`${API_URL}/products/category/${codeCategory}`);
    const products = response.data;
    // Gọi tiếp API lấy Book theo productId cho từng Product
    const bookPromises = products.map(async (product) => {
      try {
        const bookRes = await axios.get<APIBook>(`${API_URL}/books/product/${product._id}`);
        return bookRes.data;
      } catch (err) {
        // Nếu không có Book cho Product này thì bỏ qua
        return null;
      }
    });
    const books = await Promise.all(bookPromises);
    // Lọc bỏ các book null (không có book tương ứng)
    return books.filter((b): b is APIBook => b !== null);
  } catch (error) {
    console.error('Error in getBooksByCategory:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch books by category: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching category books');
  }
};