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
  Progress,
  Tooltip,
  Typography,
  Card,
  Row,
  Col,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useCoupons from "../hooks/coupons";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const VoucherManagement = ({ messageApi }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const { loading, error, getCoupons, createCoupons, updateCoupons, deleteCoupons, coupons } =
    useCoupons();

  useEffect(() => {
    if (coupons) {
      setVouchers(coupons);
    }
  }, [coupons]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletedVouchers, setShowDeletedVouchers] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  // Filter vouchers based on search term and deleted status
  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch =
      voucher.code?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      voucher.createdBy?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesDeletedFilter = showDeletedVouchers ? voucher.isDeleted : !voucher.isDeleted;
    return matchesSearch && matchesDeletedFilter;
  });

  const getExpiryStatus = expirationDate => {
    const today = dayjs();
    const expiry = dayjs(expirationDate);

    if (expiry.isBefore(today)) {
      return { status: "error", text: "Hết hạn" };
    } else {
      const diffDays = expiry.diff(today, "day");

      if (diffDays <= 7) {
        return { status: "warning", text: `${diffDays} ngày` };
      } else {
        return { status: "success", text: `${diffDays} ngày` };
      }
    }
  };

  const handleEdit = record => {
    setEditingVoucher(record);
    form.setFieldsValue({
      code: record.code,
      discountType: record.discountType,
      value: record.value,
      expirationDate: dayjs(record.expirationDate),
      usageLimit: record.usageLimit,
      createdBy: record.createdBy,
    });
    setIsModalVisible(true);
  };

  const handleView = record => {
    setSelectedVoucher(record);
    setIsModalDetailVisible(true);
  };

  const handleToggleDelete = async record => {
    const action = record.isDeleted ? "khôi phục" : "xóa";

    await deleteCoupons(record.id); // Call the deleteCoupons function from the hook

    messageApi.success(`${action === "xóa" ? "Xóa" : "Khôi phục"} voucher thành công!`);
  };

  const handleSubmit = async values => {
    try {
      const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      if (editingVoucher) {
        const updateVoucher = {
          code: values.code.toUpperCase(),
          discountType: values.discountType,
          value: values.value,
          expirationDate: values.expirationDate.format("YYYY-MM-DD"),
          usageLimit: values.usageLimit,
          used: 0,
          isDeleted: false,
          createdBy: values.createdBy,
          createdAt: currentTime,
          lastEditedBy: values.createdBy,
          lastEditedAt: currentTime,
        };
        await updateCoupons(editingVoucher.id, updateVoucher); // Call the updateCoupons function from the hook

        messageApi.success("Cập nhật voucher thành công!");
      } else {
        // Create new voucher
        const newVoucher = {
          code: values.code.toUpperCase(),
          discountType: values.discountType,
          value: values.value,
          expirationDate: values.expirationDate.format("YYYY-MM-DD"),
          usageLimit: values.usageLimit,
          used: 0,
          isDeleted: false,
          createdBy: values.createdBy,
          createdAt: currentTime,
          lastEditedBy: values.createdBy,
          lastEditedAt: currentTime,
        };

        const res = await createCoupons(newVoucher); // Call the createCoupons function from the hook
        messageApi.success("Thêm voucher thành công!");
      }
      handleCloseModal();
    } catch (error) {
      messageApi.error("Có lỗi xảy ra!");
    } finally {
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingVoucher(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: text => <strong style={{ color: "#1890ff" }}>{text}</strong>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: text => (
        <Tag color="purple" style={{ fontFamily: "monospace", fontSize: "12px" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Loại giảm",
      dataIndex: "discountType",
      key: "discountType",
      width: 100,

      render: text => (text === "VALUE" ? "Cố định" : "Phần trăm"),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      width: 120,
      render: (value, record) => {
        console.log(record);

        return (
          <span style={{ color: "#52c41a", fontWeight: 600 }}>
            {record.discountType === "PERCENT" ? `${value}%` : `${value?.toLocaleString()}đ`}
          </span>
        );
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      width: 140,
      render: date => {
        const status = getExpiryStatus(date);
        return (
          <div>
            <div>{date}</div>
            <Tag color={status.status} size="small">
              {status.text}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Giới hạn lượt",
      dataIndex: "usageLimit",
      key: "usageLimit",
      width: 110,
      align: "center",
      render: text => text?.toLocaleString(),
    },
    {
      title: "Đã dùng",
      dataIndex: "used",
      key: "used",
      width: 120,
      align: "center",
      render: (used, record) => {
        const percentage = Math.min((used / record.usageLimit) * 100, 100);
        return (
          <div>
            <div>{used?.toLocaleString()}</div>
            <Progress
              percent={percentage}
              size="small"
              showInfo={false}
              strokeColor={percentage > 80 ? "#ff4d4f" : percentage > 50 ? "#fa8c16" : "#52c41a"}
            />
          </div>
        );
      },
    },
    {
      title: "Đã xóa",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 100,
      align: "center",
      render: isDeleted => (
        <Tag color={isDeleted ? "red" : "green"}>{isDeleted ? "Đã xóa" : "Hoạt động"}</Tag>
      ),
    },
    {
      title: "Tạo bởi",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 100,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: text => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Sửa cuối",
      dataIndex: "lastEditedBy",
      key: "lastEditedBy",
      width: 100,
    },
    {
      title: "Ngày sửa",
      dataIndex: "lastEditedAt",
      key: "lastEditedAt",
      width: 140,
      render: text => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
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
              disabled={record.isDeleted}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title={`Bạn có chắc chắn muốn ${record.isDeleted ? "khôi phục" : "xóa"} voucher này?`}
            onConfirm={() => handleToggleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title={record.isDeleted ? "Khôi phục" : "Xóa"}>
              <Button
                type="text"
                icon={record.isDeleted ? <ReloadOutlined /> : <DeleteOutlined />}
                size="small"
                danger={!record.isDeleted}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getCoupons();
  }, [getCoupons]);

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                Quản lý Voucher
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                >
                  Thêm voucher
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <span style={{ marginRight: 8 }}>
                Hiển thị voucher {showDeletedVouchers ? "đã xóa" : "hoạt động"}
              </span>
            </Col>
            <Col>
              <Search
                placeholder="Tìm theo mã hoặc người tạo..."
                allowClear
                style={{ width: 300 }}
                onChange={e => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredVouchers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredVouchers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} mục`,
          }}
          scroll={{ x: 1400 }}
          size="small"
          rowClassName={record => (record.isDeleted ? "deleted-row" : "")}
        />
      </Card>

      <Modal
        title={`${editingVoucher ? "Chỉnh sửa" : "Thêm"} Voucher`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            discountType: "VALUE",
            createdBy: "Admin",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã Voucher"
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập mã voucher!" },
                  { max: 20, message: "Mã voucher không được quá 20 ký tự!" },
                ]}
              >
                <Input placeholder="VD: SALE20" style={{ textTransform: "uppercase" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại giảm giá" name="discountType">
                <Select>
                  <Option value="VALUE">Cố định (VNĐ)</Option>
                  <Option value="PERCENT">Phần trăm (%)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giá trị giảm"
                name="value"
                rules={[{ required: true, message: "Vui lòng nhập giá trị giảm!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="VD: 50000"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={value => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày hết hạn"
                name="expirationDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={current => current && current < dayjs().startOf("day")}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giới hạn số lượt sử dụng"
                name="usageLimit"
                rules={[{ required: true, message: "Vui lòng nhập giới hạn sử dụng!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={1} placeholder="100" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Người tạo" name="createdBy">
                <Select>
                  <Option value="Admin">Admin</Option>
                  <Option value="Manager">Manager</Option>
                  <Option value="Staff01">Staff01</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCloseModal}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingVoucher ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {isModalDetailVisible && (
        <Modal
          title="Chi tiết Voucher"
          open={isModalDetailVisible}
          onCancel={() => setIsModalDetailVisible(false)}
        >
          {selectedVoucher && (
            <div style={{ marginTop: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <strong>ID:</strong>
                </Col>
                <Col span={16}>{selectedVoucher.id}</Col>

                <Col span={8}>
                  <strong>Code:</strong>
                </Col>
                <Col span={16}>
                  <Tag color="purple">{selectedVoucher.code}</Tag>
                </Col>

                <Col span={8}>
                  <strong>Loại:</strong>
                </Col>
                <Col span={16}>
                  {selectedVoucher.discountType === "VALUE" ? "Cố định" : "Phần trăm"}
                </Col>

                <Col span={8}>
                  <strong>Giá trị:</strong>
                </Col>
                <Col span={16}>
                  {selectedVoucher.discountType === "VALUE"
                    ? `${selectedVoucher.value?.toLocaleString()}đ`
                    : `${selectedVoucher.value}%`}
                </Col>

                <Col span={8}>
                  <strong>Hết hạn:</strong>
                </Col>
                <Col span={16}>{selectedVoucher.expirationDate}</Col>

                <Col span={8}>
                  <strong>Giới hạn:</strong>
                </Col>
                <Col span={16}>{selectedVoucher.usageLimit?.toLocaleString()} lượt</Col>

                <Col span={8}>
                  <strong>Đã dùng:</strong>
                </Col>
                <Col span={16}>{selectedVoucher.used?.toLocaleString()} lượt</Col>

                <Col span={8}>
                  <strong>Trạng thái:</strong>
                </Col>
                <Col span={16}>
                  <Tag color={selectedVoucher.isDeleted ? "red" : "green"}>
                    {selectedVoucher.isDeleted ? "Đã xóa" : "Hoạt động"}
                  </Tag>
                </Col>

                <Col span={8}>
                  <strong>Tạo bởi:</strong>
                </Col>
                <Col span={16}>{selectedVoucher.createdBy}</Col>

                <Col span={8}>
                  <strong>Ngày tạo:</strong>
                </Col>
                <Col span={16}>
                  {dayjs(selectedVoucher.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </Col>

                <Col span={8}>
                  <strong>Sửa cuối:</strong>
                </Col>
                <Col span={16}>{selectedVoucher.lastEditedBy}</Col>

                <Col span={8}>
                  <strong>Ngày sửa:</strong>
                </Col>
                <Col span={16}>
                  {dayjs(selectedVoucher.lastEditedAt).format("DD/MM/YYYY HH:mm:ss")}
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default VoucherManagement;
