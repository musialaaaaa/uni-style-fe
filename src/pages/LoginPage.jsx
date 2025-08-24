import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Divider,
  message,
  Checkbox,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";

const { Title, Text, Link } = Typography;

const LoginPage = ({ handleIsAuthenticated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchSignIn } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async values => {
    setLoading(true);
    try {
      // Call real API
      const signInInput = {
        username: values.username,
        password: values.password,
      };
      const response = await fetchSignIn(signInInput);

      if (response.message === "OK") {
        messageApi.success("Đăng nhập thành công!");

        console.log(response);

        // Store tokens in localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        handleIsAuthenticated()
      } else {
        // Handle error response from API
        if (response.error) {
          // Show the exact error messageApi from API
          messageApi.error(response.error);
        } else if (response.message && response.message !== "OK") {
          // Show message field if available
          messageApi.error(response.message);
        } else {
          // Fallback error messageApi based on status code
          if (response.status === 401) {
            messageApi.error("Đăng nhập thất bại do sai mật khẩu hoặc tên đăng nhập!");
          } else if (response.status === 403) {
            messageApi.error("Tài khoản bị khóa hoặc không có quyền truy cập!");
          } else {
            messageApi.error("Đăng nhập thất bại!");
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle network or parsing errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        message.error("Không thể kết nối đến máy chủ!");
      } else {
        message.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay" />
      </div>

      {contextHolder}

      <div className="auth-content">
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={22} sm={18} md={12} lg={8} xl={6}>
            <Card className="auth-card" bordered={false}>
              {/* Logo & Brand */}
              <div className="auth-header">
                <div className="auth-logo">
                  <div className="logo-icon">U</div>
                </div>
                <Title level={2} className="auth-title">
                  UNI <span className="brand-blue">STYLE</span>
                  <sup>®</sup>
                </Title>
                <Text className="auth-subtitle">Hệ thống quản lý thời trang</Text>
              </div>

              <Divider />

              {/* Login Form */}
              <Form
                form={form}
                name="login"
                layout="vertical"
                onFinish={handleLogin}
                autoComplete="off"
                size="large"
                className="auth-form"
              >
                <Form.Item
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                    { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 3, message: "Mật khẩu phải có ít nhất 3 ký tự!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item>
                  <div className="auth-options">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <Link className="auth-forgot-link">Quên mật khẩu?</Link>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<LoginOutlined />}
                    block
                    className="auth-submit-btn"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>

              <Divider>
                <Text type="secondary">Hoặc</Text>
              </Divider>

              {/* Register Link */}
              <div className="auth-footer">
                <Text>
                  Chưa có tài khoản?{" "}
                  <Link onClick={() => navigate("/register")} className="auth-switch-link">
                    <UserAddOutlined /> Đăng ký ngay
                  </Link>
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginPage;
