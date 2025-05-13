import React, { useEffect, useState, createContext, useContext } from 'react'
type Language = 'en' | 'vi'
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
)
export const translations = {
  en: {
    // Header
    'search.placeholder': 'Search by title, author, or keyword',
    'nav.home': 'Home',
    'nav.favorites': 'Favorites',
    'nav.signin': 'Sign In',
    'nav.createAccount': 'Create an Account',
    'nav.myAccount': 'My Account',
    'nav.orderHistory': 'Order History',
    'nav.savedItems': 'Saved Items',
    'nav.signOut': 'Sign Out',
    'cart.title': 'Your Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',

    // Footer
    'footer.aboutUs': 'About Us',
    'footer.customerService': 'Customer Service',
    'footer.quickLinks': 'Quick Links',
    'footer.stayConnected': 'Stay Connected',
    'footer.subscribe': 'Subscribe',
    'footer.emailPlaceholder': 'Your email address',

    // Common
    'button.shopNow': 'Shop Now',
    'button.viewAll': 'View All',
    'button.addToCart': 'Add to Cart',
    'button.checkout': 'Checkout',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.createAccount': 'Create Account',
    'auth.close': 'Close',
    'auth.namePlaceholder': 'Full Name',
    'auth.addressPlaceholder': 'Address',
    'auth.phonePlaceholder': 'Phone Number',
    'auth.passwordPlaceholder': 'Password',
    'auth.showPassword': 'Show password',
    'auth.hidePassword': 'Hide password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signingIn': 'Signing in...',
    'auth.creatingAccount': 'Creating account...',
    'auth.alreadyHaveAccount': 'Already have an account? Sign in',
    'auth.needAccount': "Don't have an account? Sign up",
    'auth.termsText': 'By continuing, you agree to our',
    'auth.termsOfUse': 'Terms of Use',
    'auth.andText': 'and',
    'auth.privacyPolicy': 'Privacy Policy',

    // Cart
    'cart.subtotal': 'Subtotal',
    'cart.items': 'items',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.clearCart': 'Clear Cart',
    'cart.proceedToCheckout': 'Proceed to Checkout',
    'cart.signInToCheckout': 'Sign In to Checkout',

    // Support
    'support.title': 'Customer Support',
    'support.greeting': 'Hello! How can we help you today?',
    'support.messagePlaceholder': 'Type your message...',
    'support.team': 'Support Team',
    'support.justNow': 'Just now',

    // Error messages
    'error.signupFailed': 'Failed to create account. Please try again.',
    'error.invalidCredentials': 'Invalid phone number or password.'
  },
  vi: {
    // Header
    'search.placeholder': 'Tìm theo tên, tác giả hoặc từ khóa',
    'nav.home': 'Trang chủ',
    'nav.favorites': 'Yêu thích',
    'nav.signin': 'Đăng nhập', 
    'nav.createAccount': 'Tạo tài khoản',
    'nav.myAccount': 'Tài khoản',
    'nav.orderHistory': 'Lịch sử đơn hàng',
    'nav.savedItems': 'Đã lưu',
    'nav.signOut': 'Đăng xuất',
    'cart.title': 'Giỏ hàng của bạn',
    'cart.empty': 'Giỏ hàng trống',
    'cart.continueShopping': 'Tiếp tục mua sắm',

    // Footer
    'footer.aboutUs': 'Về chúng tôi',
    'footer.customerService': 'Dịch vụ khách hàng',
    'footer.quickLinks': 'Liên kết nhanh', 
    'footer.stayConnected': 'Giữ liên lạc',
    'footer.subscribe': 'Đăng ký',
    'footer.emailPlaceholder': 'Địa chỉ email của bạn',

    // Common
    'button.shopNow': 'Mua ngay',
    'button.viewAll': 'Xem tất cả',
    'button.addToCart': 'Thêm vào giỏ',
    'button.checkout': 'Thanh toán',

    // Auth
    'auth.signIn': 'Đăng nhập',
    'auth.createAccount': 'Tạo tài khoản',
    'auth.close': 'Đóng',
    'auth.namePlaceholder': 'Họ và tên',
    'auth.addressPlaceholder': 'Địa chỉ',
    'auth.phonePlaceholder': 'Số điện thoại',
    'auth.passwordPlaceholder': 'Mật khẩu',
    'auth.showPassword': 'Hiện mật khẩu',
    'auth.hidePassword': 'Ẩn mật khẩu',
    'auth.rememberMe': 'Ghi nhớ đăng nhập',
    'auth.forgotPassword': 'Quên mật khẩu?',
    'auth.signingIn': 'Đang đăng nhập...',
    'auth.creatingAccount': 'Đang tạo tài khoản...',
    'auth.alreadyHaveAccount': 'Đã có tài khoản? Đăng nhập ngay',
    'auth.needAccount': 'Chưa có tài khoản? Đăng ký ngay',
    'auth.termsText': 'Bằng việc tiếp tục, bạn đồng ý với',
    'auth.termsOfUse': 'Điều khoản sử dụng',
    'auth.andText': 'và',
    'auth.privacyPolicy': 'Chính sách bảo mật',

    // Cart
    'cart.subtotal': 'Tạm tính',
    'cart.items': 'sản phẩm',
    'cart.shipping': 'Phí vận chuyển',
    'cart.free': 'Miễn phí',
    'cart.total': 'Tổng cộng',
    'cart.clearCart': 'Xóa giỏ hàng',
    'cart.proceedToCheckout': 'Tiến hành thanh toán',
    'cart.signInToCheckout': 'Đăng nhập để thanh toán',

    // Support
    'support.title': 'Hỗ trợ khách hàng',
    'support.greeting': 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
    'support.messagePlaceholder': 'Nhập tin nhắn của bạn...',
    'support.team': 'Đội ngũ hỗ trợ',
    'support.justNow': 'Vừa xong',

    // Error messages
    'error.signupFailed': 'Tạo tài khoản thất bại. Vui lòng thử lại.',
    'error.invalidCredentials': 'Số điện thoại hoặc mật khẩu không chính xác.'
  }
}
export const LanguageProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved === 'vi' ? 'vi' : 'en') as Language
  })
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])
  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    )
  }
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
