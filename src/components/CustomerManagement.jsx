import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Avatar,
  Tooltip,
  Row,
  Col,
  Select,
  Statistic,
  Divider,
  Typography,
  Popconfirm,
  Badge,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  ShoppingOutlined,
  ReloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import moment from "moment";
import useAccount from "../hooks/account";

const { Title, Text } = Typography;

const CustomerManagement = ({ messageApi }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const {
    accounts,
    getAccount,
    updateAccount,
    createAccount,
    deleteAccount,
    loading: loadingAccounts,
  } = useAccount();

  const loading = loadingAccounts;
  useEffect(() => {
    getAccount();
  }, []);

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    form.setFieldsValue({
      status: "active",
      gender: "male",
    });
    setModalVisible(true);
  };

  const handleEdit = record => {
    setEditingCustomer(record);
    form.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  const handleView = record => {
    setSelectedCustomer(record);
    setDetailModalVisible(true);
  };

  const handleDelete = async id => {
    try {
      const res = await deleteAccount(id);
      if (res && res.status === 200) {
        messageApi.success("Xóa khách hàng thành công");
      } else {
        messageApi.error("Đã xảy ra lỗi khi xóa khách hàng");
      }
    } catch (error) {
      messageApi.error("Không thể xóa khách hàng");
    }
  };

  const handleSubmit = async values => {
    try {
      console.log(values, editingCustomer);
      if (editingCustomer) {
        updateAccount(editingCustomer.id, values);
        messageApi.success("Cập nhật khách hàng thành công");
      } else {
        const res = await createAccount(values);
        if (res) {
          messageApi.success("Thêm khách hàng thành công");
        }
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      messageApi.error("Có lỗi xảy ra");
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch =
      account.fullName?.toLowerCase()?.includes(searchText.toLowerCase()) ||
      account.email?.toLowerCase()?.includes(searchText.toLowerCase()) ||
      account.username?.toLowerCase()?.includes(searchText.toLowerCase());

    return matchesSearch;
  });

  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              backgroundColor: record.gender === "female" ? "#f56a00" : "#1890ff",
            }}
          >
            {record.fullName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullName}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              @{record.username}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <PhoneOutlined style={{ marginRight: 4, color: "#52c41a" }} />
            <Text copyable={{ text: record.phone }}>{record.phone}</Text>
          </div>
          <div>
            <MailOutlined style={{ marginRight: 4, color: "#1890ff" }} />
            <Text copyable={{ text: record.email }} ellipsis style={{ maxWidth: 150 }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "member_since",
      key: "member_since",
      width: 100,
      render: date => moment(date).format("DD/MM/YYYY"),
      sorter: (a, b) => moment(a.member_since) - moment(b.member_since),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa khách hàng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 24px 24px 24px" }}>
      {/* Main Content */}
      <Card
        title={
          <Space>
            <UserOutlined />
            Quản lý khách hàng
            <Badge count={filteredAccounts.length} showZero color="#1890ff" />
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm khách hàng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm khách hàng
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          loading={loading}
          size="small"
          pagination={{
            total: filteredAccounts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      {modalVisible && (
        <Modal
          title={editingCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Tên đăng nhập"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập" },
                    { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
                  ]}
                >
                  <Input disabled={editingCustomer} placeholder="Nhập tên đăng nhập" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên" },
                    { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>
            {!editingCustomer && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                      { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
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
                    <Input.Password placeholder="Xác nhận mật khẩu mới" />
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingCustomer ? "Cập nhật" : "Thêm mới"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Detail Modal */}
      {detailModalVisible && (
        <Modal
          title={
            <Space>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: selectedCustomer?.gender === "female" ? "#f56a00" : "#1890ff",
                }}
              />
              Chi tiết khách hàng
            </Space>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
            <Button
              key="edit"
              type="primary"
              onClick={() => {
                setDetailModalVisible(false);
                handleEdit(selectedCustomer);
              }}
            >
              Chỉnh sửa
            </Button>,
          ]}
          width={600}
        >
          {selectedCustomer && (
            <div>
              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Tên đăng nhập:</Text>
                    <br />
                    <Text>{selectedCustomer.username}</Text>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Họ và tên:</Text>
                    <br />
                    <Text>{selectedCustomer.fullName}</Text>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Email:</Text>
                    <br />
                    <Text copyable>{selectedCustomer.email}</Text>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Số điện thoại:</Text>
                    <br />
                    <Text copyable>{selectedCustomer.phone}</Text>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CustomerManagement;
