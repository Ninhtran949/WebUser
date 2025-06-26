import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Clock, Star } from 'lucide-react';
import { getRelatedBooks } from '../services/bookService';

// Định nghĩa type cho sách hiển thị
interface BookCard {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: string;
  originalPrice?: string;
  rating: number;
}

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);

  // Lấy mã đơn hàng và thời gian đặt hàng từ query string hoặc state
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId') || (location.state && location.state.orderId) || '#1750912488910';
  const orderTime = params.get('orderTime') || (location.state && location.state.orderTime) || new Date().toLocaleDateString('vi-VN');

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8">
      <div
        className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-10 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được thanh toán thành công.
          </p>
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
              <span className="text-gray-900 font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Thời gian đặt hàng:</span>
              <span className="text-gray-900">{orderTime}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              Về trang chủ
            </button>
            <button
              onClick={() => navigate('/account/orders')}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Clock className="mr-2 h-5 w-5" />
              Xem lịch sử đơn hàng
            </button>
          </div>
        </div>
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-700">
                Đơn hàng của bạn sẽ được xử lý trong vòng 24 giờ
              </p>
            </div>
          </div>
        </div>
      </div>
      <RelatedBooksSection />
    </div>
  );
};

function RelatedBooksSection() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || (location.state && location.state.category) || '';
  const currentBookId = params.get('bookId') || (location.state && location.state.bookId) || '';
  const [books, setBooks] = useState<BookCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!category) {
          setBooks([]);
          setLoading(false);
          return;
        }
        const apiBooks = await getRelatedBooks(category, currentBookId);
        setBooks(apiBooks.map(book => {
          // fallback giá gốc nếu không có
          let originalPrice = '';
          if (book.productId && (book.productId as any).originalPriceProduct) {
            originalPrice = `${parseInt((book.productId as any).originalPriceProduct).toLocaleString()}đ`;
          } else if (book.productId && book.productId.priceProduct) {
            // fallback: tăng 20% làm giá gốc nếu không có
            const price = parseInt(book.productId.priceProduct);
            originalPrice = `${Math.round(price * 1.2).toLocaleString()}đ`;
          }
          return {
            id: book._id,
            title: book.productId?.nameProduct || book.title || 'Untitled',
            author: book.productId?.userPartner || book.author || 'Unknown',
            cover: book.productId?.imgProduct || '',
            price: book.productId?.priceProduct ? `${parseInt(book.productId.priceProduct).toLocaleString()}đ` : '0đ',
            originalPrice,
            rating: (book as any).rating || 4.5,
          };
        }));
      } catch (err) {
        setError('Không thể tải sách liên quan');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [category, currentBookId]);

  if (loading) return null;
  if (error || !books || books.length === 0) return null;

  return (
    <div className="mt-16 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Có thể bạn cũng thích</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.slice(0, 4).map((book) => (
          <div key={book.id} className="group">
            <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="aspect-w-2 aspect-h-3 overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {book.originalPrice && book.originalPrice !== book.price && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                  -
                  {Math.round(
                    ((parseInt(book.originalPrice.replace(/\D/g, '')) - parseInt(book.price.replace(/\D/g, ''))) /
                      parseInt(book.originalPrice.replace(/\D/g, '')))
                      * 100
                  )}%
                </div>
              )}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">{book.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{book.author}</p>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="ml-1 text-xs text-gray-600">{book.rating}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-red-600">{book.price}</span>
                    {book.originalPrice && (
                      <span className="ml-2 text-xs text-gray-500 line-through">{book.originalPrice}</span>
                    )}
                  </div>
                  <button className="text-xs text-white bg-blue-700 hover:bg-blue-800 rounded-full px-3 py-1 transition-colors">
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentResult;
