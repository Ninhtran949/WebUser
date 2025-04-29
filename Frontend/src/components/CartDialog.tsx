import { useState } from 'react';
import { XIcon, TrashIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import SignInDialog from './SignInDialog';
import { createPayment, checkPaymentStatus, ZaloPaymentResponse, ZaloStatusResponse } from '../services/paymentService';

interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDialog = ({ isOpen, onClose }: CartDialogProps) => {
  const { items, removeItem, clearCart, itemCount, increaseQuantity, decreaseQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentTransId, setPaymentTransId] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPrice = items.reduce((total, item) => total + item.book.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsSignInDialogOpen(true);
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const itemDescriptions = items.map(item => 
        `${item.book.title} x${item.quantity}`
      ).join(', ');
      
      const description = `Book order: ${itemDescriptions}`;
      const amountInVND = Math.round(totalPrice * 23000);
      
      const response = await createPayment({
        app_user: user?.id || 'guest',
        amount: amountInVND,
        description: description
      });
      
      if (response && response.order_url) {
        setPaymentTransId(response.app_trans_id);
        window.open(response.order_url, '_blank');
        console.log('Payment created with transaction ID:', response.app_trans_id);
        startPollingPaymentStatus(response.app_trans_id);
      } else {
        alert('Failed to create payment. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred while processing your payment. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const startPollingPaymentStatus = (appTransId: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const statusResponse = await checkPaymentStatus({
          app_trans_id: appTransId
        });
        
        if (statusResponse.return_code === 1) {
          clearInterval(checkInterval);
          handlePaymentSuccess();
        } 
        else if (statusResponse.return_code === 2 || statusResponse.return_code === 3) {
          clearInterval(checkInterval);
          handlePaymentFailure(statusResponse.return_message);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);
    
    setTimeout(() => {
      clearInterval(checkInterval);
      setIsProcessing(false);
    }, 300000);
  };
  
  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    alert('Payment successful! Your order has been placed.');
    clearCart(); // Clear the cart after successful payment
    onClose(); // Close the cart dialog
  };
  
  const handlePaymentFailure = (message: string) => {
    setIsProcessing(false);
    alert(`Payment failed: ${message}`);
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
                <button 
                  onClick={handleCheckout} 
                  className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition"
                  disabled={isProcessing}
                >
                  {isProcessing 
                    ? 'Processing...' 
                    : isAuthenticated 
                      ? 'Pay with ZaloPay' 
                      : 'Sign In to Checkout'}
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
