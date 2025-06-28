import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';
import { Book } from '../types/book';
import { CartItem } from '../types/cart';
import { toast } from 'react-toastify';

interface CartContextType {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => Promise<void>;
  removeItem: (bookId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  increaseQuantity: (bookId: string) => Promise<void>;
  decreaseQuantity: (bookId: string) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Enhanced cart synchronization
  const syncCartWithServer = async () => {
    if (!isAuthenticated || !user?.phoneNumber) return;

    try {
      setIsLoading(true);
      // Get server cart
      const serverCart = await cartService.getUserCart(user.phoneNumber);
      
      // Get local cart
      const localCart = items;
      
      // Create maps for easier comparison
      const serverItemMap = new Map(serverCart.map(item => [item.book.id, item]));
      const localItemMap = new Map(localCart.map(item => [item.book.id, item]));
      
      // Items to add (in local but not in server)
      const itemsToAdd = localCart.filter(item => !serverItemMap.has(item.book.id));
      
      // Items to update (in both but with different quantities)
      const itemsToUpdate = localCart.filter(item => {
        const serverItem = serverItemMap.get(item.book.id);
        return serverItem && serverItem.quantity !== item.quantity;
      });

      // Sync changes to server
      for (const item of itemsToAdd) {
        try {
          await cartService.addToCart(user.phoneNumber, item);
        } catch (error) {
          console.error(`Failed to add item ${item.book.id} to server:`, error);
          toast.error(`Failed to sync item: ${item.book.title}`);
        }
      }

      for (const item of itemsToUpdate) {
        try {
          await cartService.updateCartItem(user.phoneNumber, item.book.id, item.quantity);
        } catch (error) {
          console.error(`Failed to update item ${item.book.id} on server:`, error);
        }
      }

      // Fetch final state from server
      const finalCart = await cartService.getUserCart(user.phoneNumber);
      setItems(finalCart);
      
      if (itemsToAdd.length > 0 || itemsToUpdate.length > 0) {
        toast.success('Cart synchronized successfully');
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
      toast.error('Failed to synchronize cart with server');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.phoneNumber) {
      syncCartWithServer();
    }
  }, [isAuthenticated, user]);

  // Save local cart for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [items, isAuthenticated]);

  const addItem = async (book: Book, quantity: number = 1) => {
    try {
      setIsLoading(true);

      if (quantity < 1) {
        toast.error('Quantity must be greater than 0');
        return;
      }

      if (!book.productId) {
        toast.error('Invalid book data');
        return;
      }

      const newItem: CartItem = { book, quantity };

      if (isAuthenticated && user?.phoneNumber) {
        try {
          // Thêm vào server và nhận response
          await cartService.addToCart(user.phoneNumber, newItem);
          
          // Refresh cart data ngay lập tức
          const updatedCart = await cartService.getUserCart(user.phoneNumber);
          setItems(updatedCart);
          
          toast.success('Item added to cart');
        } catch (error) {
          console.error('Failed to add item:', error);
          toast.error('Vui lòng cập nhật số điện thoại để sử dụng chức năng giỏ hàng!');
        }
      } else {
        setItems(prev => [...prev, newItem]);
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Cart operation failed:', error);
      toast.error('Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (bookId: string) => {
    if (!bookId) {
      toast.error('Invalid book ID');
      return;
    }

    const originalItems = [...items];
    try {
      setItems(items.filter(item => item.book.id !== bookId));

      if (isAuthenticated && user?.phoneNumber) {
        try {
          await cartService.removeFromCart(user.phoneNumber, bookId);
          toast.success('Item removed from cart');
        } catch (error) {
          console.error('Error removing item:', error);
          setItems(originalItems);
          toast.error('Failed to remove item');
        }
      }
    } catch (error) {
      setItems(originalItems);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      setItems([]);

      if (isAuthenticated && user?.phoneNumber) {
        await cartService.clearCart(user.phoneNumber);
      } else {
        localStorage.removeItem('cart');
      }
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const increaseQuantity = async (bookId: string) => {
    try {
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
            toast.success('Quantity updated');
          } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error('Failed to update quantity');
          }
        }
      }
    } catch (error) {
      console.error('Failed to increase quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const decreaseQuantity = async (bookId: string) => {
    const item = items.find(item => item.book.id === bookId);

    if (item && item.quantity > 1) {
      try {
        if (isAuthenticated && user?.phoneNumber) {
          await cartService.updateCartItem(user.phoneNumber, bookId, item.quantity - 1);
          // Refresh cart data sau khi update
          const updatedCart = await cartService.getUserCart(user.phoneNumber);
          setItems(updatedCart);
          toast.success('Quantity updated');
        } else {
          setItems(prev => 
            prev.map(item => 
              item.book.id === bookId 
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          );
        }
      } catch (error) {
        console.error('Failed to decrease quantity:', error);
        toast.error('Failed to update quantity');
      }
    } else if (item && item.quantity === 1) {
      await removeItem(bookId);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      itemCount,
      increaseQuantity,
      decreaseQuantity,
      isLoading
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