import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "../styles/dashboard.css";
import useProducts from "../hooks/product";
import { DatePicker, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import useAccount from "../hooks/account";
import useOrders from "../hooks/orders";
import useStatistics from "../hooks/statistics";
import dayjs from "dayjs";
import { formatVietnameseCurrency } from "../utils";

const Dashboard = ({ messageApi }) => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const { products, fetchProducts, loading: loadingProducts } = useProducts();
  const { accounts, getAccount, loading: loadingAccounts } = useAccount();
  const { orders, getOrders, loading: loadingOrders } = useOrders();
  const { statistics, getStatistics, loading: loadingStatistics } = useStatistics();

  const navigate = useNavigate();

  const handleFilter = () => {
    getStatistics({
      startDate: dayjs(startDate).format("YYYY-MM-DD"),
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
    });
  };

  const loading = loadingProducts || loadingAccounts || loadingOrders || loadingStatistics;
  useEffect(() => {
    fetchProducts();
    getAccount();
    getOrders();
    getStatistics({
      startDate: dayjs(startDate).format("YYYY-MM-DD"),
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
    });
  }, []);

  const StatCard = ({
    title,
    value,
    color,
    icon,
    className,
    detailText = "Xem chi tiết →",
    onClick,
  }) => (
    <div className={`stat-card ${className}`} onClick={onClick}>
      <div className="stat-card-header">
        <span className="stat-card-icon" style={{ color }}>
          {icon}
        </span>
        <h4 className="stat-card-title" style={{ color }}>
          {title}
        </h4>
      </div>
      <div className="stat-card-value">{value}</div>
      <button className="stat-card-button" style={{ color }}>
        {detailText}
      </button>
    </div>
  );

  const IconCard = ({ title, icon, color, className }) => (
    <div className={`icon-card ${className}`}>
      <div className="icon-card-icon">{icon}</div>
      <h4 className="icon-card-title" style={{ color }}>
        {title}
      </h4>
    </div>
  );

  const Card = ({ title, children, className = "" }) => (
    <div className={`dashboard-card ${className}`}>
      {title && (
        <div className="dashboard-card-header">
          <h3 className="dashboard-card-title">{title}</h3>
        </div>
      )}
      <div className="dashboard-card-content">{children}</div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {loading && <Spin spinning={loading} className="loading" tip="Đang tải..."></Spin>}
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      {/* Shop Stats Section */}
      <Card title="📊 Shop" className="shop-stats-card">
        <div className="stats-grid">
          <StatCard
            onClick={() => navigate("/products")}
            title="TỔNG SẢN PHẨM"
            value={products.length}
            color="#1890ff"
            icon="👕"
            className="stat-card-blue"
          />
          <StatCard
            onClick={() => navigate("/orders")}
            title="TỔNG ĐƠN HÀNG"
            value={orders.length}
            color="#fa8c16"
            icon="🛒"
            className="stat-card-orange"
          />
          <StatCard
            onClick={() => navigate("/customer-management")}
            title="TỔNG NGƯỜI DÙNG"
            value={accounts.length}
            color="#722ed1"
            icon="👥"
            className="stat-card-purple"
          />
        </div>
      </Card>

      <Card className="date-filter-card">
        <div className="date-filter-container">
          <span className="date-label">Từ ngày</span>
          <DatePicker
            value={startDate ? dayjs(startDate) : null}
            maxDate={endDate ? dayjs(endDate) : null}
            dateFormat="dd/MM/yyyy"
            onChange={date => setStartDate(date)}
            className="date-input"
          />

          <span className="date-label">Đến ngày</span>
          <DatePicker
            minDate={startDate ? dayjs(startDate) : null}
            maxDate={dayjs(new Date())}
            value={endDate ? dayjs(endDate) : null}
            dateFormat="dd/MM/yyyy"
            onChange={date => {
              setEndDate(date);
              // Set startDate to 7 days before the selected endDate
              const newStartDate = new Date(date);
              newStartDate.setDate(newStartDate.getDate() - 7);
              setStartDate(newStartDate);
            }}
            className="date-input"
          />

          <button onClick={handleFilter} className="filter-button primary">
            🔍 Lọc
          </button>
        </div>
      </Card>

      {/* Stats Cards Row */}
      <div className="icon-cards-grid">
        <IconCard title="ĐƠN HÀNG" icon="🗑️" color="#fa8c16" className="icon-card-orange" />
        <IconCard title="TỔNG DOANH THU" icon="📊" color="#1890ff" className="icon-card-blue" />
      </div>

      {/* Main Content Row */}
      <div className="main-content-grid">
        {/* Revenue Chart */}
        <Card title="📊 Doanh thu UniStyle" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={statistics?.dailyReports?.map(item => ({
                  name: `${item.date}`,
                  value: item.revenue,
                }))}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={value => [`${value.toLocaleString()}₫`, "Doanh thu"]} />
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
                {orders.map(
                  (order, index) =>
                    index < 3 && (
                      <tr key={index}>
                        <td className="order-id">{order?.code}</td>
                        <td className="customer-cell">
                          <div className="customer-info">
                            <div className="customer-avatar">👤</div>
                            <span>{order.fullName}</span>
                          </div>
                        </td>
                        <td className="amount-cell">
                          {formatVietnameseCurrency(order.totalAmount)}
                        </td>
                        <td className="status-cell">
                          <span className={`status-badge ${order.status}`}>
                            {order.status === "COMPLETED"
                              ? "Hoàn thành"
                              : order.status === "CANCELLED"
                              ? "Đã hủy"
                              : "Chưa xử lý"}
                          </span>
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Additional Quick Stats */}
      <div className="quick-stats-grid">
        <Card className="quick-stat-card">
          <div className="quick-stat-content">
            <h4 className="quick-stat-title">Doanh thu trung bình/đơn</h4>
            <div className="quick-stat-value average-revenue">
              💰 {formatVietnameseCurrency(statistics?.totalRevenue)}
            </div>
          </div>
        </Card>

        <Card className="quick-stat-card">
          <div className="quick-stat-content">
            <h4 className="quick-stat-title">Khách hàng mới</h4>
            <div className="quick-stat-value new-customers">
              👥 {statistics?.totalNewCustomer} / tháng
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
