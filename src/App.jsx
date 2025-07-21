// App.jsx - Updated với Account Management
import React, { useState, useEffect, useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './components/ProductList';
import AdminLayout from './components/AdminLayout';
import AddProductPage from './pages/AddProductPage.jsx';
import Dashboard from './components/Dashboard.jsx';
// import VoucherManagement from './components/VoucherManagement.jsx';
// import OrderManagement from './components/OrderManagement.jsx';
// import CategoryManagement from './components/CategoryManagement.jsx';
// import SalesManagement from './components/SalesManagement.jsx';
// import CustomerManagement from './components/CustomerManagement.jsx';
// import StaffManagement from './components/StaffManagement.jsx';
import './styles/auth.css';
import './styles/dark-theme.css';
import './styles/admin-layout.css';

const AppContent = () => {
    // Auth states
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [userToken, setUserToken] = useState(null); // Added for compatibility

    // Navigation states
    const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'products', 'add-product', 'dashboard', 'statistics', etc.

    // Get theme from context
    const { isDarkMode, toggleTheme } = useTheme();

    // Stable menu handler - KHÔNG BAO GIỜ THAY ĐỔI
    const handleMenuClick = useMemo(() => (menuKey) => {
        console.log('Menu clicked:', menuKey);

        switch (menuKey) {
            case 'product-list':
                setCurrentPage('products');
                break;
            case 'add-product':
                setCurrentPage('add-product');
                break;
            case 'dashboard':
                setCurrentPage('dashboard');
                break;
            case 'statistics':
                setCurrentPage('statistics');
                break;
            case 'categories':
                setCurrentPage('categories');
                break;
            case 'vouchers':
                setCurrentPage('vouchers');
                break;
            case 'orders':
                setCurrentPage('orders');
                break;
            case 'customer-management':
                setCurrentPage('customer-management');
                break;
            case 'staff-management':
                setCurrentPage('staff-management');
                break;
            case 'sales':
                setCurrentPage('sales');
                break;
            default:
                console.log('Unknown menu:', menuKey);
        }
    }, []); // EMPTY DEPENDENCY - never changes

    // Check if user is already logged in on app start
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('currentUser');

        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setAccessToken(storedToken);
                setUserToken(storedToken); // Set both tokens
                setCurrentUser(userData);
                setIsAuthenticated(true);
                setCurrentPage('products');
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // Clear invalid data
                localStorage.removeItem('accessToken');
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    // Updated Login success handler
    const handleLoginSuccess = (token, userData = null) => {
        setIsAuthenticated(true);
        setAccessToken(token);
        setUserToken(token); // Set both tokens for compatibility
        setCurrentUser({
            username: userData?.username || 'admin',
            role: userData?.role || 'Administrator'
        });
        setCurrentPage('products');

        // Store user data for persistence
        localStorage.setItem('accessToken', token);
        localStorage.setItem('currentUser', JSON.stringify({
            username: userData?.username || 'admin',
            role: userData?.role || 'Administrator'
        }));

        console.log('Login successful:', { token, userData });
    };

    // Logout handler
    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAccessToken(null);
        setUserToken(null);
        setCurrentPage('login');

        // Clear stored data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');

        console.log('User logged out');
    };

    // Navigation handlers
    const handleNavigateToLogin = () => {
        setCurrentPage('login');
    };

    const handleNavigateToRegister = () => {
        setCurrentPage('register');
    };

    const handleNavigateToProducts = () => {
        setCurrentPage('products');
    };

    const handleNavigateToAddProduct = () => {
        setCurrentPage('add-product');
        console.log('Navigate to Add Product page');
    };

    // Render placeholder for new pages (simplified since now wrapped in AdminLayout)
    const renderPlaceholderPage = (pageName, pageTitle, icon) => (
        <div style={{
            padding: '24px',
            minHeight: 'calc(100vh - 160px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '48px',
                background: isDarkMode ? '#1f1f1f' : '#f5f5f5',
                borderRadius: '12px',
                border: `2px dashed ${isDarkMode ? '#434343' : '#d9d9d9'}`,
                color: isDarkMode ? '#ffffff' : '#333333'
            }}>
                <h2 style={{ color: '#1890ff', marginBottom: '16px' }}>
                    {icon} {pageTitle}
                </h2>
                <p style={{ color: isDarkMode ? '#aaa' : '#666', marginBottom: '24px' }}>
                    Trang này đang được phát triển...
                </p>
                <button
                    onClick={() => handleMenuClick('product-list')}
                    style={{
                        padding: '8px 16px',
                        background: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    ← Quay lại danh sách sản phẩm
                </button>
            </div>
        </div>
    );

    // Render current page
    const renderCurrentPage = () => {
        if (!isAuthenticated) {
            switch (currentPage) {
                case 'register':
                    return (
                        <RegisterPage
                            onNavigateToLogin={handleNavigateToLogin}
                        />
                    );
                case 'login':
                default:
                    return (
                        <LoginPage
                            onNavigateToRegister={handleNavigateToRegister}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    );
            }
        } else {
            switch (currentPage) {
                case 'add-product':
                    return (
                        <AddProductPage
                            onLogout={handleLogout}
                            currentUser={currentUser}
                            onNavigateBack={handleNavigateToProducts}
                            onMenuClick={handleMenuClick}
                        />
                    );

                case 'dashboard':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <Dashboard />
                        </AdminLayout>
                    );

                case 'vouchers':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <VoucherManagement />
                        </AdminLayout>
                    );

                case 'statistics':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            {renderPlaceholderPage('statistics', 'Trang Thống Kê', '📈')}
                        </AdminLayout>
                    );

                case 'categories':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <CategoryManagement />
                        </AdminLayout>
                    );

                case 'orders':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <OrderManagement />
                        </AdminLayout>
                    );

                case 'customer-management':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <CustomerManagement
                                token={accessToken}
                                userToken={userToken}
                                currentUser={currentUser}
                            />
                        </AdminLayout>
                    );

                case 'staff-management':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <StaffManagement
                                token={accessToken}
                                userToken={userToken}
                                currentUser={currentUser}
                            />
                        </AdminLayout>
                    );

                case 'sales':
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <SalesManagement
                                token={accessToken}
                                userToken={userToken}
                                currentUser={currentUser}
                            />
                        </AdminLayout>
                    );

                case 'products':
                default:
                    return (
                        <AdminLayout
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onMenuClick={handleMenuClick}
                            currentPage={currentPage}
                        >
                            <ProductList
                                token={accessToken}
                                userToken={userToken} // Pass both for compatibility
                                currentUser={currentUser}
                                onNavigateToAddProduct={handleNavigateToAddProduct}
                                onMenuClick={handleMenuClick} // Pass menu handler
                                currentPage={currentPage}
                                onLogout={handleLogout}
                            />
                        </AdminLayout>
                    );
            }
        }
    };

    return (
        <ConfigProvider
            locale={viVN}
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 8,
                    colorSuccess: '#52c41a',
                    colorWarning: '#faad14',
                    colorError: '#ff4d4f',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 1000,
                        background: isDarkMode
                            ? 'rgba(31, 31, 31, 0.9)'
                            : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                    }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '48px',
                                height: '48px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'transparent',
                                color: isDarkMode ? '#faad14' : '#1890ff',
                                fontSize: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="app-content">
                    {renderCurrentPage()}
                </div>
            </div>
        </ConfigProvider>
    );
};

// Main App component with ThemeProvider wrapper
const App = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;