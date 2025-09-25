import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Tag,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Popconfirm,
  message,
  Descriptions,
  Steps,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useOrders from "../hooks/orders";
import { formatVietnameseCurrency } from "../utils";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;
const { Step } = Steps;

const OrderManagement = ({ messageApi }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [form] = Form.useForm();
  const { orders, pageable, loading: loadingOrders, getOrders } = useOrders();

  const loading = loadingOrders;

  // Status configurations
  const statusConfig = {
    PENDING: { color: "orange", text: "Chờ xác nhận", step: 0 },
    CONFIRMED: { color: "blue", text: "Đã xác nhận", step: 1 },
    SHIPPING: { color: "cyan", text: "Đang giao hàng", step: 2 },
    COMPLETED: { color: "green", text: "Hoàn thành", step: 3 },
    CANCELLED: { color: "red", text: "Đã hủy", step: 1 },
  };

  useEffect(() => {
    getOrders();
  }, []);
  // Filter orders based on search term and status
  const filteredOrders = orders?.filter(order => {
    const matchesSearch =
      String(order?.code)?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      String(order?.fullName)?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      String(order?.phoneNumber)?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStep = status => {
    console.log(status);

    return statusConfig[status]?.step || 0;
  };

  const handleView = record => {
    setViewingOrder(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setViewingOrder(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: text => (
        <Text strong style={{ color: "#1890ff" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (text, record) => (
        <div>
          <Text strong style={{ color: "#722ed1" }}>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      render: (text, record) => (
        <div>
          <div>
            <Text strong>{text}</Text>
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.phoneNumber}</div>
        </div>
      ),
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      width: 200,
      ellipsis: true,
      render: text => (
        <Text style={{ fontSize: 12 }} title={text}>
          {text}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: status => {
        const config = statusConfig[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      align: "right",
      render: totalAmount => (
        <Text strong style={{ color: "#52c41a" }}>
          {totalAmount?.toLocaleString()}₫
        </Text>
      ),
    },
    {
      title: "Voucher",
      dataIndex: "coupon",
      key: "coupon",
      width: 100,
      render: coupon =>
        coupon ? <Tag color="green">{coupon?.code}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: text => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            title="Xem chi tiết"
            onClick={() => handleView(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                <ShoppingCartOutlined style={{ marginRight: 8 }} />
                Quản lý Đơn hàng
              </Title>
            </Col>
            <Col></Col>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="Tìm theo mã đơn hàng, tên khách hàng, số điện thoại..."
                allowClear
                style={{ width: "100%" }}
                onChange={e => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
                placeholder="Lọc theo trạng thái"
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="PENDING">Chờ xác nhận</Option>
                <Option value="CONFIRMED">Đã xác nhận</Option>
                <Option value="CANCELLED">Đã hủy</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
              getOrders({}, { ...pageable, page: page - 1, size: pageSize });
            },
            current: pagination.current,
            total: filteredOrders.length,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} đơn hàng`,
          }}
          scroll={{ x: 1400 }}
          size="small"
          rowClassName={record => {
            if (record.status === "CANCELLED") return "cancelled-row";
            return "";
          }}
        />
      </Card>

      {/* Add/Edit Order Modal */}

      {/* View Order Details Modal */}
      <Modal
        title="Chi tiết Đơn hàng"
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {viewingOrder && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="ID">{viewingOrder.id}</Descriptions.Item>
              <Descriptions.Item label="Mã đơn hàng">
                <Text strong style={{ color: "#722ed1" }}>
                  {viewingOrder.code}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Khách hàng">{viewingOrder.fullName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {viewingOrder.phoneNumber}
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {viewingOrder.shippingAddress}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag color={statusConfig[viewingOrder?.status]?.color}>
                  {statusConfig[viewingOrder?.status]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: "#52c41a" }}>
                  {viewingOrder?.totalAmount.toLocaleString()}₫
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Mã khách hàng">
                {viewingOrder?.accountId ?? <Text type="secondary">Đang phát triển</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="Voucher">
                {viewingOrder?.coupon ? (
                  <Tag color="green">{viewingOrder?.coupon?.code}</Tag>
                ) : (
                  <Text type="secondary">Không có</Text>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {dayjs(viewingOrder?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">{viewingOrder.createdBy}</Descriptions.Item>

              <Descriptions.Item label="Cập nhật cuối">
                {dayjs(viewingOrder.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Người cập nhật">{viewingOrder.updatedBy}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Title level={5}>Tiến trình đơn hàng</Title>
              <Steps
                current={getStatusStep(viewingOrder.status)}
                status={viewingOrder.status === "CANCELLED" ? "error" : "process"}
                size="small"
              >
                <Step title="Chờ xác nhận" description="Đơn hàng đã được tạo" />
                {viewingOrder.status === "CONFIRMED" && (
                  <Step title="Đã xác nhận" description="Xác nhận và chuẩn bị hàng" />
                )}
                {viewingOrder.status === "CANCELLED" && (
                  <Step title="Đã hủy" description="Đơn hàng đã bị hủy" />
                )}
              </Steps>
            </div>
          </div>
        )}
      </Modal>
      <style jsx>{`
        .expired-row {
          background-color: #fff2f0 !important;
          opacity: 0.8;
        }
        .expired-row:hover {
          background-color: #ffebe8 !important;
        }
        .cancelled-row {
          background-color: #f5f5f5 !important;
          opacity: 0.6;
        }
        .cancelled-row:hover {
          background-color: #f0f0f0 !important;
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;
