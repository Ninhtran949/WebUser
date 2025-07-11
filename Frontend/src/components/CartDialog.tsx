import { useState } from 'react';
import { XIcon, TrashIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import SignInDialog from './SignInDialog';
import OrderConfirmDialog from './OrderConfirmDialog';
import { createPayment, checkPaymentStatus } from '../services/paymentService';
import axios from 'axios';

// Add interfaces for API responses
interface BillResponse {
  message: string;
  billId: string;
}

interface BillItem {
  idCart: number;
  idCategory: number;
  idPartner: string;
  idProduct: number;
  imgProduct: string;
  nameProduct: string;
  numberProduct: number;
  priceProduct: number;
  totalPrice: number;
  userClient: string;
}

interface Bill {
  Cart: BillItem[];
  dayOut: string;
  idBill: number;
  idClient: string;
  idPartner: string;
  status: string;
  timeOut: string;
  total: number;
}

interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDialog = ({ isOpen, onClose }: CartDialogProps) => {
  const { items, removeItem, clearCart, itemCount, increaseQuantity, decreaseQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const totalPrice = items.reduce((total, item) => total + item.book.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsSignInDialogOpen(true);
      return;
    }
    setIsOrderConfirmOpen(true);
  };

  const handleConfirmOrder = async () => {
    try {
      setIsProcessing(true);
      
      const itemDescriptions = items.map(item => 
        `${item.book.title} x${item.quantity}`
      ).join(', ');
      
      const description = `Book order: ${itemDescriptions}`;
      const amountIn$ = Math.round(totalPrice / 25000);
      
      const response = await createPayment({
        app_user: user?.id || 'guest',
        amount: totalPrice,
        description: description
      });
      
      if (response && response.order_url) {
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
    let attempts = 0;
    const maxAttempts = 60; // Poll for 5 minutes max (60 * 5 seconds)
    
    const checkInterval = setInterval(async () => {
      try {
        attempts++;
        const statusResponse = await checkPaymentStatus({
          app_trans_id: appTransId
        });
        
        console.log('Payment status check:', statusResponse);
        
        if (statusResponse.return_code === 1) {
          // Thanh toán thành công
          clearInterval(checkInterval);
          handlePaymentSuccess();
        } 
        else if (statusResponse.return_code === 2) {
          // Thanh toán thất bại
          clearInterval(checkInterval);
          handlePaymentFailure('Payment failed');
        }
        else if (attempts >= maxAttempts) {
          // Hết thời gian chờ
          clearInterval(checkInterval);
          handlePaymentFailure('Payment timeout. The payment window may have been closed.');
          setIsProcessing(false);
        }
        // Các trường hợp khác (return_code = 0 hoặc -1) tiếp tục poll
        // Đây là trạng thái bình thường trong sandbox khi đang chờ thanh toán
      } catch (error) {
        console.error('Error checking payment status:', error);
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          handlePaymentFailure('Could not verify payment status');
          setIsProcessing(false);
        }
      }
    }, 5000); // Check every 5 seconds
    
    // Cleanup function
    return () => {
      clearInterval(checkInterval);
    };
  };
  
  const generateInt32Id = () => Math.floor(Math.random() * 2_000_000_000); // An toàn dưới ngưỡng int32
  // Hàm này tạo một ID ngẫu nhiên trong khoảng từ 0 đến 2 tỷ, phù hợp với kiểu int32
  
  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    alert('Payment successful! Your order has been placed.');
    
    // Tạo bill từ cart items
    if (isAuthenticated && user) {
      const createBill = async () => {
        try {
          // Tạo đối tượng Bill từ cart items với idClient là số điện thoại
          const bill: Bill = {
          Cart: items.map(item => ({
            idCart: generateInt32Id(),
            idCategory: item.book.category ? parseInt(item.book.category) : 0,
            idPartner: item.book.author,
            idProduct: parseInt(item.book.id),
            imgProduct: item.book.coverImage,
            nameProduct: item.book.title,
            numberProduct: item.quantity,
            priceProduct: item.book.price,
            totalPrice: item.book.price * item.quantity,
            userClient: user.phoneNumber
          })),
          dayOut: new Date().toISOString().split('T')[0],
          idBill: generateInt32Id(),
          idClient: user.phoneNumber,
          idPartner: 'admin',
          status: 'Yes',
          timeOut: new Date().toTimeString().split(' ')[0],
          total: totalPrice
        };

          
          // Gọi API để tạo bill
          await axios.post<BillResponse>(`${import.meta.env.VITE_API_URL}/bills/addBill`, bill);
          
          // Xóa giỏ hàng sau khi tạo bill thành công
          clearCart();
        } catch (error) {
          console.error('Failed to create bill:', error);
        }
      };
      
      createBill();
    } else {
      clearCart(); // Vẫn xóa giỏ hàng nếu không đăng nhập
    }
    
    onClose(); // Đóng dialog
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
                {/* Thay thế hình ảnh bằng SVG icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-32 h-32 text-gray-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
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
                            {(item.book.price * item.quantity).toFixed(2)}đ
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
                  <span className="font-bold">{totalPrice.toFixed(2)}đ</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)}đ</span>
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
                      ? 'Proceed to Checkout' 
                      : 'Sign In to Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    <SignInDialog isOpen={isSignInDialogOpen} onClose={() => setIsSignInDialogOpen(false)} />
    <OrderConfirmDialog 
      isOpen={isOrderConfirmOpen} 
      onClose={() => setIsOrderConfirmOpen(false)} 
      onConfirm={handleConfirmOrder}
    />
  </>;
};

export default CartDialog;
