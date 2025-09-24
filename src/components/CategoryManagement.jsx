import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Tag,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Popconfirm,
  message,
  Avatar,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FolderOutlined,
  ReloadOutlined,
  CalendarOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useCategory from "../hooks/category.jsx";

const { Title, Text } = Typography;
const { Search } = Input;

const CategoryManagement = ({ messageApi }) => {
  const [categories, setCategories] = useState([]);
  const {
    getCategory,
    createCategory,
    updateCategory,
    fetchCategoryById,
    deleteCategory,
    loading,
  } = useCategory();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletedCategories, setShowDeletedCategories] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Filter categories based on search term and deleted status
  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      category?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      category?.createdBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeletedFilter = showDeletedCategories ? category.is_deleted : !category.is_deleted;
    return matchesSearch && matchesDeletedFilter;
  });

  const handleEdit = record => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
    });
    setIsModalVisible(true);
  };

  const handleView = record => {
    setViewingCategory(record);
    console.log(record);

    setIsViewModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setViewingCategory(null);
  };

  const getCreatorAvatar = createdBy => {
    const colors = {
      admin: "#f56a00",
      manager: "#7265e6",
      staff_01: "#00a2ae",
      staff_02: "#00a854",
    };

    return (
      <Avatar
        size="small"
        style={{
          backgroundColor: colors[createdBy] || "#1890ff",
          fontSize: "12px",
        }}
      >
        {createdBy?.charAt(0).toUpperCase()}
      </Avatar>
    );
  };

  const handleGetCategory = async () => {
    try {
      const res = await getCategory();
      setCategories(res);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async values => {
    try {
      if (editingCategory) {
        // Update existing category
        const newCategory = {
          name: values.name,
        };

        const res = await updateCategory(editingCategory.id, newCategory);
        if (res) {
          handleGetCategory();
        }
        messageApi.success("Cập nhật danh mục thành công!");
      } else {
        // Create new category
        const newCategory = {
          name: values.name,
        };

        const res = await createCategory(newCategory);

        if (res) {
          handleGetCategory();
        }
        setCategories(prev => [...prev, newCategory]);
        messageApi.success("Thêm danh mục thành công!");
      }

      handleCloseModal();
    } catch (error) {
      messageApi.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDelete = async record => {
    const res = await deleteCategory(record.id);
    if (res.status === 200) {
      messageApi.success(`Xóa danh mục thành công!`);
      handleGetCategory();
    } else {
      messageApi.error(res.data.message || "Có lỗi xảy ra!");
    }
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FolderOutlined
            style={{
              marginRight: 8,
              color: record.is_deleted ? "#d9d9d9" : "#1890ff",
              fontSize: 16,
            }}
          />
          <Text
            strong
            style={{
              color: record.is_deleted ? "#d9d9d9" : "#333",
              textDecoration: record.is_deleted ? "line-through" : "none",
            }}
          >
            {text}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      width: 120,
      align: "center",
      filters: [
        { text: "Hoạt động", value: false },
        { text: "Đã xóa", value: true },
      ],
      onFilter: (value, record) => record.is_deleted === value,
      render: isDeleted => (
        <Tag color={isDeleted ? "red" : "green"} style={{ fontWeight: 500 }}>
          {isDeleted ? "Đã xóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 130,
      render: createdBy => (
        <Space>
          {getCreatorAvatar(createdBy)}
          <Text style={{ fontSize: 13 }}>{createdBy}</Text>
        </Space>
      ),
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Manager", value: "manager" },
        { text: "Staff 01", value: "staff_01" },
        { text: "Staff 02", value: "staff_02" },
      ],
      onFilter: (value, record) => record.created_by === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: text => (
        <div>
          <div>{dayjs(text).format("DD/MM/YYYY")}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {dayjs(text).format("HH:mm:ss")}
          </Text>
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 140,
      render: (text, record) => (
        <div>
          <div>{dayjs(text).format("DD/MM/YYYY")}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {dayjs(text).format("HH:mm:ss")}
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
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
              onClick={() => handleEdit(record)}
              disabled={record.is_deleted}
            />
          </Tooltip>

          <Popconfirm
            title={`Bạn có chắc chắn muốn ${record.is_deleted ? "khôi phục" : "xóa"} danh mục này?`}
            onConfirm={() => handleToggleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title={record.is_deleted ? "Khôi phục" : "Xóa"}>
              <Button
                type="text"
                icon={record.is_deleted ? <ReloadOutlined /> : <DeleteOutlined />}
                size="small"
                danger={!record.is_deleted}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    handleGetCategory();
  }, [getCategory]);

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                <TagsOutlined style={{ marginRight: 8 }} />
                Quản lý Danh mục
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 2px 6px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  Thêm danh mục
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="Tìm theo tên danh mục hoặc người tạo..."
                allowClear
                style={{ width: "100%" }}
                onChange={e => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col>
              <Text type="secondary">
                Hiển thị {showDeletedCategories ? "đã xóa" : "hoạt động"}:{" "}
                {filteredCategories.length} danh mục
              </Text>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredCategories.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} danh mục`,
          }}
          scroll={{ x: 900 }}
          size="small"
          rowClassName={record => (record.is_deleted ? "deleted-row" : "")}
        />
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal
        title={`${editingCategory ? "Chỉnh sửa" : "Thêm"} Danh mục`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
        style={{
          borderRadius: 12,
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Tên danh mục không được quá 50 ký tự!" },
            ]}
          >
            <Input
              prefix={<FolderOutlined />}
              placeholder="Nhập tên danh mục"
              style={{
                borderRadius: 8,
              }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCloseModal} style={{ borderRadius: 6 }}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ borderRadius: 6 }}
              >
                {editingCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Category Details Modal */}
      <Modal
        title="Chi tiết Danh mục"
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal} style={{ borderRadius: 6 }}>
            Đóng
          </Button>,
        ]}
        width={600}
        style={{ borderRadius: 12 }}
      >
        {viewingCategory && (
          <div style={{ padding: "16px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  size="small"
                  style={{
                    background: viewingCategory.is_deleted ? "#fff2f0" : "#f6ffed",
                    border: `1px solid ${viewingCategory.is_deleted ? "#ffccc7" : "#b7eb8f"}`,
                    borderRadius: 8,
                  }}
                >
                  <Row align="middle" gutter={16}>
                    <Col>
                      <FolderOutlined
                        style={{
                          fontSize: 24,
                          color: viewingCategory.is_deleted ? "#ff4d4f" : "#52c41a",
                        }}
                      />
                    </Col>
                    <Col flex="auto">
                      <Title level={4} style={{ margin: 0 }}>
                        {viewingCategory.name}
                      </Title>
                      <Tag color={viewingCategory.is_deleted ? "red" : "green"}>
                        {viewingCategory.is_deleted ? "Đã xóa" : "Hoạt động"}
                      </Tag>
                    </Col>
                    <Col>
                      <Text strong style={{ color: "#1890ff" }}>
                        ID: {viewingCategory.id}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={12}>
                <Card size="small" title="Thông tin tạo" style={{ borderRadius: 8 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {getCreatorAvatar(viewingCategory.createdBy)}
                      <div>
                        <Text strong>{viewingCategory.createdBy}</Text>
                        <div style={{ fontSize: 12, color: "#666" }}>Người tạo</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <div>
                        <Text>
                          {dayjs(viewingCategory.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                        </Text>
                        <div style={{ fontSize: 12, color: "#666" }}>Ngày tạo</div>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card size="small" title="Cập nhật cuối" style={{ borderRadius: 8 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {getCreatorAvatar(viewingCategory.updatedBy)}
                      <div>
                        <Text strong>{viewingCategory.updatedBy}</Text>
                        <div style={{ fontSize: 12, color: "#666" }}>Người cập nhật</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CalendarOutlined style={{ color: "#fa8c16" }} />
                      <div>
                        <Text>
                          {dayjs(viewingCategory.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                        </Text>
                        <div style={{ fontSize: 12, color: "#666" }}>Ngày cập nhật</div>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              {viewingCategory.createdAt !== viewingCategory.updatedAt && (
                <Col span={24}>
                  <Card
                    size="small"
                    style={{
                      background: "#fff7e6",
                      border: "1px solid #ffd591",
                      borderRadius: 8,
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      💡 Danh mục này đã được cập nhật sau khi tạo
                    </Text>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CategoryManagement;
