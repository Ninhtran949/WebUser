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

export async function getUserCart(userId: string): Promise<CartItem[]> {
  try {
    const response = await axios.get(`${API_URL}/cart/user/${userId}`);
    const items = response.data;
    
    if (!isCartResponseArray(items)) {
      console.warn('Invalid response format from server');
      return [];
    }

    return items.map(item => ({
      book: {
        id: String(item.idProduct),
        _id: String(item.idProduct),
        title: item.nameProduct,
        author: item.idPartner,
        price: item.priceProduct,
        coverImage: item.imgProduct,
        category: String(item.idCategory)
      },
      quantity: item.numberProduct
    }));
  } catch (error) {
    if (isErrorWithResponse(error) && error.response?.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch cart');
  }
}

export const addToCart = async (userId: string, cartItem: CartItem): Promise<void> => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!cartItem.book) throw new Error('Book information is required');

    // Get maximum cart ID with error handling
    let maxIdCart = 0;
    try {
      const cartsResponse = await axios.get<CartItemResponse[]>(`${API_URL}/cart/user/${userId}`);
      if (cartsResponse.data && cartsResponse.data.length > 0) {
        maxIdCart = Math.max(...cartsResponse.data.map(cart => cart.idCart));
      }
    } catch (error) {
      console.warn('Failed to get max cart ID, using default value');
      maxIdCart = 0;
    }
    
    const newIdCart = maxIdCart + 1;

    // Enhanced idProduct handling with validation
    let idProduct: number;
    if (cartItem.book._id) {
      const parsedId = Number(cartItem.book._id);
      if (!isNaN(parsedId)) {
        idProduct = parsedId;
      } else if (cartItem.book.id) {
        const parsedAltId = Number(cartItem.book.id);
        if (!isNaN(parsedAltId)) {
          idProduct = parsedAltId;
        } else {
          idProduct = Date.now();
          console.warn('Using timestamp as fallback for invalid ID');
        }
      } else {
        idProduct = Date.now();
        console.warn('Using timestamp as fallback for missing ID');
      }
    } else if (cartItem.book.id) {
      const parsedId = Number(cartItem.book.id);
      idProduct = !isNaN(parsedId) ? parsedId : Date.now();
    } else {
      idProduct = Date.now();
      console.warn('Using timestamp as fallback for missing ID');
    }

    // Validate and ensure category is a number
    let idCategory = 1;
    if (cartItem.book.category) {
      const parsedCategory = parseInt(cartItem.book.category);
      if (!isNaN(parsedCategory)) {
        idCategory = parsedCategory;
      }
    }

    // Create payload with type validation
    const payload = {
      idProduct,
      idCart: newIdCart,
      idCategory,
      imgProduct: cartItem.book.coverImage || '',
      idPartner: cartItem.book.author || '',
      nameProduct: cartItem.book.title || 'Unnamed Product',
      userClient: userId,
      priceProduct: Number(cartItem.book.price) || 0,
      numberProduct: cartItem.quantity || 1,
      totalPrice: (Number(cartItem.book.price) || 0) * (cartItem.quantity || 1)
    };

    // Validate payload before sending
    if (!payload.idProduct) throw new Error('Invalid product ID');
    if (!payload.nameProduct) throw new Error('Product name is required');
    if (payload.priceProduct < 0) throw new Error('Invalid product price');
    if (payload.numberProduct < 1) throw new Error('Invalid product quantity');

    const response = await axios.post(`${API_URL}/cart`, payload);
    if (!response.data) throw new Error('Failed to add item to cart');

  } catch (error) {
    if (isErrorWithResponse(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
    throw error;
  }
};

export async function updateCartItem(userId: string, bookId: string, quantity: number): Promise<void> {
  try {
    const response = await axios.get(`${API_URL}/cart/user/${userId}`);
    const items = response.data;

    if (!isCartResponseArray(items)) {
      throw new Error('Invalid server response');
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
    if (isErrorWithResponse(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
    throw error;
  }
}

export async function removeFromCart(userId: string, bookId: string): Promise<void> {
  try {
    const response = await axios.get(`${API_URL}/cart/user/${userId}`);
    const items = response.data;

    if (!isCartResponseArray(items)) {
      throw new Error('Invalid server response');
    }

    const cartItem = items.find(item => String(item.idProduct) === bookId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    const deleteResponse = await axios.delete(`${API_URL}/cart/${cartItem.idCart}`);
    if (deleteResponse.status !== 200) {
      throw new Error('Failed to remove item');
    }
  } catch (error) {
    if (isErrorWithResponse(error)) {
      throw new Error(error.response?.data?.message || 'Failed to remove cart item');
    }
    throw error;
  }
}

export async function clearCart(userId: string): Promise<void> {
  try {
    const response = await axios.get(`${API_URL}/cart/user/${userId}`);
    const items = response.data;

    if (!isCartResponseArray(items)) {
      return;
    }

    await Promise.all(items.map(item => 
      axios.delete(`${API_URL}/cart/${item.idCart}`)
    ));
  } catch (error) {
    if (isErrorWithResponse(error)) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
    throw error;
  }
}