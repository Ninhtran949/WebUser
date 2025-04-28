import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Book } from '../data/books';
import { useAuth } from './AuthContext';
interface CartItem {
  book: Book;
  quantity: number;
}
interface CartContextType {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  clearCart: () => void;
  itemCount: number;
  increaseQuantity: (bookId: string) => void;
  decreaseQuantity: (bookId: string) => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const {
    isAuthenticated,
    user
  } = useAuth();
  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCart = localStorage.getItem(`cart-${user.id}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse saved cart', e);
        }
      }
    } else {
      // For non-authenticated users, use a generic cart
      const savedCart = localStorage.getItem('cart-guest');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse saved cart', e);
        }
      }
    }
  }, [isAuthenticated, user]);
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(items));
    } else {
      localStorage.setItem('cart-guest', JSON.stringify(items));
    }
  }, [items, isAuthenticated, user]);
  const addItem = (book: Book, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.book.id === book.id);
      if (existingItem) {
        return currentItems.map(item => item.book.id === book.id ? {
          ...item,
          quantity: item.quantity + quantity
        } : item);
      } else {
        return [...currentItems, {
          book,
          quantity
        }];
      }
    });
  };
  const removeItem = (bookId: string) => {
    setItems(currentItems => currentItems.filter(item => item.book.id !== bookId));
  };
  const clearCart = () => {
    setItems([]);
  };
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const increaseQuantity = (bookId: string) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.book.id === bookId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  const decreaseQuantity = (bookId: string) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.book.id === bookId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
  return <CartContext.Provider value={{
    items,
    addItem,
    removeItem,
    clearCart,
    itemCount,
    increaseQuantity,
    decreaseQuantity
  }}>
      {children}
    </CartContext.Provider>;
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};