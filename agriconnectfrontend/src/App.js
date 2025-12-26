// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import SoilInfo from "./components/soil/SoilInfo";
import ExpertQueryForm from "./components/expert/ExpertQueryForm";

// Auth
import RoleBasedLoginForm from "./auth/RoleBasedLoginForm";
import RegisterForm from "./auth/RegisterForm";
import ForgotPassword from "./auth/ForgotPassword";

// Buyer
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import QueryHistory from "./components/expert/QueryHistory";

// Vendor
import VendorDashboard from "./pages/VendorDashboard";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

// Expert
import ExpertDashboard from "./pages/ExpertDashboard";

// Payment
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/soilinfo" element={<SoilInfo />} />
              <Route path="/expert-query" element={<ExpertQueryForm />} />

              {/* Auth */}
              <Route path="/login" element={<RoleBasedLoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Payment */}
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/paymentsuccess" element={<PaymentSuccessPage />} />

              {/* Buyer Routes */}
              <Route
                path="/buyer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/query-history"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <QueryHistory />
                  </ProtectedRoute>
                }
              />

              {/* Vendor Routes */}
              <Route
                path="/vendor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["VENDOR"]}>
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Expert Routes */}
              <Route
                path="/expert-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["EXPERT"]}>
                    <ExpertDashboard />
                  </ProtectedRoute>
                }
              />


<Route
  path="/query-history"
  element={
    <ProtectedRoute allowedRoles={["USER"]}>
      <QueryHistory />
    </ProtectedRoute>
  }
/>








            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
