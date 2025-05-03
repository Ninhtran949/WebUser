import axios from 'axios';
import { CartItem } from '../contexts/CartContext';

const API_URL = import.meta.env.VITE_API_URL;

interface CartItemResponse {
  idProduct: number;
  idCart: number;
  idCategory: number;
  imgProduct: string;
  idPartner: string;
  nameProduct: string;
  userClient: string;
  priceProduct: number;
  numberProduct: number;
  totalPrice: number;
}

export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const response = await axios.get<CartItemResponse[]>(`${API_URL}/cart/user/${userId}`);
    return response.data.map((item) => ({
      book: {
        id: item.idProduct.toString(),
        _id: item.idProduct.toString(),
        title: item.nameProduct,
        author: item.idPartner,
        price: item.priceProduct,
        coverImage: item.imgProduct,
        category: item.idCategory.toString()
      },
      quantity: item.numberProduct
    }));
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 
        'status' in error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

export const addToCart = async (userId: string, cartItem: CartItem): Promise<void> => {
  try {
    await axios.post(`${API_URL}/cart`, {
      idProduct: parseInt(cartItem.book.id),
      idCart: Date.now(),
      idCategory: parseInt(cartItem.book.category),
      imgProduct: cartItem.book.coverImage,
      idPartner: cartItem.book.author,
      nameProduct: cartItem.book.title,
      userClient: userId,
      priceProduct: cartItem.book.price,
      numberProduct: cartItem.quantity,
      totalPrice: cartItem.book.price * cartItem.quantity
    });
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (userId: string, bookId: string, quantity: number): Promise<void> => {
  try {
    const carts = await axios.get<CartItemResponse[]>(`${API_URL}/cart/user/${userId}`);
    const cartItem = carts.data.find(item => item.idProduct.toString() === bookId);
    
    if (cartItem) {
      await axios.patch(`${API_URL}/cart/idCart/${cartItem.idCart}`, {
        numberProduct: quantity,
        totalPrice: cartItem.priceProduct * quantity
      });
    }
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (userId: string, bookId: string): Promise<void> => {
  try {
    const carts = await axios.get<CartItemResponse[]>(`${API_URL}/cart/user/${userId}`);
    const cartItem = carts.data.find(item => item.idProduct.toString() === bookId);
    
    if (cartItem) {
      await axios.delete(`${API_URL}/cart/${cartItem.idCart}`);
    }
  } catch (error) {
    throw error;
  }
};

export const clearCart = async (userId: string): Promise<void> => {
  try {
    const carts = await axios.get<CartItemResponse[]>(`${API_URL}/cart/user/${userId}`);
    for (const item of carts.data) {
      await axios.delete(`${API_URL}/cart/${item.idCart}`);
    }
  } catch (error) {
    throw error;
  }
};