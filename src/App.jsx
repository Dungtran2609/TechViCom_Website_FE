import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ScrollToTop from './components/ScrollToTop';
import CartPage from './pages/CartPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ThankYouPage from './pages/ThankYouPage.jsx';
import OrderListPage from './pages/OrderListPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import AccountPage from './pages/AccountPage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/dien-thoai" element={<ProductListPage />} />
          <Route path="/products" element={<ProductListPage />} />
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
          {/* Add more routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
