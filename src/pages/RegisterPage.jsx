import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Divider,
    message,
    Row,
    Col,
    Progress
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    UserAddOutlined,
    LoginOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import '../styles/auth.css';
import useAuth from "../hooks/auth";
import { useNavigate } from "react-router-dom";

const { Title, Text, Link } = Typography;

const RegisterPage = ({ handleIsAuthenticated }) => {
  const { fetchRegister } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Check password strength
  const checkPasswordStrength = password => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25;

    return strength;
  };

  const handlePasswordChange = e => {
    const password = e.target.value;

    setPasswordStrength(checkPasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "#ff4d4f";
    if (passwordStrength < 50) return "#faad14";
    if (passwordStrength < 75) return "#1890ff";
    return "#52c41a";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Yếu";
    if (passwordStrength < 50) return "Trung bình";
    if (passwordStrength < 75) return "Khá";
    return "Mạnh";
  };

  const handleRegister = async values => {
    setLoading(true);

    try {
      const registerInput = {
        username: values.username,
        password: values.password,
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
        phone: "0912325123",
        confirmPassword: values.confirmPassword,
      };
      const response = await fetchRegister(registerInput);
      if (response?.message == "OK") {
        messageApi.open({ content: "Đăng ký thành công!", type: "success" });
        handleIsAuthenticated();
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      } else {
        // Handle error response from API
        if (response.error) {
          messageApi.open({ content: response.error, type: "error" });
        } else if (response.messageApi && response.messageApi !== "OK") {
          messageApi.open({ content: response.messageApi, type: "error" });
        } else {
          if (response.status === 409) {
            messageApi.open({ content: "Tên đăng nhập đã tồn tại!", type: "error" });
          } else if (response.status === 400) {
            messageApi.open({ content: "Thông tin đăng ký không hợp lệ!", type: "error" });
          } else {
            messageApi.open({ content: "Đăng ký thất bại!", type: "error" });
          }
        }
      }
    } catch (error) {
      console.error("Register error:", error);

      // Handle network or parsing errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        message.error("Không thể kết nối đến máy chủ!");
      } else {
        message.error("Đăng ký thất bại! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {contextHolder}
      <div className="auth-background">
        <div className="auth-overlay" />
      </div>

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
                <Text className="auth-subtitle">Tạo tài khoản mới</Text>
              </div>

              <Divider />

              {/* Register Form */}
              <Form
                form={form}
                name="register"
                layout="vertical"
                onFinish={handleRegister}
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
                    { max: 50, message: "Tên đăng nhập không được quá 50 ký tự!" },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!",
                    },
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
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                    { max: 100, message: "Mật khẩu không được quá 100 ký tự!" },
                  ]}
                >
                  <div>
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập mật khẩu"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                    />
                    {passwordStrength > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <Progress
                          percent={passwordStrength}
                          strokeColor={getPasswordStrengthColor()}
                          showInfo={false}
                          size="small"
                        />
                        <Text style={{ fontSize: "12px", color: getPasswordStrengthColor() }}>
                          Độ mạnh: {getPasswordStrengthText()}
                        </Text>
                      </div>
                    )}
                  </div>
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<SafetyOutlined />}
                    placeholder="Xác nhận mật khẩu"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<UserAddOutlined />}
                    block
                    className="auth-submit-btn"
                  >
                    Đăng ký tài khoản
                  </Button>
                </Form.Item>
              </Form>

              <Divider>
                <Text type="secondary">Hoặc</Text>
              </Divider>

              {/* Login Link */}
              <div className="auth-footer">
                <Text>
                  Đã có tài khoản?{" "}
                  <Link
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="auth-switch-link"
                  >
                    <LoginOutlined /> Đăng nhập ngay
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

export default RegisterPage;