import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  notification,
  Popconfirm,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
  Typography,
  Select,
  Breadcrumb,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useProductDetail from "../hooks/productDetail.jsx";

const { Title } = Typography;
const { Option } = Select;

const ProductDetailList = ({ messageApi }) => {
  // Configure notification placement for center screen
  notification.config({
    placement: "top",
    top: "50vh",
    duration: 4,
    maxCount: 3,
  });
  const navigate = useNavigate();
  const {
    productDetails,
    getProductDetail,
    loading: loadingProductDetail,
    deleteProductDetail,
    updateProductDetail,
  } = useProductDetail();

  const loading = loadingProductDetail;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPage: 0,
  });

  const [filters, setFilters] = useState({
    code: "",
    name: "",
    description: "",
  });

  // Delete product via API
  const deleteProductApi = async productId => {
    try {
      const res = await deleteProductDetail(productId);
      console.log(res);

      if (res.status === 200) {
        messageApi.success("Xóa sản phẩm thành công!");
      } else {
        messageApi.error(`Lỗi khi xóa sản phẩm: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      messageApi.error(`Lỗi khi xóa sản phẩm: ${error.response.data.message}`);
      throw error;
    }
  };

  const loadData = () => {
    getProductDetail({ ...filters, ...pagination });
  };

  const handleAdd = () => {
    navigate("/product-details/new?action=add");
  };

  const handleEdit = product => {
    navigate(`/product-details/${product.id}?action=edit`);
  };

  const handleDelete = async productId => {
    try {
      try {
        await deleteProductApi(productId);
      } catch (error) {}
    } catch (error) {
    } finally {
    }
  };

  const handleStatusChange = async (productId, payload) => {
    try {
      const result = await updateProductDetail(productId, payload);
      if (result) {
        const statusText = payload.status === "INACTIVE" ? "ngưng bán" : "kích hoạt";
        messageApi.success(
          `🎉 Đã ${statusText} sản phẩm thành công.`,
        );
      }
    } catch (error) {
      messageApi.error(
        "❌ Cập nhật trạng thái thất bại!"
      );
    }
  };
  // Watch for filter changes
  useEffect(() => {
    if (pagination.current === 1) {
      loadData();
    } else {
      setPagination(prev => ({ ...prev, current: 1 }));
    }
  }, [filters]);

  // Table columns
  const columns = [
    {
      title: "Mã SP",
      dataIndex: "code",
      key: "code",
      width: 100,
      align: "center", // <-- Thêm dòng này để căn giữa
      render: text => <strong style={{ color: "#1890ff" }}>{text}</strong>,
    },
    {
      title: "Tên SP",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Chất liệu",
      dataIndex: "material",
      key: "material",
      width: 100,
      render: (_, record) => {
        const text = record.material.name;
        return (
          <Tooltip placement="topLeft" title={text}>
            <span style={{ color: "#666" }}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Mầu sắc",
      dataIndex: "color",
      key: "color",
      width: 100,
      render: (_, record) => {
        const text = record.color.name;
        return (
          <Tooltip placement="topLeft" title={text}>
            <span style={{ color: "#666" }}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      width: 100,
      render: (_, record) => {
        const text = record.size.name;
        return (
          <Tooltip placement="topLeft" title={text}>
            <span style={{ color: "#666" }}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          <span style={{ color: "#666" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      render: (status, record) => {
        return (
          <Select
            value={status}
            style={{ width: 120 }}
            size="small"
            onChange={value =>
              handleStatusChange(record.id, {
								name: record.name,
								description: record.description,
								quantity: record.quantity,
								price: record.price,
                status: value,
                productId: record.product.id,
                materialId: record.material.id,
                colorId: record.color.id,
                sizeId: record.size.id,
                imageIds: record.images.map(img => img.id),
              })
            }
          >
            <Option value="ACTIVE">
              <Tag color="green">Đang bán</Tag>
            </Option>
            <Option value="INACTIVE">
              <Tag color="red">Ngưng bán</Tag>
            </Option>
          </Select>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => {}} />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa sản phẩm này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="primary" danger ghost size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Initial load
  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  return (
    <div className="product-list-container">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách sản phẩm chi tiết</Breadcrumb.Item>
      </Breadcrumb>

      {/* Main Content Card */}
      <Card>
        {/* Header */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
            Danh sách sản phẩm chi tiết
          </Title>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              + Thêm sản phẩm chi tiết
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Card
          size="small"
          style={{
            marginBottom: "16px",
            backgroundColor: "#fafafa",
            border: "1px solid #f0f0f0",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Tìm theo mã sản phẩm"
                value={filters.code}
                onChange={e => setFilters(prev => ({ ...prev, code: e.target.value }))}
                allowClear
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  // onClick={handleSearch}
                  loading={loading}
                >
                  Tìm kiếm
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={productDetails}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
            pageSizeOptions: ["5", "10", "20", "50"],
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
            },
          }}
          scroll={{ x: 800 }}
          size="middle"
          bordered
        />
      </Card>
    </div>
  );
};

export default ProductDetailList;
