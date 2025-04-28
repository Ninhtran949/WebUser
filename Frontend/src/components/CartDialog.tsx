import { useState } from 'react';
import { XIcon, TrashIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import SignInDialog from './SignInDialog';
interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
const CartDialog = ({ isOpen, onClose }: CartDialogProps) => {
  const { items, removeItem, clearCart, itemCount, increaseQuantity, decreaseQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  if (!isOpen) return null;

  const totalPrice = items.reduce((total, item) => total + item.book.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsSignInDialogOpen(true);
    } else {
      // In a real app, this would navigate to checkout
      alert('Proceeding to checkout...');
    }
  };
  return <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl relative">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <img src="Pic for emty cart" alt="Empty cart pic" className="w-32 h-32 opacity-60" />
              </div>
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button onClick={onClose} className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.book.id} className="flex border-b border-gray-200 pb-4">
                    <div className="w-20 h-28 flex-shrink-0">
                      <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{item.book.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.book.author}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <span className="font-bold mr-4">
                            ${(item.book.price * item.quantity).toFixed(2)}
                          </span>
                          <div className="flex items-center border rounded">
                            <button 
                              onClick={() => decreaseQuantity(item.book.id)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon size={16} />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button 
                              onClick={() => increaseQuantity(item.book.id)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <PlusIcon size={16} />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.book.id)} className="text-gray-500 hover:text-red-500">
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={clearCart} className="text-blue-800 hover:underline flex items-center">
                  <TrashIcon size={16} className="mr-1" />
                  Clear Cart
                </button>
                <button onClick={handleCheckout} className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition">
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    <SignInDialog isOpen={isSignInDialogOpen} onClose={() => setIsSignInDialogOpen(false)} />
  </>;
};
export default CartDialog;