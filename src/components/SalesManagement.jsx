import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Select,
    Table,
    Space,
    Modal,
    Form,
    InputNumber,
    message,
    Tag,
    Avatar,
    Divider,
    Typography,
    Badge,
    List,
    Empty,
    Statistic,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    DeleteOutlined,
    ClearOutlined,
    CreditCardOutlined,
    GiftOutlined,
    MinusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const SalesManagement = ({ currentUser, messageApi }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [paymentForm] = Form.useForm();
  const [customerForm] = Form.useForm();

  // Mock data
  const mockProducts = [
    {
      id: 1,
      name: "Áo Sơ Mi Trắng Classic",
      category: "Áo Sơ Mi",
      brand: "ABC Fashion",
      price: 350000,
      stock: 50,
      image: "https://via.placeholder.com/60x60/4facfe/ffffff?text=AO",
      color: "Trắng",
      size: ["S", "M", "L", "XL"],
      material: "Cotton",
      description: "Áo sơ mi trắng cao cấp, phù hợp công sở",
    },
    {
      id: 2,
      name: "Quần Jean Nam Slim Fit",
      category: "Quần Jean",
      brand: "Denim Co",
      price: 650000,
      stock: 30,
      image: "https://via.placeholder.com/60x60/52c41a/ffffff?text=QUAN",
      color: "Xanh Navy",
      size: ["29", "30", "31", "32", "33"],
      material: "Denim Stretch",
      description: "Quần jean nam dáng slim fit thời trang",
    },
    {
      id: 3,
      name: "Váy Đầm Hoa Xuân",
      category: "Váy Đầm",
      brand: "Pretty Girl",
      price: 450000,
      stock: 25,
      image: "https://via.placeholder.com/60x60/ff7875/ffffff?text=VAY",
      color: "Hồng Phấn",
      size: ["S", "M", "L"],
      material: "Vải Hoa",
      description: "Váy đầm hoa xinh xắn cho mùa xuân",
    },
    {
      id: 4,
      name: "Túi Xách Thời Trang",
      category: "Phụ Kiện",
      brand: "Fashion Bag",
      price: 280000,
      stock: 40,
      image: "https://via.placeholder.com/60x60/faad14/ffffff?text=TUI",
      color: "Đen",
      size: ["OneSize"],
      material: "Da PU",
      description: "Túi xách thời trang cao cấp",
    },
    {
      id: 5,
      name: "Áo Khoác Bomber",
      category: "Áo Khoác",
      brand: "Street Style",
      price: 750000,
      stock: 15,
      image: "https://via.placeholder.com/60x60/722ed1/ffffff?text=KHOAC",
      color: "Đen",
      size: ["M", "L", "XL"],
      material: "Polyester",
      description: "Áo khoác bomber phong cách street style",
    },
  ];

  const mockCategories = [
    { id: 1, name: "Áo Sơ Mi" },
    { id: 2, name: "Quần Jean" },
    { id: 3, name: "Váy Đầm" },
    { id: 4, name: "Phụ Kiện" },
    { id: 5, name: "Áo Khoác" },
  ];

  const mockCustomers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      phone: "0901234567",
      email: "vanan@email.com",
      address: "Số 123, Phố Huế, Hai Bà Trưng, Hà Nội",
      totalOrders: 15,
      totalSpent: 5200000,
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      phone: "0907654321",
      email: "thibinh@email.com",
      address: "456 Lê Văn Sỹ, Quận 3, TP.HCM",
      totalOrders: 8,
      totalSpent: 2800000,
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      phone: "0903456789",
      email: "vancuong@email.com",
      address: "789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
      totalOrders: 12,
      totalSpent: 4100000,
    },
  ];

  const mockCoupons = [
    {
      id: 1,
      code: "SAVE10",
      discount: 10,
      type: "percent",
      minOrder: 500000,
      description: "Giảm 10% đơn hàng từ 500k",
      maxDiscount: 100000,
    },
    {
      id: 2,
      code: "FREESHIP",
      discount: 30000,
      type: "fixed",
      minOrder: 300000,
      description: "Miễn phí ship đơn từ 300k",
    },
    {
      id: 3,
      code: "NEWCUSTOMER",
      discount: 50000,
      type: "fixed",
      minOrder: 200000,
      description: "Giảm 50k khách hàng mới",
    },
    {
      id: 4,
      code: "VIP20",
      discount: 20,
      type: "percent",
      minOrder: 1000000,
      description: "Giảm 20% cho VIP (đơn từ 1tr)",
      maxDiscount: 300000,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setCategories(mockCategories);
      setCustomers(mockCustomers);
      setCoupons(mockCoupons);
      messageApi.success("Dữ liệu đã được tải thành công");
    } catch (error) {
      messageApi.error("Không thể tải dữ liệu");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, selectedSize) => {
    if (product.stock === 0) {
      messageApi.warning("Sản phẩm đã hết hàng");
      return;
    }

    if (!selectedSize && product.size?.length > 0 && !product.size.includes("OneSize")) {
      messageApi.warning("Vui lòng chọn size");
      return;
    }

    const existingItem = cart.find(
      item => item.id === product.id && item.selectedSize === selectedSize,
    );

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        messageApi.warning("Không đủ hàng trong kho");
        return;
      }
      setCart(prev =>
        prev.map(item =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart(prev => [
        ...prev,
        {
          ...product,
          selectedSize: selectedSize || "OneSize",
          quantity: 1,
          cartId: `${product.id}-${selectedSize || "OneSize"}-${Date.now()}`,
        },
      ]);
    }
    messageApi.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const updateCartQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    const cartItem = cart.find(item => item.cartId === cartId);
    if (cartItem && quantity > cartItem.stock) {
      messageApi.warning("Không đủ hàng trong kho");
      return;
    }

    setCart(prev => prev.map(item => (item.cartId === cartId ? { ...item, quantity } : item)));
  };

  const removeFromCart = cartId => {
    const item = cart.find(item => item.cartId === cartId);
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    messageApi.success(`Đã xóa "${item?.name}" khỏi giỏ hàng`);
  };

  const clearCart = () => {
    Modal.confirm({
      title: "Xóa tất cả sản phẩm?",
      content: "Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setCart([]);
        setAppliedCoupon(null);
        setSelectedCustomer(null);
        messageApi.success("Đã xóa tất cả sản phẩm");
      },
    });
  };

  const applyCoupon = couponCode => {
    if (!couponCode.trim()) {
      messageApi.warning("Vui lòng nhập mã giảm giá");
      return;
    }

    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (!coupon) {
      messageApi.error("Mã giảm giá không hợp lệ");
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < coupon.minOrder) {
      messageApi.error(`Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ để sử dụng mã này`);
      return;
    }

    setAppliedCoupon(coupon);
    messageApi.success(`Áp dụng mã "${coupon.code}" thành công`);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.type === "percent") {
        discount = subtotal * (appliedCoupon.discount / 100);
        if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
      } else {
        discount = appliedCoupon.discount;
      }
    }

    return {
      subtotal,
      discount: Math.min(discount, subtotal),
      total: Math.max(0, subtotal - discount),
    };
  };

  const handlePayment = async values => {
    if (cart.length === 0) {
      messageApi.error("Giỏ hàng trống");
      return;
    }

    const { total } = calculateTotal();
    if (values.receivedAmount < total) {
      messageApi.error("Số tiền nhận không đủ");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        orderId: `HD${Date.now()}`,
        customer: selectedCustomer,
        items: cart,
        coupon: appliedCoupon,
        payment: {
          ...values,
          change: values.receivedAmount - total,
        },
        ...calculateTotal(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.username || "Unknown",
      };

      console.log("Order created:", orderData);

      clearCartAfterPayment();
      setPaymentModal(false);
      paymentForm.resetFields();

      messageApi.success(
        `Thanh toán thành công! Tiền thừa: ${(values.receivedAmount - total).toLocaleString()}đ`,
      );
    } catch (error) {
      messageApi.error("Thanh toán thất bại");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCartAfterPayment = () => {
    setCart([]);
    setAppliedCoupon(null);
    setSelectedCustomer(null);
  };

  const handleAddCustomer = async values => {
    try {
      const newCustomer = {
        id: Date.now(),
        ...values,
        totalOrders: 0,
        totalSpent: 0,
      };
      setCustomers(prev => [...prev, newCustomer]);
      setSelectedCustomer(newCustomer);
      setCustomerModal(false);
      customerForm.resetFields();
      messageApi.success("Thêm khách hàng thành công");
    } catch (error) {
      messageApi.error("Thêm khách hàng thất bại");
      console.error("Add customer error:", error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const productColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      width: 300,
      render: (_, record) => (
        <Space>
          <Avatar src={record.image} size={50} shape="square" />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.brand}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.description}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 100,
      render: category => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: price => (
        <Text strong style={{ color: "#1890ff" }}>
          {price.toLocaleString()}đ
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 80,
      render: stock => (
        <Tag color={stock > 20 ? "green" : stock > 5 ? "orange" : stock > 0 ? "red" : "default"}>
          {stock}
        </Tag>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Màu/Chất liệu",
      key: "details",
      width: 120,
      render: (_, record) => (
        <div>
          <Tag size="small">{record.color}</Tag>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.material}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.size?.length > 0 && !record.size.includes("OneSize") ? (
            <Space wrap>
              {record.size.map(size => (
                <Button
                  key={size}
                  size="small"
                  type="primary"
                  ghost
                  onClick={() => addToCart(record, size)}
                  disabled={record.stock === 0}
                  style={{ minWidth: 35 }}
                >
                  {size}
                </Button>
              ))}
            </Space>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => addToCart(record)}
              disabled={record.stock === 0}
              block
            >
              Thêm vào giỏ
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const { subtotal, discount, total } = calculateTotal();

  return (
    <div style={{ padding: "0 24px 24px 24px" }}>
      <Row gutter={[24, 24]}>
        {/* Left Panel - Products */}
        <Col span={16}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                Danh sách sản phẩm
                <Badge count={filteredProducts.length} showZero color="#52c41a" />
              </Space>
            }
            size="small"
            extra={
              <Space>
                <Input
                  placeholder="Tìm sản phẩm..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                  allowClear
                />
                <Select
                  placeholder="Danh mục"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: 150 }}
                  allowClear
                >
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.name}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  loading={loading}
                  title="Tải lại dữ liệu"
                />
              </Space>
            }
            styles={{
              body: { padding: "12px" },
            }}
          >
            <Table
              columns={productColumns}
              dataSource={filteredProducts}
              rowKey="id"
              loading={loading}
              size="small"
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        {/* Right Panel - Cart */}
        <Col span={8}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                Giỏ hàng
                <Badge count={cart.length} showZero />
              </Space>
            }
            size="small"
            extra={
              <Space>
                <Tooltip title="Xóa tất cả">
                  <Button
                    type="text"
                    icon={<ClearOutlined />}
                    onClick={clearCart}
                    disabled={cart.length === 0}
                    danger
                  />
                </Tooltip>
              </Space>
            }
            style={{ height: "calc(100vh - 140px)" }}
            styles={{
              body: {
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 200px)",
              },
            }}
          >
            {/* Customer Selection */}
            <div style={{ marginBottom: 16 }}>
              <Row gutter={8}>
                <Col span={18}>
                  <Select
                    placeholder="Chọn khách hàng"
                    value={selectedCustomer?.id}
                    onChange={id => setSelectedCustomer(customers.find(c => c.id === id))}
                    style={{ width: "100%" }}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {customers.map(customer => (
                      <Option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setCustomerModal(true)}
                    block
                    title="Thêm khách hàng mới"
                  />
                </Col>
              </Row>
              {selectedCustomer && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    background: "#f0f9ff",
                    borderRadius: 6,
                    border: "1px solid #e6f7ff",
                  }}
                >
                  <Text strong>{selectedCustomer.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedCustomer.phone} • {selectedCustomer.totalOrders} đơn
                  </Text>
                </div>
              )}
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: "auto", marginBottom: 16 }}>
              {cart.length === 0 ? (
                <Empty
                  description="Giỏ hàng trống"
                  style={{ margin: "40px 0" }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  dataSource={cart}
                  renderItem={item => (
                    <List.Item style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <Row style={{ width: "100%" }} align="middle">
                        <Col span={3}>
                          <Avatar src={item.image} size={28} shape="square" />
                        </Col>
                        <Col span={9}>
                          <div style={{ fontSize: 12 }}>
                            <div style={{ fontWeight: 500, marginBottom: 2, lineHeight: 1.2 }}>
                              {item.name}
                            </div>
                            {item.selectedSize && item.selectedSize !== "OneSize" && (
                              <Tag size="small" color="blue">
                                Size: {item.selectedSize}
                              </Tag>
                            )}
                            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                              {item.price.toLocaleString()}đ/cái
                            </div>
                          </div>
                        </Col>
                        <Col span={7}>
                          <Space size={2}>
                            <Button
                              type="text"
                              size="small"
                              icon={<MinusOutlined />}
                              onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                              style={{ width: 20, height: 20, fontSize: 10 }}
                            />
                            <span
                              style={{
                                minWidth: 24,
                                textAlign: "center",
                                display: "inline-block",
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                            >
                              {item.quantity}
                            </span>
                            <Button
                              type="text"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                              style={{ width: 20, height: 20, fontSize: 10 }}
                              disabled={item.quantity >= item.stock}
                            />
                          </Space>
                        </Col>
                        <Col span={4}>
                          <Text strong style={{ fontSize: 11, color: "#1890ff" }}>
                            {(item.price * item.quantity).toLocaleString()}đ
                          </Text>
                        </Col>
                        <Col span={1}>
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeFromCart(item.cartId)}
                            style={{ width: 20, height: 20, fontSize: 10 }}
                          />
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              )}
            </div>

            {/* Coupon Section */}
            {cart.length > 0 && (
              <>
                <Divider style={{ margin: "12px 0" }} />
                <div style={{ marginBottom: 16 }}>
                  <Input.Group compact>
                    <Input
                      placeholder="Nhập mã giảm giá..."
                      style={{ width: "calc(100% - 80px)" }}
                      onPressEnter={e => {
                        applyCoupon(e.target.value);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<GiftOutlined />}
                      onClick={e => {
                        const input = e.target.parentElement.previousSibling;
                        applyCoupon(input.value);
                        input.value = "";
                      }}
                    >
                      Áp dụng
                    </Button>
                  </Input.Group>

                  {appliedCoupon && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: 8,
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        borderRadius: 4,
                      }}
                    >
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Space>
                            <GiftOutlined style={{ color: "#52c41a" }} />
                            <div>
                              <Text strong style={{ color: "#52c41a", fontSize: 12 }}>
                                {appliedCoupon.code}
                              </Text>
                              <br />
                              <Text style={{ fontSize: 11, color: "#666" }}>
                                {appliedCoupon.description}
                              </Text>
                            </div>
                          </Space>
                        </Col>
                        <Col>
                          <Button
                            type="text"
                            size="small"
                            onClick={() => setAppliedCoupon(null)}
                            style={{ color: "#52c41a" }}
                          >
                            ×
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Summary */}
            {cart.length > 0 && (
              <>
                <div
                  style={{
                    padding: "12px",
                    background: "#fafafa",
                    borderRadius: 6,
                    marginBottom: 16,
                  }}
                >
                  <Row justify="space-between" style={{ marginBottom: 4 }}>
                    <Text style={{ fontSize: 13 }}>
                      Tạm tính ({cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm):
                    </Text>
                    <Text style={{ fontSize: 13 }}>{subtotal.toLocaleString()}đ</Text>
                  </Row>
                  {discount > 0 && (
                    <Row justify="space-between" style={{ marginBottom: 4 }}>
                      <Text style={{ fontSize: 13 }}>Giảm giá:</Text>
                      <Text style={{ color: "#52c41a", fontSize: 13 }}>
                        -{discount.toLocaleString()}đ
                      </Text>
                    </Row>
                  )}
                  <Divider style={{ margin: "8px 0" }} />
                  <Row justify="space-between">
                    <Text strong style={{ fontSize: 15 }}>
                      Tổng cộng:
                    </Text>
                    <Text strong style={{ fontSize: 16, color: "#ff4d4f" }}>
                      {total.toLocaleString()}đ
                    </Text>
                  </Row>
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  onClick={() => {
                    paymentForm.setFieldsValue({ receivedAmount: total });
                    setPaymentModal(true);
                  }}
                  block
                  disabled={cart.length === 0}
                  style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                >
                  Thanh toán ({total.toLocaleString()}đ)
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Payment Modal */}
      <Modal
        title={
          <Space>
            <CreditCardOutlined />
            Thanh toán đơn hàng
          </Space>
        }
        open={paymentModal}
        onCancel={() => setPaymentModal(false)}
        footer={null}
        width={700}
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic
              title="Tạm tính"
              value={subtotal}
              suffix="đ"
              formatter={value => value.toLocaleString()}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Giảm giá"
              value={discount}
              suffix="đ"
              valueStyle={{ color: "#52c41a" }}
              formatter={value => value.toLocaleString()}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Tổng cộng"
              value={total}
              suffix="đ"
              valueStyle={{ color: "#ff4d4f", fontSize: 20, fontWeight: "bold" }}
              formatter={value => value.toLocaleString()}
            />
          </Col>
        </Row>

        {/* Order Summary */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5}>Chi tiết đơn hàng</Title>
          <List
            size="small"
            dataSource={cart}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image} size={40} shape="square" />}
                  title={`${item.name} ${
                    item.selectedSize !== "OneSize" ? `(${item.selectedSize})` : ""
                  }`}
                  description={`${item.quantity} x ${item.price.toLocaleString()}đ = ${(
                    item.quantity * item.price
                  ).toLocaleString()}đ`}
                />
              </List.Item>
            )}
          />
        </Card>

        <Form
          form={paymentForm}
          layout="vertical"
          onFinish={handlePayment}
          initialValues={{
            paymentMethod: "cash",
            receivedAmount: total,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="paymentMethod"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
              >
                <Select size="large">
                  <Option value="cash">💵 Tiền mặt</Option>
                  <Option value="card">💳 Thẻ tín dụng</Option>
                  <Option value="transfer">🏦 Chuyển khoản</Option>
                  <Option value="momo">📱 MoMo</Option>
                  <Option value="zalopay">💙 ZaloPay</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="receivedAmount"
                label="Số tiền nhận"
                rules={[
                  { required: true, message: "Vui lòng nhập số tiền nhận" },
                  {
                    validator: (_, value) => {
                      if (value < total) {
                        return Promise.reject("Số tiền nhận phải lớn hơn hoặc bằng tổng tiền");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  min={total}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={value => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="đ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.receivedAmount !== currentValues.receivedAmount
            }
          >
            {({ getFieldValue }) => {
              const receivedAmount = getFieldValue("receivedAmount") || 0;
              const change = receivedAmount - total;
              return change > 0 ? (
                <div
                  style={{
                    padding: "12px",
                    background: "#e6f7ff",
                    borderRadius: 6,
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                    Tiền thừa: {change.toLocaleString()}đ
                  </Text>
                </div>
              ) : null;
            }}
          </Form.Item>

          <Form.Item name="note" label="Ghi chú đơn hàng">
            <TextArea
              rows={3}
              placeholder="Ghi chú thêm về đơn hàng..."
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button size="large" onClick={() => setPaymentModal(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<CreditCardOutlined />}
              >
                Xác nhận thanh toán
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            Thêm khách hàng mới
          </Space>
        }
        open={customerModal}
        onCancel={() => {
          setCustomerModal(false);
          customerForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={customerForm} layout="vertical" onFinish={handleAddCustomer}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên" },
              { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập họ tên khách hàng" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" },
                ]}
              >
                <Input placeholder="0901234567" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="email@example.com" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Địa chỉ">
            <TextArea rows={3} placeholder="Nhập địa chỉ chi tiết..." showCount maxLength={200} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setCustomerModal(false);
                  customerForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Thêm khách hàng
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesManagement;