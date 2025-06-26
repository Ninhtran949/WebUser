import { XIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { decryptData } from '../utils/encryption';

interface OrderConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OrderConfirmDialog = ({ isOpen, onClose, onConfirm }: OrderConfirmDialogProps) => {
  const { items } = useCart();
  const { user } = useAuth();

  // Decrypt user data
  const decryptedName = user?.name ? decryptData(user.name) : '';
  const decryptedAddress = user?.address ? decryptData(user.address) : '';

  if (!isOpen) return null;

  const totalPrice = items.reduce((total, item) => total + item.book.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl relative">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Order Confirmation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.book.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.book.title}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-medium">{(item.book.price * item.quantity).toFixed(2)}đ</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2">
              <p><span className="text-gray-600">Name:</span> {decryptedName}</p>
              <p><span className="text-gray-600">Phone:</span> {user?.phoneNumber}</p>
              <p><span className="text-gray-600">Address:</span> {decryptedAddress}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{totalPrice.toFixed(2)}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)}đ</span>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition"
            >
              Pay with ZaloPay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmDialog;