import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { useCart } from '../contexts/CartContext';
import { UserIcon, ShoppingBagIcon, HeartIcon, CreditCardIcon, MapPinIcon, ChevronRightIcon, LogOutIcon, BellIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import type { Cart, OrderHistory, TransformedBill } from '../types/bill';
import { apiClient } from '../utils/apiClient';

const UserAccount = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites } = useFavorites();
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  useEffect(() => {
    // Check if user needs to complete their profile
    if (user && (!user.phoneNumber || user.phoneNumber === ' ' || !user.address || user.address === ' ')) {
      setShowProfileAlert(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      // Skip fetching if profile is incomplete
      if (!user?.phoneNumber || user.phoneNumber === ' ') {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cartItems: Cart[] = await apiClient.get(`/bills/cart/user/${user.phoneNumber}`);

        // Group cart items by idBill
        const groupedOrders = cartItems.reduce((acc: TransformedBill, item: Cart) => {
          const billId = item.idCart.toString();
          if (!acc[billId]) {
            acc[billId] = [];
          }
          acc[billId].push(item);
          return acc;
        }, {});

        // Transform into OrderHistory format 
        const transformedOrders: OrderHistory[] = Object.entries(groupedOrders).map(([billId, items]) => ({
          idBill: billId,
          dayOut: new Date().toISOString(),
          total: items.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
          status: 'completed',
          Cart: items
        }));

        setOrders(transformedOrders);
        setError(null);

      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');

        // Nếu lỗi authentication, redirect về login
        if (err instanceof Error && err.message === 'Please login again') {
          // Có thể gọi logout từ AuthContext
          // logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.phoneNumber, isAuthenticated]);
  const tabs = [
    {
      id: 'profile',
      name: 'Personal Information',
      icon: <UserIcon size={20} />,
      path: '/account/profile'
    },
    {
      id: 'orders',
      name: 'Order History',
      icon: <ShoppingBagIcon size={20} />,
      path: '/account/orders',
      count: orders.length
    },
    {
      id: 'favorites',
      name: 'Saved Items',
      icon: <HeartIcon size={20} />,
      path: '/account/favorites',
      count: favorites.length
    },
    {
      id: 'payment',
      name: 'Payment Methods',
      icon: <CreditCardIcon size={20} />,
      path: '/account/payment'
    },
    {
      id: 'addresses',
      name: 'Address Book',
      icon: <MapPinIcon size={20} />,
      path: '/account/addresses'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <BellIcon size={20} />,
      path: '/account/notifications'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Profile Completion Alert */}
        {showProfileAlert && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please complete your profile to access all features.
                  <Link to="/account/profile" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                    Update Profile
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {user?.strUriAvatar ? (
                  <img
                    src={user.strUriAvatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon size={32} className="text-blue-800" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600">{user?.phoneNumber}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition"
            >
              <LogOutIcon size={20} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-100">
                {tabs.map(tab => (
                  <li key={tab.id}>
                    <Link
                      to={tab.path}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition ${location.pathname === tab.path
                          ? 'bg-blue-50 text-blue-800'
                          : 'text-gray-700'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {tab.icon}
                        <span>{tab.name}</span>
                      </div>
                      <div className="flex items-center">
                        {tab.count !== undefined && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mr-2">
                            {tab.count}
                          </span>
                        )}
                        <ChevronRightIcon size={16} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Routes>
                <Route path="profile" element={<ProfileSettings user={user} />} />
                <Route
                  path="orders"
                  element={
                    <OrderHistory
                      orders={orders}
                      loading={loading}
                      error={error}
                    />
                  }
                />
                <Route path="favorites" element={<SavedItems items={favorites} />} />
                <Route path="payment" element={<PaymentMethods />} />
                <Route path="addresses" element={<AddressBook user={user} />} />
                <Route path="notifications" element={<NotificationSettings />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Profile Settings Component
const ProfileSettings = ({ user }: { user: any }) => {
  const { checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isOAuthUser = !!user?.oauthProvider;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Ưu tiên lấy _id nếu phoneNumber không hợp lệ
    const isValidPhone = user?.phoneNumber && user.phoneNumber.trim() !== '' && user.phoneNumber !== ' ';
    const userIdForUpdate = isValidPhone ? user.phoneNumber : user?.id; // <-- dùng user.id thay vì user._id

    // Nếu vẫn không có _id thì báo lỗi
    if (!userIdForUpdate) {
      setMessage({ type: 'error', text: 'Cannot update profile: missing user identifier.' });
      return;
    }

    // Chọn endpoint phù hợp
    const url = isValidPhone
      ? `${import.meta.env.VITE_API_URL}/user/id/${userIdForUpdate}`
      : `${import.meta.env.VITE_API_URL}/user/oid/${userIdForUpdate}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address
        })
      });

      if (!response.ok) {
        if (response.status === 409) {
          setMessage({ type: 'error', text: 'Phone number already in use' });
        } else {
          setMessage({ type: 'error', text: 'Failed to update profile' });
        }
        return;
      }

      await checkAuth();
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    // Password strength check (same as backend)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
      return;
    }

    try {
      const payload: any = {
        newPassword: formData.newPassword
      };
      if (!isOAuthUser) payload["oldPassword"] = formData.oldPassword;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/change-password/${formData.phoneNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMsg = 'Failed to change password';
        try {
          const data = await response.json();
          if (data && data.message) errorMsg = data.message;
        } catch { }
        setMessage({ type: 'error', text: errorMsg });
        return;
      }
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setFormData(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <p className="text-gray-600 text-sm mt-1">Update your personal details here</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {!isOAuthUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={formData.oldPassword}
                  onChange={e => setFormData({ ...formData, oldPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                  onClick={() => setShowOldPassword(v => !v)}
                >
                  {showOldPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                  onClick={() => setShowNewPassword(v => !v)}
                >
                  {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                  onClick={() => setShowConfirmPassword(v => !v)}
                >
                  {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Order History Component
const OrderHistory = ({
  orders,
  loading,
  error
}: {
  orders: OrderHistory[];
  loading: boolean;
  error: string | null;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">No products were purchased =.=.</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold">Order History</h2>
        <p className="text-gray-600 text-sm mt-1">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBagIcon size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
          <p className="text-gray-600">When you make your first order, it will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.idBill} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Order #{order.idBill}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.dayOut).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${order.total.toFixed(2)}</div>

                  <div className="flex flex-col items-end mt-1">
                    <button className="text-blue-600 text-sm hover:underline mb-1">
                      View Details
                    </button>
                    <button className="text-blue-600 text-sm hover:underline">
                      Write a review
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                <ul className="space-y-2">
                  {order.Cart.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="flex-1">{item.nameProduct} × {item.numberProduct}</span>
                      <span className="text-gray-600">${(item.priceProduct * item.numberProduct).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Saved Items Component
const SavedItems = ({ items }: { items: any[] }) => {
  const { addItem } = useCart();
  const { removeFromFavorites } = useFavorites();
  const { user } = useAuth();

  const handleAddToCart = (book: any) => {
    addItem({
      id: book.id,
      _id: book.id, // Add missing _id property
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
      category: book.category || 'Uncategorized',// Add missing category property
      // Thêm các trường còn thiếu
      productId: null,
      isbn13: '',
      publisher: '',
      publicationDate: new Date().toISOString(),
      pages: 0,
      overview: '',
      editorialReviews: [],
      customerReviews: []
    });
  };

  const handleRemoveFromFavorites = (bookId: string) => {
    if (user?.id) {
      removeFromFavorites(bookId);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold">Saved Items</h2>
        <p className="text-gray-600 text-sm mt-1">Books you've saved for later</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <HeartIcon size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No saved items</h3>
          <p className="text-gray-600">Items you save will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="aspect-w-3 aspect-h-4 mb-4">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <h3 className="font-semibold line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.author}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold">${item.price.toFixed(2)}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// Payment Methods Component
const PaymentMethods = () => {
  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <p className="text-gray-600 text-sm mt-1">Manage your payment methods</p>
      </div>

      <div className="text-center py-8">
        <CreditCardIcon size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No payment methods</h3>
        <p className="text-gray-600">Add a payment method to make checkout easier</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Payment Method
        </button>
      </div>
    </div>
  );
};

// Address Book Component
const AddressBook = ({ user }: { user: any }) => {
  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold">Address Book</h2>
        <p className="text-gray-600 text-sm mt-1">Manage your shipping addresses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Default Address</h3>
          <p className="text-gray-600">{user?.address || 'No address added'}</p>
          <button className="text-blue-600 text-sm hover:underline mt-2">
            Edit Address
          </button>
        </div>
        <div className="border border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center">
          <button className="text-blue-600 hover:text-blue-700 flex items-center">
            <span className="text-2xl mr-2">+</span>
            Add New Address
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = () => {
  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold">Notification Settings</h2>
        <p className="text-gray-600 text-sm mt-1">Manage how you receive notifications</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Order Updates</h3>
            <p className="text-sm text-gray-600">Get notified about your order status</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Promotions</h3>
            <p className="text-sm text-gray-600">Receive updates about sales and promotions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Newsletter</h3>
            <p className="text-sm text-gray-600">Weekly digest of new books and recommendations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;