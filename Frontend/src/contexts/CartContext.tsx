import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';
import { Book } from '../types/book';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => Promise<void>;
  removeItem: (bookId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  increaseQuantity: (bookId: string) => void;
  decreaseQuantity: (bookId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Tải giỏ hàng từ MongoDB khi người dùng đăng nhập
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user?.phoneNumber) {
        try {
          const cartItems = await cartService.getUserCart(user.phoneNumber);
          setItems(cartItems);
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      } else {
        // Nếu không đăng nhập, sử dụng localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Lưu giỏ hàng vào localStorage khi không đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addItem = async (book: Book, quantity: number = 1) => {
    const existingItem = items.find(item => item.book.id === book.id);
    
    if (existingItem) {
      // Tăng số lượng nếu sách đã có trong giỏ hàng
      const updatedItems = items.map(item => 
        item.book.id === book.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
      setItems(updatedItems);
      
      if (isAuthenticated && user?.phoneNumber) {
        try {
          await cartService.updateCartItem(user.phoneNumber, book.id, existingItem.quantity + quantity);
        } catch (error) {
          console.error('Failed to update cart item:', error);
        }
      }
    } else {
      // Thêm sách mới vào giỏ hàng
      const newItem = { book, quantity };
      setItems([...items, newItem]);
      
      if (isAuthenticated && user?.phoneNumber) {
        try {
          await cartService.addToCart(user.phoneNumber, newItem);
        } catch (error) {
          console.error('Failed to add to cart:', error);
        }
      }
    }
  };

  const removeItem = async (bookId: string) => {
    const updatedItems = items.filter(item => item.book.id !== bookId);
    setItems(updatedItems);
    
    if (isAuthenticated && user?.phoneNumber) {
      try {
        await cartService.removeFromCart(user.phoneNumber, bookId);
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    
    if (isAuthenticated && user?.phoneNumber) {
      try {
        await cartService.clearCart(user.phoneNumber);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const increaseQuantity = async (bookId: string) => {
    const updatedItems = items.map(item => 
      item.book.id === bookId 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
    );
    setItems(updatedItems);
    
    if (isAuthenticated && user?.phoneNumber) {
      const item = updatedItems.find(item => item.book.id === bookId);
      if (item) {
        try {
          await cartService.updateCartItem(user.phoneNumber, bookId, item.quantity);
        } catch (error) {
          console.error('Failed to increase quantity:', error);
        }
      }
    }
  };

  const decreaseQuantity = async (bookId: string) => {
    const item = items.find(item => item.book.id === bookId);
    
    if (item && item.quantity > 1) {
      const updatedItems = items.map(item => 
        item.book.id === bookId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
      setItems(updatedItems);
      
      if (isAuthenticated && user?.phoneNumber) {
        try {
          await cartService.updateCartItem(user.phoneNumber, bookId, item.quantity - 1);
        } catch (error) {
          console.error('Failed to decrease quantity:', error);
        }
      }
    } else if (item && item.quantity === 1) {
      removeItem(bookId);
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      itemCount,
      increaseQuantity,
      decreaseQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};