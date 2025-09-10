// App.jsx - Updated với Account Management
import React, { useState, useEffect, useMemo } from "react";
import { ConfigProvider, theme } from "antd";
import viVN from "antd/locale/vi_VN";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductList from "./components/ProductList";
import AdminLayout from "./components/AdminLayout";
import AddProductPage from "./pages/AddProductPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import VoucherManagement from "./components/VoucherManagement.jsx";
import OrderManagement from "./components/OrderManagement.jsx";
import CategoryManagement from "./components/CategoryManagement.jsx";
import SalesManagement from "./components/SalesManagement.jsx";
import CustomerManagement from "./components/CustomerManagement.jsx";
import StaffManagement from "./components/StaffManagement.jsx";
import "./styles/auth.css";
import "./styles/dark-theme.css";
import "./styles/admin-layout.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SizeManagement from "./components/SizeManagement.jsx";

const AppRoutes = () => {
  console.log("Test");

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userToken, setUserToken] = useState(null); // Added for compatibility

  // Navigation states
  const [currentPage, setCurrentPage] = useState("dashboard"); //
  // Get theme from context
  const { isDarkMode, toggleTheme } = useTheme();

  // Stable menu handler - KHÔNG BAO GIỜ THAY ĐỔI
  const handleMenuClick = useMemo(
    () => menuKey => {
      console.log("Menu clicked:", menuKey);

      switch (menuKey) {
        case "product-list":
          setCurrentPage("products");
          break;
        case "add-product":
          setCurrentPage("add-product");
          break;
        case "dashboard":
          setCurrentPage("dashboard");
          break;
        case "statistics":
          setCurrentPage("statistics");
          break;
        case "categories":
          setCurrentPage("categories");
          break;
        case "vouchers":
          setCurrentPage("vouchers");
          break;
        case "orders":
          setCurrentPage("orders");
          break;
        case "customer-management":
          setCurrentPage("customer-management");
          break;
        case "staff-management":
          setCurrentPage("staff-management");
          break;
        case "sales":
          setCurrentPage("sales");
          break;
        default:
          console.log("Unknown menu:", menuKey);
      }
    },
    [],
  ); // EMPTY DEPENDENCY - never changes

  // Check if user is already logged in on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken) {
      try {
        setAccessToken(storedToken);
        setUserToken(storedToken); // Set both tokens
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  // Updated Login success handler
  const handleLoginSuccess = (token, userData = null) => {
    setIsAuthenticated(true);
    setAccessToken(token);
    setUserToken(token); // Set both tokens for compatibility
    setCurrentUser({
      username: userData?.username || "admin",
      role: userData?.role || "Administrator",
    });
    setCurrentPage("products");

    // Store user data for persistence
    localStorage.setItem("accessToken", token);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: userData?.username || "admin",
        role: userData?.role || "Administrator",
      }),
    );
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessToken(null);
    setUserToken(null);

    // Clear stored data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const handleNavigateToProducts = () => {
    setCurrentPage("products");
  };

  const handleNavigateToAddProduct = () => {
    setCurrentPage("add-product");
    console.log("Navigate to Add Product page");
  };
  const handleIsAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Render placeholder for new pages (simplified since now wrapped in AdminLayout)
  const renderPlaceholderPage = (pageName, pageTitle, icon) => (
    <div
      style={{
        padding: "24px",
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "48px",
          background: isDarkMode ? "#1f1f1f" : "#f5f5f5",
          borderRadius: "12px",
          border: `2px dashed ${isDarkMode ? "#434343" : "#d9d9d9"}`,
          color: isDarkMode ? "#ffffff" : "#333333",
        }}
      >
        <h2 style={{ color: "#1890ff", marginBottom: "16px" }}>
          {icon} {pageTitle}
        </h2>
        <p style={{ color: isDarkMode ? "#aaa" : "#666", marginBottom: "24px" }}>
          Trang này đang được phát triển...
        </p>
        <button
          onClick={() => handleMenuClick("product-list")}
          style={{
            padding: "8px 16px",
            background: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Quay lại danh sách sản phẩm
        </button>
      </div>
    </div>
  );
  const renderCurrentPage = () => {
    return (
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage
                  handleIsAuthenticated={handleIsAuthenticated}
                  onLoginSuccess={handleLoginSuccess}
                />
              ) : (
                <Navigate to="/products" replace />
              )
            }
          />

          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <RegisterPage handleIsAuthenticated={handleIsAuthenticated} />
              ) : (
                <Navigate to="/products" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/add-product"
            element={
              isAuthenticated ? (
                <AddProductPage
                  currentUser={currentUser}
                  onNavigateBack={handleNavigateToProducts}
                  onMenuClick={handleMenuClick}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="dashboard"
                >
                  <Dashboard />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/vouchers"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="vouchers"
                >
                  <VoucherManagement />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/statistics"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="statistics"
                >
                  {renderPlaceholderPage("statistics", "Trang Thống Kê", "📈")}
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/categories"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="categories"
                >
                  <CategoryManagement />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/sizes"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="sizes"
                >
                  <SizeManagement />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/orders"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="orders"
                >
                  <OrderManagement />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/customer-management"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="customer-management"
                >
                  <CustomerManagement
                    token={accessToken}
                    userToken={userToken}
                    currentUser={currentUser}
                  />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/staff-management"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="staff-management"
                >
                  <StaffManagement
                    token={accessToken}
                    userToken={userToken}
                    currentUser={currentUser}
                  />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/sales"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="sales"
                >
                  <SalesManagement
                    token={accessToken}
                    userToken={userToken}
                    currentUser={currentUser}
                  />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/products"
            element={
              isAuthenticated ? (
                <AdminLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onMenuClick={handleMenuClick}
                  currentPage="products"
                >
                  <ProductList
                    token={accessToken}
                    userToken={userToken}
                    currentUser={currentUser}
                    onNavigateToAddProduct={handleNavigateToAddProduct}
                    onMenuClick={handleMenuClick}
                    currentPage="products"
                    onLogout={handleLogout}
                  />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default route */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/products" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    );
  };

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
          colorSuccess: "#52c41a",
          colorWarning: "#faad14",
          colorError: "#ff4d4f",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
          },
          Modal: {
            borderRadius: 12,
          },
        },
      }}
    >
      <div className="app">
        {/* Only show theme toggle for non-authenticated users */}
        {!isAuthenticated && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 1000,
              background: isDarkMode ? "rgba(31, 31, 31, 0.9)" : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            }}
          >
            <button
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: isDarkMode ? "#faad14" : "#1890ff",
                fontSize: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        )}
        <div className="app-content">{renderCurrentPage()}</div>
      </div>
    </ConfigProvider>
  );
};

// Main App component with ThemeProvider wrapper
const App = () => {
  console.log("test");

  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
