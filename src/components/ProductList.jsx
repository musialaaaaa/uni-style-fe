import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Popconfirm,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
  Typography,
  Switch,
  Select,
  Breadcrumb,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useFetcher, useNavigate } from "react-router-dom";
import useProducts from "../hooks/product.jsx";

const { Title } = Typography;
const { Option } = Select;

const ProductList = ({ token: propToken, onNavigateToAddProduct, currentPage = "products" }) => {
  // Configure notification placement for center screen
  notification.config({
    placement: "top",
    top: "50vh",
    duration: 4,
    maxCount: 3,
  });
  const navigate = useNavigate();
  const { fetchProducts, fetchProductId, updateProduct, createProduct, deleteProduct } = useProducts();

  const Context = React.createContext({ name: "Default" });
  const [api, contextHolder] = notification.useNotification();
  const openNotification = placement => {
    api.info({
      message: `Notification ${placement}`,
      description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
      placement,
    });
  };

  // Custom notification functions for better visibility
  const showSuccessNotification = (title, description) => {
    openNotification("test");
  };

  const showErrorNotification = (title, description) => {
    notification.error({
      message: title,
      description: description,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "24px" }} />,
      style: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        zIndex: 9999,
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        border: "2px solid #ff4d4f",
      },
      duration: 6,
    });
  };
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isEditingInDetail, setIsEditingInDetail] = useState(false);
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [useMockData, setUseMockData] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  // States for dropdown options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Mock data với state management

  // Pagination và Filter states
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

  // Load data from API
  const loadApiData = async () => {
    console.log("Loading API data...");

    setApiLoading(true);
    setLoading(true);
    try {
      const result = await fetchProducts({
        page: pagination.current - 1,
        size: pagination.pageSize,
        code: filters.code,
        name: filters.name,
        description: filters.description,
      });
      // Assuming API returns { data: [...], metadata: { total, totalPage } }

      const products = result.data || [];
      const metadata = result.metadata || {};

      setProducts(products);
      setPagination(prev => ({
        ...prev,
        total: metadata.total || 0,
        totalPage: metadata.totalPage || 0,
      }));

      message.success(`Tải thành công ${products.length} sản phẩm từ server`);
    } catch (error) {
      console.error("Error loading products:", error);
      message.error(`Lỗi khi tải dữ liệu: ${error.message}`);
      // Fallback to mock data if API fails
    } finally {
      setApiLoading(false);
      setLoading(false);
    }
  };

  // Load dropdown options from API
  const loadDropdownOptions = async () => {
    setLoadingOptions(true);
    try {
      s;
    } catch (error) {
    } finally {
    }
  };
  const loadProductDetailApi = async productId => {
    try {
      setLoading(true);
      const productDetail = await fetchProductId(productId);
      setViewingProduct(productDetail);
      setDetailModalVisible(true);
      setIsEditingInDetail(false);
      // Set form values for detail form
      detailForm.setFieldsValue({
        code: productDetail.code,
        name: productDetail.name,
        description: productDetail.description,
        createdBy: productDetail.createdBy,
        createdAt: productDetail.createdAt,
        updatedBy: productDetail.updatedBy,
        updatedAt: productDetail.updatedAt,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading product detail:", error);
      message.error(`Lỗi khi tải chi tiết sản phẩm: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create/Update product detail via API
  const saveProductDetailApi = async (productDetailData, isEdit = false) => {
    try {
      // Prepare request body according to API structure
      const requestBody = {
        name: productDetailData.name,
        description: productDetailData.description,
      };

      const result = await updateProduct(productDetailData.id, requestBody);
      message.success(`Lưu chi tiết sản phẩm thành công!`);
      setDetailModalVisible(true);
      return result;
    } catch (error) {
      console.error("Error saving product detail:", error);
      message.error(`Lỗi khi lưu chi tiết sản phẩm: ${error.message}`);
      throw error;
    }
  };

  // Create/Update product via API
  const saveProductApi = async (productData, isEdit = false) => {
    try {
      // Prepare request body - only send required fields for your API
      const requestBody = {
        name: productData.name,
        description: productData.description,
        categoryId: "1",
      };
      const res = await createProduct(requestBody);
      const result = res.data;
      message.success(`Lưu sản phẩm thành công!`);
      setModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
      // Don't show message here - let the calling function handle it
      return result;
    } catch (error) {
      console.error("Error saving product:", error);
      // Re-throw error to be handled by calling function
      throw error;
    }
  };

  // Delete product via API
  const deleteProductApi = async productId => {
    try {
      await deleteProduct(productId);
      message.success("Xóa sản phẩm thành công!");

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
      throw error;
    }
  };

  // Update product status via API (soft delete)
  const updateProductStatusApi = async (productId, isDeleted) => {
    try {
      const currentProduct = products.find(p => p.id === productId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      message.success(`Đã ${statusText} sản phẩm thành công!`);
      return true;
    } catch (error) {
      console.error("Error updating product status:", error);
      message.error(`Lỗi khi cập nhật trạng thái: ${error.message}`);
      throw error;
    }
  };

  // Load mock data

  // Load data - always from API now
  const loadData = () => {
    loadApiData();
  };

  // Handlers
  const handleViewDetail = async product => {
    try {
      // Load detail from API
      setLoading(true);
     await loadProductDetailApi(product.id);
      setLoading(false);
    } catch (error) {
      console.error("Error loading product detail:", error);
    }
  };

  const handleEditInDetail = () => {
    setIsEditingInDetail(true);
    // Load dropdown options when entering edit mode
    loadDropdownOptions();
  };

  const handleCancelEditInDetail = () => {
    setIsEditingInDetail(false);
    // Reset form về giá trị ban đầu
    if (viewingProduct) {
      if (useMockData) {
        detailForm.setFieldsValue({
          code: viewingProduct.code,
          name: viewingProduct.name,
          description: viewingProduct.description,
          createdBy: viewingProduct.createdBy,
          createdAt: viewingProduct.createdAt,
          updatedBy: viewingProduct.updatedBy,
          updatedAt: viewingProduct.updatedAt,
        });
      } else {
        detailForm.setFieldsValue({
          code: viewingProduct.code,
          name: viewingProduct.name,
          description: viewingProduct.description,
          quantity: viewingProduct.quantity,
          price: viewingProduct.price,
          image: viewingProduct.image,
          isDeleted: viewingProduct.isDeleted,
          productId: viewingProduct.product?.id,
          categoryId: viewingProduct.category?.name, // Use name instead of id for category
          materialId: viewingProduct.material?.id,
          brandId: viewingProduct.brand?.id,
          colorId: viewingProduct.color?.id,
          sizeId: viewingProduct.size?.id,
        });
      }
    }
  };

  const handleSaveDetailEdit = async () => {
    try {
      const values = await detailForm.validateFields();

      setLoading(true);
      try {
        await saveProductDetailApi(
          {
            ...viewingProduct,
            ...values,
          },
          true,
        );

        // Reload detail data
        const updatedDetail = await loadProductDetailApi(viewingProduct.id);
        setViewingProduct(updatedDetail);
        setIsEditingInDetail(false);
        loadData(); // Reload main product list

        showSuccessNotification(
          "🎉 Cập nhật chi tiết thành công!",
          "Thông tin chi tiết sản phẩm đã được cập nhật thành công.",
        );
      } catch (error) {
        showErrorNotification(
          "❌ Cập nhật chi tiết thất bại!",
          error.message || "Đã xảy ra lỗi khi cập nhật chi tiết sản phẩm. Vui lòng thử lại.",
        );
      }
    } catch (error) {
      console.error("Validation failed:", error);
      showErrorNotification(
        "❌ Dữ liệu không hợp lệ!",
        "Vui lòng kiểm tra lại thông tin nhập vào và thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = product => {
    setEditingProduct(product);
    form.setFieldsValue({
      code: product.code,
      name: product.name,
      description: product.description,
    });
    setModalVisible(true);
  };

  const handleSearch = () => {
    loadData();
  };

  const handleReset = () => {
    setFilters({
      code: "",
      name: "",
      description: "",
    });
    setTimeout(() => {
      loadData();
    }, 100);
  };

  const handleSubmit = async values => {
    try {
      setLoading(true);

      if (editingProduct) {
        console.log("🔥 API: Editing existing product");
        await saveProductApi({ ...editingProduct, ...values }, true);

        // Multiple notification methods to ensure visibility
        showSuccessNotification(
          "🎉 Cập nhật thành công!",
          "Thông tin sản phẩm đã được cập nhật thành công.",
        );

        // Fallback message
        message.success({
          content: "✅ Cập nhật sản phẩm thành công!",
          duration: 4,
          style: {
            position: "fixed",
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            fontSize: "16px",
            fontWeight: "bold",
          },
        });
      } else {
        const { c } = values;

        console.log(values);
        const productInput = {
          name: values.name,
          description: values.description,
        };
        await saveProductApi(productInput);
      }

      setModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
      loadData(); // Reload data from API
    } catch (error) {
      console.log("🔥 Error:", error);

      showErrorNotification(
        `❌ ${editingProduct ? "Cập nhật" : "Thêm"} sản phẩm thất bại!`,
        error.message || "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      );

      // Fallback error message
      message.error({
        content: `❌ ${editingProduct ? "Cập nhật" : "Thêm"} sản phẩm thất bại!`,
        duration: 4,
        style: {
          position: "fixed",
          top: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10000,
          fontSize: "16px",
          fontWeight: "bold",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async productId => {
    try {
      console.log("Delete product:", productId);
      setLoading(true);

      try {
        await deleteProductApi(productId);
        showSuccessNotification(
          "🎉 Xóa sản phẩm thành công!",
          "Sản phẩm đã được xóa khỏi hệ thống.",
        );
        loadData(); // Reload data from API
      } catch (error) {
        showErrorNotification(
          "❌ Xóa sản phẩm thất bại!",
          error.message || "Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại.",
        );
      }
    } catch (error) {
      showErrorNotification("❌ Có lỗi xảy ra!", "Đã xảy ra lỗi không mong muốn khi xóa sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      console.log("Change status:", productId, newStatus);
      const isDeleted = newStatus === "inactive";
      setLoading(true);

      try {
        await updateProductStatusApi(productId, isDeleted);
        const statusText = newStatus === "inactive" ? "ngưng bán" : "kích hoạt";
        showSuccessNotification(
          "🎉 Cập nhật trạng thái thành công!",
          `Đã ${statusText} sản phẩm thành công.`,
        );
        loadData(); // Reload data from API
      } catch (error) {
        showErrorNotification(
          "❌ Cập nhật trạng thái thất bại!",
          error.message || "Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm.",
        );
      }
    } catch (error) {
      showErrorNotification(
        "❌ Có lỗi xảy ra!",
        "Đã xảy ra lỗi không mong muốn khi cập nhật trạng thái.",
      );
    } finally {
      setLoading(false);
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
      width: 300,
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          <span style={{ color: "#666" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Xem chi tiết",
      key: "detail",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Button
          type="default"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "status",
      width: 150,
      align: "center",
      render: (isDeleted, record) => (
        <Select
          value={!isDeleted ? "active" : "inactive"}
          style={{ width: 120 }}
          size="small"
          onChange={value => handleStatusChange(record.id, value)}
        >
          <Option value="active">
            <Tag color="green">Đang bán</Tag>
          </Option>
          <Option value="inactive">
            <Tag color="red">Ngưng bán</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
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

  return (
    <div className="product-list-container">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách sản phẩm</Breadcrumb.Item>
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
            Danh sách sản phẩm
          </Title>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              + Thêm sản phẩm
            </Button>

            <Button
              type="primary"
              style={{ background: "#52c41a", borderColor: "#52c41a" }}
              icon={<PlusOutlined />}
              onClick={() => {
                navigate("/add-product");
              }}
            >
              + Thêm chi tiết
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
              <Input
                placeholder="Tìm theo tên sản phẩm"
                value={filters.name}
                onChange={e => setFilters(prev => ({ ...prev, name: e.target.value }))}
                allowClear
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Tìm theo mô tả"
                value={filters.description}
                onChange={e => setFilters(prev => ({ ...prev, description: e.target.value }))}
                allowClear
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                >
                  Tìm kiếm
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={loading}>
                  Đặt lại
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading || apiLoading}
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
              if (!useMockData) {
                // API sẽ tự động được gọi bởi useEffect khi pagination thay đổi
              }
            },
          }}
          scroll={{ x: 800 }}
          size="middle"
          bordered
        />
      </Card>

      {/* Modal Add/Edit Simple */}
      {
        <Modal
          title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingProduct(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
            {editingProduct ? (
              <Form.Item label="Mã sản phẩm" name="code">
                <Input
                  disabled
                  style={{
                    backgroundColor: "#f5f5f5",
                    color: "#1890ff",
                    fontWeight: "bold",
                  }}
                />
              </Form.Item>
            ) : (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #91d5ff",
                  borderRadius: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#1890ff" }}>
                    📝 <strong>Mã sản phẩm sẽ được tự động tạo</strong>
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  Theo định dạng: CL + số thứ tự (ví dụ: CL14, CL15, ...)
                </div>
              </div>
            )}

            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                { min: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả sản phẩm"
                showCount
                maxLength={500}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingProduct(null);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      }
      {/* Modal Product Detail với chức năng chỉnh sửa */}
      <Modal
        title="Thông Tin Chi Tiết Sản Phẩm"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setViewingProduct(null);
          setIsEditingInDetail(false);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          !isEditingInDetail ? (
            <Button key="edit" type="primary" icon={<EditOutlined />} onClick={handleEditInDetail}>
              Sửa
            </Button>
          ) : (
            <Space key="edit-actions">
              <Button icon={<CloseOutlined />} onClick={handleCancelEditInDetail}>
                Hủy
              </Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveDetailEdit}>
                Lưu
              </Button>
            </Space>
          ),
        ]}
        width={1000}
        destroyOnClose
      >
        {viewingProduct && (
          <Form form={detailForm} layout="vertical" disabled={!isEditingInDetail}>
            <Row gutter={24}>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={
                      viewingProduct?.image || "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={viewingProduct?.name}
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      borderRadius: "8px",
                      border: "1px solid #f0f0f0",
                    }}
                  />
                  {isEditingInDetail && (
                    <Form.Item label="URL Hình ảnh" name="image" style={{ marginTop: "16px" }}>
                      <Input placeholder="Nhập URL hình ảnh" />
                    </Form.Item>
                  )}
                </div>
              </Col>
              <Col span={16}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <span style={{ color: "#1890ff", fontWeight: "bold" }}>Mã sản phẩm</span>
                      }
                      name="code"
                    >
                      <Input
                        disabled={true}
                        style={{
                          color: "#1890ff",
                          fontWeight: "bold",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <span style={{ color: "#1890ff", fontWeight: "bold" }}>Tên sản phẩm</span>
                      }
                      name="name"
                      rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                    >
                      <Input
                        disabled={!isEditingInDetail}
                        style={{
                          color: isEditingInDetail ? "#000" : "#1890ff",
                          fontWeight: isEditingInDetail ? "normal" : "bold",
                        }}
                      />
                    </Form.Item>
                  </Col>

                  {/* {!useMockData && (
                    <>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span style={{ color: "#1890ff", fontWeight: "bold" }}>Giá (VNĐ)</span>
                          }
                          name="price"
                          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                        >
                          <InputNumber
                            style={{
                              width: "100%",
                              color: isEditingInDetail ? "#000" : "#ff4d4f",
                              fontWeight: isEditingInDetail ? "normal" : "bold",
                            }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={value => value.replace(/\$\s?|(,*)/g, "")}
                            min={0}
                            disabled={!isEditingInDetail}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span style={{ color: "#1890ff", fontWeight: "bold" }}>Số lượng</span>
                          }
                          name="quantity"
                          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                        >
                          <InputNumber
                            style={{
                              width: "100%",
                              color: isEditingInDetail ? "#000" : "#1890ff",
                              fontWeight: isEditingInDetail ? "normal" : "bold",
                            }}
                            min={0}
                            disabled={!isEditingInDetail}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        {isEditingInDetail ? (
                          <Form.Item
                            label={
                              <span style={{ color: "#1890ff", fontWeight: "bold" }}>Danh mục</span>
                            }
                            name="categoryId"
                            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                          >
                            <Select
                              placeholder="Chọn danh mục"
                              style={{ width: "100%" }}
                              loading={loadingOptions}
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {categories.map(category => (
                                <Option key={category.name} value={category.name}>
                                  {category.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : (
                          <div style={{ marginBottom: "16px" }}>
                            <strong style={{ color: "#1890ff" }}>Danh mục:</strong>
                            <div style={{ marginTop: "4px", color: "#1890ff", fontWeight: "bold" }}>
                              {viewingProduct.category?.name || "Chưa có"}
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col span={12}>
                        {isEditingInDetail ? (
                          <Form.Item
                            label={
                              <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                                Thương hiệu
                              </span>
                            }
                            name="brandId"
                            rules={[{ required: true, message: "Vui lòng chọn thương hiệu!" }]}
                          >
                            <Select
                              placeholder="Chọn thương hiệu"
                              style={{ width: "100%" }}
                              loading={loadingOptions}
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {brands.map(brand => (
                                <Option key={brand.id} value={brand.id}>
                                  {brand.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : (
                          <div style={{ marginBottom: "16px" }}>
                            <strong style={{ color: "#1890ff" }}>Thương hiệu:</strong>
                            <div style={{ marginTop: "4px", color: "#1890ff", fontWeight: "bold" }}>
                              {viewingProduct.brand?.name || "Chưa có"}
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col span={12}>
                        {isEditingInDetail ? (
                          <Form.Item
                            label={
                              <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                                Chất liệu
                              </span>
                            }
                            name="materialId"
                            rules={[{ required: true, message: "Vui lòng chọn chất liệu!" }]}
                          >
                            <Select
                              placeholder="Chọn chất liệu"
                              style={{ width: "100%" }}
                              loading={loadingOptions}
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {materials.map(material => (
                                <Option key={material.id} value={material.id}>
                                  {material.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : (
                          <div style={{ marginBottom: "16px" }}>
                            <strong style={{ color: "#1890ff" }}>Chất liệu:</strong>
                            <div style={{ marginTop: "4px", color: "#1890ff", fontWeight: "bold" }}>
                              {viewingProduct.material?.name || "Chưa có"}
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col span={12}>
                        {isEditingInDetail ? (
                          <Form.Item
                            label={
                              <span style={{ color: "#1890ff", fontWeight: "bold" }}>Màu sắc</span>
                            }
                            name="colorId"
                            rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}
                          >
                            <Select
                              placeholder="Chọn màu sắc"
                              style={{ width: "100%" }}
                              loading={loadingOptions}
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {colors.map(color => (
                                <Option key={color.id} value={color.id}>
                                  {color.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : (
                          <div style={{ marginBottom: "16px" }}>
                            <strong style={{ color: "#1890ff" }}>Màu sắc:</strong>
                            <div style={{ marginTop: "4px", color: "#1890ff", fontWeight: "bold" }}>
                              {viewingProduct.color?.name || "Chưa có"}
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col span={12}>
                        {isEditingInDetail ? (
                          <Form.Item
                            label={
                              <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                                Kích thước
                              </span>
                            }
                            name="sizeId"
                            rules={[{ required: true, message: "Vui lòng chọn kích thước!" }]}
                          >
                            <Select
                              placeholder="Chọn kích thước"
                              style={{ width: "100%" }}
                              loading={loadingOptions}
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {sizes.map(size => (
                                <Option key={size.id} value={size.id}>
                                  {size.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : (
                          <div style={{ marginBottom: "16px" }}>
                            <strong style={{ color: "#1890ff" }}>Kích thước:</strong>
                            <div style={{ marginTop: "4px", color: "#1890ff", fontWeight: "bold" }}>
                              {viewingProduct.size?.name || "Chưa có"}
                            </div>
                          </div>
                        )}
                      </Col>
                    </>
                  )} */}

                  {useMockData && (
                    <>
                      <Col span={12}>
                        <div style={{ marginBottom: "16px" }}>
                          <strong style={{ color: "#1890ff" }}>Người tạo:</strong>
                          <div style={{ marginTop: "4px", color: "#666" }}>
                            {viewingProduct.createdBy}
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: "16px" }}>
                          <strong style={{ color: "#1890ff" }}>Ngày tạo:</strong>
                          <div style={{ marginTop: "4px", color: "#666" }}>
                            {new Date(viewingProduct.createdAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: "16px" }}>
                          <strong style={{ color: "#1890ff" }}>Người cập nhật:</strong>
                          <div style={{ marginTop: "4px", color: "#666" }}>
                            {viewingProduct.updatedBy}
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: "16px" }}>
                          <strong style={{ color: "#1890ff" }}>Ngày cập nhật:</strong>
                          <div style={{ marginTop: "4px", color: "#666" }}>
                            {new Date(viewingProduct.updatedAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </Col>
                    </>
                  )}

                  <Col span={24}>
                    <Form.Item
                      label={<span style={{ color: "#1890ff", fontWeight: "bold" }}>Mô tả</span>}
                      name="description"
                      rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                      <Input.TextArea
                        rows={4}
                        disabled={!isEditingInDetail}
                        showCount={isEditingInDetail}
                        maxLength={500}
                        style={{
                          color: isEditingInDetail ? "#000" : "#1890ff",
                          fontWeight: isEditingInDetail ? "normal" : "bold",
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    {isEditingInDetail ? (
                      <Form.Item
                        label={
                          <span style={{ color: "#1890ff", fontWeight: "bold" }}>Trạng thái</span>
                        }
                        name="isDeleted"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                      >
                        <Select style={{ width: 200 }}>
                          <Option value={false}>
                            <Tag color="green">Đang bán</Tag>
                          </Option>
                          <Option value={true}>
                            <Tag color="red">Ngưng bán</Tag>
                          </Option>
                        </Select>
                      </Form.Item>
                    ) : (
                      <div style={{ marginBottom: "16px" }}>
                        <strong style={{ color: "#1890ff" }}>Trạng thái:</strong>
                        <div style={{ marginTop: "8px" }}>
                          <Tag
                            color={!viewingProduct.isDeleted ? "green" : "red"}
                            style={{ fontSize: "14px" }}
                          >
                            {!viewingProduct.isDeleted ? "Đang bán" : "Ngưng bán"}
                          </Tag>
                        </div>
                      </div>
                    )}
                  </Col>

                  {!useMockData && (
                    <Col span={24}>
                      <div
                        style={{
                          marginTop: "16px",
                          padding: "12px",
                          background: "#f5f5f5",
                          borderRadius: "6px",
                          border: "1px solid #e8e8e8",
                        }}
                      >
                        <Row gutter={[16, 8]}>
                          <Col span={12}>
                            <strong style={{ color: "#1890ff" }}>Người tạo:</strong>
                            <span style={{ marginLeft: "8px", color: "#666" }}>
                              {viewingProduct.createdBy}
                            </span>
                          </Col>
                          <Col span={12}>
                            <strong style={{ color: "#1890ff" }}>Ngày tạo:</strong>
                            <span style={{ marginLeft: "8px", color: "#666" }}>
                              {new Date(viewingProduct.createdAt).toLocaleString("vi-VN")}
                            </span>
                          </Col>
                          <Col span={12}>
                            <strong style={{ color: "#1890ff" }}>Người cập nhật:</strong>
                            <span style={{ marginLeft: "8px", color: "#666" }}>
                              {viewingProduct.updatedBy}
                            </span>
                          </Col>
                          <Col span={12}>
                            <strong style={{ color: "#1890ff" }}>Ngày cập nhật:</strong>
                            <span style={{ marginLeft: "8px", color: "#666" }}>
                              {new Date(viewingProduct.updatedAt).toLocaleString("vi-VN")}
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
