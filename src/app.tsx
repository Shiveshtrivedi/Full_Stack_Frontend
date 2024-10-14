import React, { useEffect } from 'react';
import './styles/global.css';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import SignupPage from './pages/signupPage';
import ProfilePage from './pages/profilePage';
import ProductList from './components/productList';
import ProductPage from './pages/productPage';
import Header from './components/header';
import Footer from './components/footer';
import Cart from './components/cart';
import WishlistPage from './pages/wishlistPage';
import AddProductPage from './pages/addProductPage';
import AdminRoute from './components/adminRoute';
import AdminHistoryPage from './pages/adminHistoryPage';
import CheckoutPage from './pages/checkoutPage';
import OrderHistoryPage from './pages/orderHistoryPage';
import AboutPage from './pages/aboutPage';
import ContactPage from './pages/contactPage';
import PrivacyPolicy from './components/privacyPolicy';
import TermsOfService from './components/termsOfService';
import Help from './components/helpPage';
import SuccessTickAnimation from './components/successTickAnimation';
import { useDispatch } from 'react-redux';
import PaymentPage from './pages/paymentPage';
import NotFoundPage from './components/pageNotFound';
import LoginPage from './pages/loginPage';
import AdminLayout from './components/adminLayout';
import AdminDashboard from './components/adminDashboard';
import UserManagement from './components/userManagement';
import ProductManagement from './components/productManagement';
import SaleReport from './components/saleReport';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storeUserId = localStorage.getItem('userId');
    if (storeUserId) {
      dispatch({ type: 'auth/setUserId', payload: storeUserId });
    }
  }, [dispatch]);

  return (
    <div id="root">
      <Header />
      <main style={{ overflowY: 'auto' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={<PrivateRoute element={<ProductList />} />}
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                element={<PrivateRoute element={<ProfilePage />} />}
              />
            }
          />
          <Route
            path="/products"
            element={<PrivateRoute element={<ProductList />} />}
          />
          <Route
            path="/products/:id"
            element={<PrivateRoute element={<ProductPage />} />}
          />
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
          <Route
            path="/wishList"
            element={<PrivateRoute element={<WishlistPage />} />}
          />
          <Route
            path="/addProduct"
            element={
              <PrivateRoute
                element={<AdminRoute element={<AddProductPage />} />}
              />
            }
          />
          <Route
            path="/adminHistory"
            element={
              <PrivateRoute
                element={<AdminRoute element={<AdminHistoryPage />} />}
              />
            }
          />
          <Route
            path="/checkout"
            element={<PrivateRoute element={<CheckoutPage />} />}
          />
          <Route
            path="/orderHistory"
            element={<PrivateRoute element={<OrderHistoryPage />} />}
          />
          <Route
            path="/about"
            element={<PrivateRoute element={<AboutPage />} />}
          />
          <Route
            path="/contact"
            element={<PrivateRoute element={<ContactPage />} />}
          />
          <Route
            path="/checkout/success"
            element={<PrivateRoute element={<SuccessTickAnimation />} />}
          />
          <Route
            path="/checkout/payment"
            element={<PrivateRoute element={<PaymentPage />} />}
          />
          <Route
            path="/adminDashboard"
            element={
              <PrivateRoute
                element={<AdminRoute element={<AddProductPage />} />}
              />
            }
          />
          <Route path="/checkout/success" element="order success" />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/help" element={<Help />} />
          <Route path="/products/:category" element={<ProductList />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/adminLayout"
            element={
              <PrivateRoute
                element={<AdminRoute element={<AdminLayout />} />}
              />
            }
          >
            <Route
              index
              element={<PrivateRoute element={<AdminDashboard />} />}
            />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="sales" element={<SaleReport />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
