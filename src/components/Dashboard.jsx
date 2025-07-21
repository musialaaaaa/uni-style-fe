import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import '../styles/dashboard.css';
// Mock data for charts
const revenueData = [
    { name: 'T1', value: 4000 },
    { name: 'T2', value: 3000 },
    { name: 'T3', value: 2000 },
    { name: 'T4', value: 2780 },
    { name: 'T5', value: 1890 },
    { name: 'T6', value: 2390 },
    { name: 'T7', value: 3490 },
    { name: 'T8', value: 4000 },
    { name: 'T9', value: 3200 },
    { name: 'T10', value: 2800 },
    { name: 'T11', value: 3500 },
    { name: 'T12', value: 4200 }
];

// Mock data for recent orders
const recentOrders = [
    {
        id: '#001',
        customer: 'Nguyễn Văn A',
        amount: '1,250,000₫',
        status: 'completed',
        date: '2025-01-20'
    },
    {
        id: '#002',
        customer: 'Trần Thị B',
        amount: '890,000₫',
        status: 'pending',
        date: '2025-01-20'
    },
    {
        id: '#003',
        customer: 'Lê Văn C',
        amount: '2,100,000₫',
        status: 'completed',
        date: '2025-01-19'
    }
];

const Dashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const StatCard = ({ title, value, color, icon, className, detailText = "Xem chi tiết →" }) => (
        <div className={`stat-card ${className}`}>
            <div className="stat-card-header">
                <span className="stat-card-icon" style={{ color }}>{icon}</span>
                <h4 className="stat-card-title" style={{ color }}>
                    {title}
                </h4>
            </div>
            <div className="stat-card-value">
                {value}
            </div>
            <button className="stat-card-button" style={{ color }}>
                {detailText}
            </button>
        </div>
    );

    const IconCard = ({ title, icon, color, className }) => (
        <div className={`icon-card ${className}`}>
            <div className="icon-card-icon">
                {icon}
            </div>
            <h4 className="icon-card-title" style={{ color }}>
                {title}
            </h4>
        </div>
    );

    const Card = ({ title, children, className = '' }) => (
        <div className={`dashboard-card ${className}`}>
            {title && (
                <div className="dashboard-card-header">
                    <h3 className="dashboard-card-title">
                        {title}
                    </h3>
                </div>
            )}
            <div className="dashboard-card-content">
                {children}
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
            </div>

            {/* Shop Stats Section */}
            <Card title="📊 Shop" className="shop-stats-card">
                <div className="stats-grid">
                    <StatCard
                        title="TỔNG SẢN PHẨM"
                        value="14"
                        color="#1890ff"
                        icon="👕"
                        className="stat-card-blue"
                    />
                    <StatCard
                        title="TỔNG LƯỢT XEM"
                        value="10"
                        color="#52c41a"
                        icon="👁️"
                        className="stat-card-green"
                    />
                    <StatCard
                        title="TỔNG ĐƠN HÀNG"
                        value="21"
                        color="#fa8c16"
                        icon="🛒"
                        className="stat-card-orange"
                    />
                    <StatCard
                        title="TỔNG NGƯỜI DÙNG"
                        value="6"
                        color="#722ed1"
                        icon="👥"
                        className="stat-card-purple"
                    />
                </div>
            </Card>

            {/* Date Filter Section */}
            <Card className="date-filter-card">
                <div className="date-filter-container">
                    <span className="date-label">Từ ngày</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="date-input"
                    />
                    <span className="date-label">Đến ngày</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="date-input"
                    />
                    <button className="filter-button primary">
                        🔍 Lọc
                    </button>
                    <button className="filter-button secondary">
                        Khoảng thời gian
                    </button>
                </div>
            </Card>

            {/* Stats Cards Row */}
            <div className="icon-cards-grid">
                <IconCard
                    title="ĐƠN HÀNG"
                    icon="🗑️"
                    color="#fa8c16"
                    className="icon-card-orange"
                />
                <IconCard
                    title="TỔNG DOANH THU"
                    icon="📊"
                    color="#1890ff"
                    className="icon-card-blue"
                />
                <IconCard
                    title="TỔNG GIÁ NHẬP"
                    icon="💰"
                    color="#52c41a"
                    className="icon-card-green"
                />
                <IconCard
                    title="TỔNG GIÁ NHẬP"
                    icon="📈"
                    color="#eb2f96"
                    className="icon-card-pink"
                />
            </div>

            {/* Main Content Row */}
            <div className="main-content-grid">
                {/* Revenue Chart */}
                <Card title="📊 Doanh thu UniStyle" className="chart-card">
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [`${value.toLocaleString()}₫`, 'Doanh thu']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#1890ff"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Orders */}
                <Card title="📋 Đơn hàng gần đây" className="orders-card">
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                            <tr>
                                <th>Đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentOrders.map((order, index) => (
                                <tr key={index}>
                                    <td className="order-id">{order.id}</td>
                                    <td className="customer-cell">
                                        <div className="customer-info">
                                            <div className="customer-avatar">👤</div>
                                            <span>{order.customer}</span>
                                        </div>
                                    </td>
                                    <td className="amount-cell">{order.amount}</td>
                                    <td className="status-cell">
                                            <span className={`status-badge ${order.status}`}>
                                                {order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Additional Quick Stats */}
            <div className="quick-stats-grid">
                <Card className="quick-stat-card">
                    <div className="quick-stat-content">
                        <h4 className="quick-stat-title">Tỷ lệ chuyển đổi</h4>
                        <div className="quick-stat-value conversion-rate">📈 68.5%</div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '68.5%' }}></div>
                        </div>
                    </div>
                </Card>

                <Card className="quick-stat-card">
                    <div className="quick-stat-content">
                        <h4 className="quick-stat-title">Doanh thu trung bình/đơn</h4>
                        <div className="quick-stat-value average-revenue">💰 1,250,000₫</div>
                    </div>
                </Card>

                <Card className="quick-stat-card">
                    <div className="quick-stat-content">
                        <h4 className="quick-stat-title">Khách hàng mới</h4>
                        <div className="quick-stat-value new-customers">👥 12 / tháng</div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;