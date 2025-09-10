import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Space,
  Avatar,
  Dropdown,
  Modal,
  Form,
  Input,
  message,
  Switch,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  LockOutlined,
  SunOutlined,
  MoonOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = ({
  children,
  onLogout,
  currentUser = { username: "admin", role: "Administrator" },
  onMenuClick,
  currentPage = "products",
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordForm] = Form.useForm();
  const { isDarkMode, toggleTheme } = useTheme();
  const handleNavigate = page => {
    navigate(`/${page}`);
  };

  // Function để get selected keys dựa vào currentPage
  const getSelectedKeys = () => {
    switch (currentPage) {
      case "products":
        return ["product-list"];
      case "add-product":
        return ["add-product"];
      case "dashboard":
        return ["dashboard"];
      case "statistics":
        return ["statistics"];
      case "categories":
        return ["categories"];
      case "vouchers":
        return ["vouchers"];
      case "orders":
        return ["orders"];
      case "customer-management":
        return ["customer-management"];
      case "staff-management":
        return ["staff-management"];
      case "sales":
        return ["sales"];
      default:
        return ["product-list"];
    }
  };

  // Get open keys for submenu
  const getOpenKeys = () => {
    switch (currentPage) {
      case "products":
      case "add-product":
        return ["products"];
      case "customer-management":
      case "staff-management":
        return ["accounts"];
      default:
        return [];
    }
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "interface",
      icon: <SettingOutlined />,
      label: "INTERFACE",
      type: "group",
    },
    {
      key: "statistics",
      icon: <DashboardOutlined />,
      label: "Thống kê",
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Quản lý sản phẩm",
      children: [
        {
          key: "product-list",
          label: "Danh sách",
        },
        {
          key: "add-product",
          label: "Thêm sản phẩm",
        },
      ],
    },
    {
      key: "categories",
      icon: <TagsOutlined />,
      label: "Quản lý danh mục",
    },
    {
      key: "sizes",
      icon: <StockOutlined />,
      label: "Quản lý kích thước",
    },
    {
      key: "vouchers",
      icon: <TagsOutlined />,
      label: "Quản lý vouchers",
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý đơn hàng",
    },
    {
      key: "accounts",
      icon: <UserOutlined />,
      label: "Quản lý tài khoản",
      children: [
        {
          key: "customer-management",
          label: "Quản lý khách hàng",
        },
        {
          key: "staff-management",
          label: "Quản lý nhân viên",
        },
      ],
    },
    {
      key: "sales",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý bán hàng",
    },
  ];

  const handleChangePassword = async values => {
    try {
      // Call API to change password
      // const response = await changePasswordAPI(values);

      message.success("Đổi mật khẩu thành công!");
      setChangePasswordModal(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error("Đổi mật khẩu thất bại!");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "change-password",
      icon: <LockOutlined />,
      label: "Đổi mật khẩu",
      onClick: () => setChangePasswordModal(true),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: onLogout,
      danger: true,
    },
  ];

  return (
    <Layout
      className={`admin-layout ${isDarkMode ? "dark-theme" : "light-theme"}`}
      style={{ minHeight: "100vh" }}
    >
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}
        width={250}
        style={{
          background: "#5a72c4",
        }}
      >
        {/* Logo */}
        <div className={`admin-logo ${collapsed ? "collapsed" : "expanded"}`}>
          {collapsed ? (
            <div className="admin-logo-icon">U</div>
          ) : (
            <Title level={3} className="admin-logo-text">
              UNI <span className="blue">STYLE</span>
              <sup>®</sup>
            </Title>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          className="admin-menu"
          items={menuItems}
          forceSubMenuRender={true}
          onClick={({ key, domEvent }) => {
            // Prevent event bubbling
            if (domEvent) {
              domEvent.stopPropagation();
            }
            handleNavigate(key);
          }}
          style={{
            background: "transparent",
            border: "none",
          }}
        />

        {/* Collapse Button */}
        <div className="admin-collapse-btn">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 40,
              height: 40,
              color: "white",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className={`admin-header ${collapsed ? "collapsed" : "expanded"}`}>
          {/* Search Bar */}
          <Space>
            <div className="admin-search-bar">
              <input placeholder="Tìm kiếm..." className="admin-search-input" />
              <button className="admin-search-btn">🔍</button>
            </div>
          </Space>

          {/* User Info */}
          <div className="admin-user-menu">
            {/* Theme Toggle */}
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              className="admin-notification-btn"
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            />

            {/* Notifications */}
            <Button type="text" icon={<BellOutlined />} className="admin-notification-btn" />

            {/* User Dropdown */}
            <Dropdown
              menu={{
                items: userMenuItems,
                className: "admin-dropdown-menu",
              }}
              placement="bottomRight"
              arrow
            >
              <div className="admin-user-dropdown">
                <Space>
                  <Avatar className="admin-user-avatar" icon={<UserOutlined />} />
                  <div className="admin-user-info">
                    <div className="admin-user-name">{currentUser?.username}</div>
                    <div className="admin-user-role">{currentUser?.role}</div>
                  </div>
                </Space>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className={`admin-content ${collapsed ? "collapsed" : "expanded"}`}>
          {/* Page content with proper spacing */}
          <div
            style={{
              padding: "24px",
              minHeight: "calc(100vh - 64px)",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>

      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={changePasswordModal}
        onCancel={() => {
          setChangePasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          className="admin-form"
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setChangePasswordModal(false);
                  passwordForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" className="admin-btn-primary">
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminLayout;
