import axios from 'axios';
import { CartItem, CartItemResponse } from '../types/cart';

const API_URL = import.meta.env.VITE_API_URL;

// Improved validation for cart item response
function isCartItemResponse(item: unknown): item is CartItemResponse {
  if (!item || typeof item !== 'object') return false;
  const cart = item as Partial<CartItemResponse>;
  return (
    typeof cart.idProduct === 'number' &&
    typeof cart.idCart === 'number' &&
    typeof cart.idCategory === 'number' &&
    typeof cart.numberProduct === 'number' &&
    typeof cart.priceProduct === 'number' &&
    typeof cart.totalPrice === 'number' &&
    typeof cart.nameProduct === 'string' &&
    typeof cart.imgProduct === 'string' &&
    typeof cart.idPartner === 'string' &&
    typeof cart.userClient === 'string'
  );
}

// Improved validation for cart response array
function isCartResponseArray(value: unknown): value is CartItemResponse[] {
  return Array.isArray(value) && value.every(isCartItemResponse);
}

// Enhanced error type guard
interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

function isErrorWithResponse(error: unknown): error is ApiError {
  return error !== null && typeof error === 'object' && 'response' in error;
}

export async function getUserCart(phoneNumber: string): Promise<CartItem[]> {
  try {
    // Validate phone number before making the request
    if (!phoneNumber || phoneNumber.trim() === '' || phoneNumber === ' ') {
      console.warn('Invalid phone number provided to getUserCart');
      return [];
    }

    const response = await axios.get(`${API_URL}/cart/user/${phoneNumber}`);
    const items = response.data;
    
    if (!isCartResponseArray(items)) {
      console.warn('Invalid response format from server');
      return [];
    }

    return items.map(item => ({
      book: {
        id: item.idProduct.toString(),
        _id: item.idProduct.toString(),
        title: item.nameProduct,
        author: item.idPartner,
        price: item.priceProduct,
        coverImage: item.imgProduct,
        category: item.idCategory.toString(),
        productId: null,
        isbn13: '',
        publisher: '',
        publicationDate: new Date().toISOString(),
        pages: 0,
        overview: '',
        editorialReviews: [],
        customerReviews: []
      },
      quantity: item.numberProduct,
      cartId: item.idCart.toString()
    }));
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

export const addToCart = async (phoneNumber: string, cartItem: CartItem): Promise<CartItemResponse> => {
  try {
    if (!phoneNumber || phoneNumber.trim() === '' || phoneNumber === ' ') {
      throw new Error('Phone number is required');
    }
    if (!cartItem.book) throw new Error('Book information is required');
    if (!cartItem.book.productId) throw new Error('Product information is required');

    const payload = {
      idProduct: parseInt(cartItem.book.productId.codeProduct),
      idCategory: parseInt(cartItem.book.productId.codeCategory),
      imgProduct: cartItem.book.productId.imgProduct || '',
      idPartner: cartItem.book.productId.userPartner || '',
      nameProduct: cartItem.book.productId.nameProduct || '',
      userClient: phoneNumber,
      priceProduct: parseFloat(cartItem.book.productId.priceProduct),
      numberProduct: cartItem.quantity || 1,
      totalPrice: parseFloat(cartItem.book.productId.priceProduct) * (cartItem.quantity || 1)
    };

    console.log('Sending payload:', payload);
    const response = await axios.post(`${API_URL}/cart`, payload);
    console.log('Response from server:', response.data);    
    // Validate response data
    const cartResponse = response.data;
    if (!isCartItemResponse(cartResponse)) {
      throw new Error('Invalid response from server');
    }
    
    return cartResponse;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error(isErrorWithResponse(error) 
      ? error.response?.data?.message || 'Failed to add to cart'
      : 'Failed to add to cart');
  }
};

export async function updateCartItem(phoneNumber: string, bookId: string, quantity: number): Promise<void> {
  try {
    if (!phoneNumber) throw new Error('Phone number is required');
    if (!bookId) throw new Error('Book ID is required');
    if (quantity < 1) throw new Error('Quantity must be at least 1');

    const response = await axios.get(`${API_URL}/cart/user/${phoneNumber}`);
    const items = response.data;

    if (!isCartResponseArray(items)) {
      throw new Error('Invalid cart data received');
    }

    const cartItem = items.find(item => String(item.idProduct) === bookId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await axios.patch(`${API_URL}/cart/idCart/${cartItem.idCart}`, {
      numberProduct: quantity,
      totalPrice: cartItem.priceProduct * quantity
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    throw new Error(isErrorWithResponse(error)
      ? error.response?.data?.message || 'Failed to update cart'
      : 'Failed to update cart');
  }
}

export async function removeFromCart(phoneNumber: string, bookId: string): Promise<void> {
  try {
    if (!phoneNumber) throw new Error('Phone number is required');
    if (!bookId) throw new Error('Book ID is required');

    const response = await axios.get(`${API_URL}/cart/user/${phoneNumber}`);
    const items = response.data;

    if (!isCartResponseArray(items)) {
      throw new Error('Invalid cart data received');
    }

    const cartItem = items.find(item => String(item.idProduct) === bookId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await axios.delete(`${API_URL}/cart/${cartItem.idCart}`);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw new Error(isErrorWithResponse(error)
      ? error.response?.data?.message || 'Failed to remove from cart'
      : 'Failed to remove from cart');
  }
}

export async function clearCart(phoneNumber: string): Promise<void> {
  try {
    if (!phoneNumber) throw new Error('Phone number is required');
    await axios.delete(`${API_URL}/cart/user/${phoneNumber}`);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error(isErrorWithResponse(error)
      ? error.response?.data?.message || 'Failed to clear cart'
      : 'Failed to clear cart');
  }
}