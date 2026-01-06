import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import { MainLayout } from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AuthLayout from "./components/layout/AuthLayout";

import HomePage from "./pages/home/HomePage";
import Shirt from "./pages/shirt/shirt";
import ProductDetails from "./pages/admin/ProductDetails";
import { PurchasePage } from "./pages/admin/PurchasePage";
import ProductAdminPage from "./pages/admin/ProductAdminPage";
import DeliveryPage from "./pages/admin/DeliveryPage";
import ProductDetailCrud from "./pages/admin/ProductDetailCrud";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { NotFoundPage } from "./pages/auth/NotFoundPage";
import CategoryPage from "./pages/admin/CategoryPage";
import UserPage from "./pages/admin/UserPage";

function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* Auth routes */}
          <Route path="auth" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* User routes */}
          <Route path="/user" element={<MainLayout />}>
            <Route index element={<Shirt />} />
            <Route path="shirt" element={<Shirt />} />
            <Route path="purchase" element={<PurchasePage />} />
            <Route path="product/:id" element={<ProductDetails />} />
          </Route>

           {/* <Route path="/admin" element={ <AdminLayout />}>
          <Route index element={<ProductAdminPage />} />
          <Route path="productAdmin" element={<ProductAdminPage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="Product_Detail" element={<ProductDetailCrud />} />
        </Route> */}

          {/* Admin routes (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProductAdminPage />} />
            <Route path="productAdmin" element={<ProductAdminPage />} />
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="productDetail" element={<ProductDetailCrud />} />
            <Route path="category" element={<CategoryPage />} />
            {/* <Route path="userPage" element={<UserPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
