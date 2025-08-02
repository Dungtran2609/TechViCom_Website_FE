// File: src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import { 
  HomePage,
  ProductDetailPage,
  ProductListPage,
  CheckoutPage,
  LoginPage,
  RegisterPage,
  CartPage,
  NewsPage,
  NewsDetailPage,
  CategoryNewsPage,
  ThankYouPage,
  OrderListPage,
  OrderDetailPage,
  AccountPage,
  UpdateProfilePage,
  AboutPage,
  PolicyPage
} from './pages';
import AnimationDemo from './components/AnimationDemo';
import { NotificationProvider } from './components/NotificationSystem';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext'; // ✅ BƯỚC 1: IMPORT AuthProvider
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            
            {/* ✅ BƯỚC 2: ĐẶT AuthProvider Ở ĐÂY */}
            <AuthProvider>
              <Layout> {/* Bây giờ Layout và tất cả con của nó (bao gồm Header) đều có thể dùng useAuth() */}
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/dien-thoai" element={<ProductListPage />} />
                  <Route path="/products" element={<ProductListPage />} />
                  <Route path="/products/:category" element={<ProductListPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/news/:id" element={<NewsDetailPage />} />
                  <Route path="/thankyou" element={<ThankYouPage />} />
                  <Route path="/orders" element={<OrderListPage />} />
                  <Route path="/order/:id" element={<OrderDetailPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/update-profile" element={<UpdateProfilePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/policy" element={<PolicyPage />} />
                  <Route path="/demo" element={<AnimationDemo />} />
                  {/* Add more routes here */}
                </Routes>
              </Layout>
            </AuthProvider>

            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/dien-thoai" element={<ProductListPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:category" element={<ProductListPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/news/category/:categoryId" element={<CategoryNewsPage />} />
                <Route path="/thankyou" element={<ThankYouPage />} />
                <Route path="/orders" element={<OrderListPage />} />
                <Route path="/order/:id" element={<OrderDetailPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/update-profile" element={<UpdateProfilePage />} />
                            <Route path="/about" element={<AboutPage />} />
            <Route path="/policy" element={<PolicyPage />} />
            <Route path="/demo" element={<AnimationDemo />} />
            {/* Add more routes here */}
              </Routes>
            </Layout>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;