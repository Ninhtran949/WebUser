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

interface ProductType {
  _id: string;
  codeCategory: string;
  codeProduct: string;
  imgProduct: string;
  nameProduct: string;
  priceProduct: string;
  userPartner: string;
}

export const getBooksByCategory = async (codeCategory: string): Promise<APIBook[]> => {
  try {
    const response = await axios.get<ProductType[]>(`${API_URL}/products/category/${codeCategory}`);
    console.log('Raw product response:', response.data);
    
    return response.data.map(product => ({
      _id: product._id,
      productId: {
        _id: product._id,
        codeCategory: product.codeCategory,
        codeProduct: product.codeProduct,
        imgProduct: product.imgProduct,
        nameProduct: product.nameProduct,
        priceProduct: product.priceProduct,
        userPartner: product.userPartner
      },
      title: product.nameProduct,
      author: product.userPartner,
      isbn13: '',
      publisher: '',
      publicationDate: new Date().toISOString(),
      pages: 0,
      overview: '',
      editorialReviews: [],
      customerReviews: [],
      category: 'General'
    }));
  } catch (error) {
    console.error('Error in getBooksByCategory:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch books by category: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching category books');
  }
};