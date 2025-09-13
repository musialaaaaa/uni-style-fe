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
import useMaterial from "../hooks/material.jsx";

const { Title, Text } = Typography;
const { Search } = Input;

const MaterialManagement = ({ messageApi }) => {
  const [materials, setMaterials] = useState([]);
  const {
    getMaterial,
    createMaterial,
    updateMaterial,
    fetchMaterialById,
    deleteMaterial,
    loading,
  } = useMaterial();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletedMaterials, setShowDeletedMaterials] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [viewingMaterial, setViewingMaterial] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Filter materials based on search term and deleted status
  const filteredMaterials = materials.filter(material => {
    const matchesSearch =
      material?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      material?.createdBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeletedFilter = showDeletedMaterials ? material.is_deleted : !material.is_deleted;
    return matchesSearch && matchesDeletedFilter;
  });

  const handleEdit = record => {
    setEditingMaterial(record);
    form.setFieldsValue({
      name: record.name,
    });
    setIsModalVisible(true);
  };

  const handleView = record => {
    setViewingMaterial(record);
    console.log(record);

    setIsViewModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingMaterial(null);
    form.resetFields();
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setViewingMaterial(null);
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

  const handleGetMaterial = async () => {
    try {
      const res = await getMaterial();
      setMaterials(res);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleSubmit = async values => {
    try {
      if (editingMaterial) {
        // Update existing material
        const newMaterial = {
          name: values.name,
        };

        const res = await updateMaterial(editingMaterial.id, newMaterial);
        if (res) {
          handleGetMaterial();
        }
        messageApi.success("Cập nhật chất liệu thành công!");
      } else {
        // Create new material
        const newMaterial = {
          name: values.name,
        };

        const res = await createMaterial(newMaterial);

        if (res) {
          handleGetMaterial();
        }
        setMaterials(prev => [...prev, newMaterial]);
        messageApi.success("Thêm chất liệu thành công!");
      }

      handleCloseModal();
    } catch (error) {
      messageApi.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDelete = async record => {
    const res = await deleteMaterial(record.id);
    if (res.status === 200) {
      messageApi.success(`Xóa chất liệu thành công!`);
      handleGetMaterial();
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
      title: "Tên chất liệu",
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
              {dayjs(text).format("HH:mm")}
            </Text>
            <Text type="secondary" style={{ fontSize: 10 }}>
              by {record.updated_by}
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
            title={`Bạn có chắc chắn muốn ${
              record.is_deleted ? "khôi phục" : "xóa"
            } chất liệu này?`}
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
    handleGetMaterial();
  }, [getMaterial]);

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                <TagsOutlined style={{ marginRight: 8 }} />
                Quản lý Chất liệu
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
                  Thêm chất liệu
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="Tìm theo tên chất liệu hoặc người tạo..."
                allowClear
                style={{ width: "100%" }}
                onChange={e => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col>
              <Text type="secondary">
                Hiển thị {showDeletedMaterials ? "đã xóa" : "hoạt động"}: {filteredMaterials.length}{" "}
                chất liệu
              </Text>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredMaterials}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredMaterials.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} chất liệu`,
          }}
          scroll={{ x: 900 }}
          size="small"
          rowClassName={record => (record.is_deleted ? "deleted-row" : "")}
        />
      </Card>

      {/* Add/Edit Material Modal */}
      <Modal
        title={`${editingMaterial ? "Chỉnh sửa" : "Thêm"} Chất liệu`}
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
            label="Tên chất liệu"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên chất liệu!" },
              { min: 2, message: "Tên chất liệu phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Tên chất liệu không được quá 50 ký tự!" },
            ]}
          >
            <Input
              prefix={<FolderOutlined />}
              placeholder="Nhập tên chất liệu"
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
                {editingMaterial ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Material Details Modal */}
      <Modal
        title="Chi tiết Chất liệu"
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
        {viewingMaterial && (
          <div style={{ padding: "16px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  size="small"
                  style={{
                    background: viewingMaterial.is_deleted ? "#fff2f0" : "#f6ffed",
                    border: `1px solid ${viewingMaterial.is_deleted ? "#ffccc7" : "#b7eb8f"}`,
                    borderRadius: 8,
                  }}
                >
                  <Row align="middle" gutter={16}>
                    <Col>
                      <FolderOutlined
                        style={{
                          fontSize: 24,
                          color: viewingMaterial.is_deleted ? "#ff4d4f" : "#52c41a",
                        }}
                      />
                    </Col>
                    <Col flex="auto">
                      <Title level={4} style={{ margin: 0 }}>
                        {viewingMaterial.name}
                      </Title>
                      <Tag color={viewingMaterial.is_deleted ? "red" : "green"}>
                        {viewingMaterial.is_deleted ? "Đã xóa" : "Hoạt động"}
                      </Tag>
                    </Col>
                    <Col>
                      <Text strong style={{ color: "#1890ff" }}>
                        ID: {viewingMaterial.id}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={12}>
                <Card size="small" title="Thông tin tạo" style={{ borderRadius: 8 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {getCreatorAvatar(viewingMaterial.createdBy)}
                      <div>
                        <Text strong>{viewingMaterial.createdBy}</Text>
                        <div style={{ fontSize: 12, color: "#666" }}>Người tạo</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <div>
                        <Text>
                          {dayjs(viewingMaterial.createdAt).format("DD/MM/YYYY HH:mm:ss")}
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
                      {getCreatorAvatar(viewingMaterial.updatedBy)}
                      <div>
                        <Text strong>{viewingMaterial.updatedBy}</Text>
                        <div style={{ fontSize: 12, color: "#666" }}>Người cập nhật</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CalendarOutlined style={{ color: "#fa8c16" }} />
                      <div>
                        <Text>
                          {dayjs(viewingMaterial.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                        </Text>
                        <div style={{ fontSize: 12, color: "#666" }}>Ngày cập nhật</div>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              {viewingMaterial.createdAt !== viewingMaterial.updatedAt && (
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
                      💡 Chất liệu này đã được cập nhật sau khi tạo
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

export default MaterialManagement;
