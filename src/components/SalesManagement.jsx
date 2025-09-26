import React, { useState, useEffect } from "react";
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
  Tooltip,
} from "antd";
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
} from "@ant-design/icons";
import useProductDetail from "../hooks/productDetail";
import useCoupons from "../hooks/coupons";
import useOrders from "../hooks/orders";
import AvatarFile from "./AvatarFile";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const SalesManagement = ({ messageApi }) => {
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [paymentForm] = Form.useForm();
  const {
    productDetailAssociations,
    getProductDetailAssociations,
    loading: loadingProductDetail,
  } = useProductDetail();

  const { getApplyDiscountCode, loading: loadingCoupons } = useCoupons();
  const { createOrderAtStore, loading: loadingOrders } = useOrders();
  const [formVoucher] = Form.useForm();

  const loading = loadingProductDetail || loadingCoupons || loadingOrders;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    getProductDetailAssociations();
  };

  const addToCart = (product, selectedSize) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        messageApi.warning("Không đủ hàng trong kho");
        return;
      }
      setCart(prev =>
        prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
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
    setCart([]);
    setAppliedCoupon(null);
    setSelectedProduct({});
    messageApi.success("Đã xóa tất cả sản phẩm");
  };

  const handleCheckDuplicateProductColor = (array, key) => {
    const uniqueValues = new Map();
    const duplicates = new Map();

    array.forEach(item => {
      const value = item[key]?.id;
      if (uniqueValues.has(value)) {
        duplicates.set(value, item[key]);
      } else {
        uniqueValues.set(value, item[key]);
      }
    });

    return [...uniqueValues.values()];
  };

  const handleAvailabilitySize = (array, colorId) => {
    const availableSizes = array.filter(item => item.color.id === colorId);
    const result =
      availableSizes.length > 0 ? availableSizes?.map(availableSize => availableSize.size) : null;
    return result;
  };

  const handleGetPrice = (array, validate, verifyProduct) => {
    if (
      !validate ||
      !validate?.productId ||
      !validate?.sizeId ||
      !validate.colorId ||
      !verifyProduct
    ) {
      return 0;
    }

    const availableSizes = array.find(
      item => item.color.id === validate.colorId && item.size.id === validate.sizeId,
    );
    return availableSizes?.price || 0;
  };

  const applyCoupon = async values => {
    const { couponCode } = values;
    try {
      if (couponCode.trim()) {
        const res = await getApplyDiscountCode(couponCode);
        if (res?.code === couponCode) {
                    if (res.usageLimit >= res.used) {
                      messageApi.warning(`Mã "${res.code}" đã hết lượt sử dụng`);
                      return;
                    }
          setAppliedCoupon(res);
          formVoucher.resetFields();
          messageApi.success(`Áp dụng mã "${res.code}" thành công`);

        } else {
          messageApi.error("Mã giảm giá không hợp lệ");
        }
      }
    } catch (error) {
      messageApi.error("Mã giảm giá không hợp lệ");
      console.error("Apply coupon error:", error);
      return;
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === "PERCENT") {
        discount = subtotal * (appliedCoupon.value / 100);
      } else {
        discount = appliedCoupon.value;
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

    try {
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        orderId: `HD${Date.now()}`,
        customer: selectedCustomer,
        cart: cart?.map(item => ({
          productDetailId: item.id,
          quantity: item.quantity,
        })),
        couponId: appliedCoupon?.id,
        paymentMethod: values.paymentMethod,
        returnUrl: window.location.href,
        cancelUrl: window.location.href,
        note: values.note || "",
      };

      const res = await createOrderAtStore(orderData);

      if (res) {
        if (res.checkoutUrl && values.paymentMethod === "BANK_TRANSFER") {
          window.open(res.checkoutUrl, "_blank");
        }

        clearCartAfterPayment();
        setPaymentModal(false);
        paymentForm.resetFields();

        messageApi.success(`Thanh toán thành công`);
      } else {
        messageApi.error("Thanh toán thất bại");
      }
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Thanh toán thất bại");
    }
  };

  const clearCartAfterPayment = () => {
    setCart([]);
    setAppliedCoupon(null);
    setSelectedCustomer(null);
  };

  const filteredProducts = productDetailAssociations.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const productColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      width: 300,
      render: (_, record) => (
        <Space>
          <AvatarFile fileName={record?.productDetails?.[0]?.images?.[0]?.fileName} />
          <div>
            <Tooltip title={record?.name} placement="topLeft">
              <div style={{ fontWeight: 500, marginBottom: 2 }}>
                {record?.name?.substring(0, 10)}
                {record?.name?.length > 10 ? "..." : ""}
              </div>
            </Tooltip>
            <Tooltip title={record?.description} placement="topLeft">
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record?.description?.substring(0, 20)}
                {record?.description?.length > 20 ? "..." : ""}
              </Text>
            </Tooltip>
          </div>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 100,
      render: (_, record) => <Tag color="blue">{record?.category?.name}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 200,
      render: (_, record) => (
        <Text strong style={{ color: "#1890ff" }}>
          {handleGetPrice(
            record?.productDetails,
            selectedProduct,
            record?.id === selectedProduct?.productId,
          ).toLocaleString() + "₫"}
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Màu/Chất liệu",
      key: "details",
      width: 120,
      render: (_, record) => (
        <Space wrap>
          {handleCheckDuplicateProductColor(record?.productDetails, "color").map(color => (
            <Button
              key={color.id}
              size="small"
              type="primary"
              ghost={
                !(selectedProduct.productId === record.id && selectedProduct.colorId === color.id)
              }
              onClick={() => {
                const payload = {
                  productId: record.id,
                  colorId: color.id,
                };
                setSelectedProduct(payload);
              }}
              disabled={record?.stock === 0}
              style={{ minWidth: 35 }}
            >
              {color?.name}
            </Button>
          ))}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) =>
        selectedProduct && selectedProduct.productId === record.id ? (
          <Space direction="vertical" size="small">
            <Space wrap>
              {handleAvailabilitySize(record?.productDetails, selectedProduct.colorId).map(size => (
                <Button
                  key={size.id}
                  size="small"
                  type="primary"
                  ghost={
                    !(selectedProduct.productId === record.id && selectedProduct.sizeId === size.id)
                  }
                  onClick={() => {
                    const productDetailSelected = record?.productDetails?.find(
                      detail =>
                        detail.size.id === size.id &&
                        detail.product.id === selectedProduct.productId &&
                        detail.color.id === selectedProduct.colorId,
                    );
                    console.log(productDetailSelected);

                    addToCart(productDetailSelected ?? [], productDetailSelected?.size?.name);
                    setSelectedProduct(prev => ({ ...prev, sizeId: size.id }));
                  }}
                  disabled={record?.stock === 0}
                  style={{ minWidth: 35 }}
                >
                  {size?.name}
                </Button>
              ))}
            </Space>
          </Space>
        ) : (
          <Space></Space>
        ),
    },
  ];
  console.log(cart);

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
              pagination={false}
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
                          <AvatarFile fileName={item?.images?.[0]?.fileName} size={28} />
                        </Col>
                        <Col span={9}>
                          <div style={{ fontSize: 12 }}>
                            <div style={{ fontWeight: 500, marginBottom: 2, lineHeight: 1.2 }}>
                              {item.name}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 4,
                                flexWrap: "wrap",
                                flexDirection: "row",
                              }}
                            >
                              {item.size && (
                                <Tag size="small" color="blue">
                                  Size: {item.size.name}
                                </Tag>
                              )}
                              {item.color && (
                                <Tag size="small" color="blue">
                                  Color: {item.color.name}
                                </Tag>
                              )}
                            </div>

                            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                              {item?.price?.toLocaleString()}đ/cái
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
                            {(item?.price * item?.quantity)?.toLocaleString()}đ
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
                <Row gutter={8} align="middle">
                  {!appliedCoupon && (
                    <Form
                      form={formVoucher}
                      onFinish={applyCoupon}
                      style={{ width: "100%", display: "flex" }}
                    >
                      <Col span={12}>
                        <Form.Item name="couponCode">
                          <Input className="coupon-input-field" placeholder="Nhập mã giảm giá..." />
                        </Form.Item>
                      </Col>

                      <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={!!appliedCoupon}
                          loading={loadingCoupons}
                        >
                          Áp dụng
                        </Button>
                      </Col>
                    </Form>
                  )}
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
                </Row>
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
                    <Text style={{ fontSize: 13 }}>{subtotal?.toLocaleString()}đ</Text>
                  </Row>
                  {discount > 0 && (
                    <Row justify="space-between" style={{ marginBottom: 4 }}>
                      <Text style={{ fontSize: 13 }}>Giảm giá:</Text>
                      <Text style={{ color: "#52c41a", fontSize: 13 }}>
                        -{discount?.toLocaleString()}đ
                      </Text>
                    </Row>
                  )}
                  <Divider style={{ margin: "8px 0" }} />
                  <Row justify="space-between">
                    <Text strong style={{ fontSize: 15 }}>
                      Tổng cộng:
                    </Text>
                    <Text strong style={{ fontSize: 16, color: "#ff4d4f" }}>
                      {total?.toLocaleString()}đ
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
                  Thanh toán ({total?.toLocaleString()}đ)
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
        style={{ top: 20 }}
        width={700}
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic
              title="Tạm tính"
              value={subtotal}
              suffix="đ"
              formatter={value => value?.toLocaleString()}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Giảm giá"
              value={discount}
              suffix="đ"
              valueStyle={{ color: "#52c41a" }}
              formatter={value => value?.toLocaleString()}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Tổng cộng"
              value={total}
              suffix="đ"
              valueStyle={{ color: "#ff4d4f", fontSize: 20, fontWeight: "bold" }}
              formatter={value => value?.toLocaleString()}
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
                  avatar={<AvatarFile fileName={item?.images?.[0]?.fileName} size={40} />}
                  title={`${item.name} ${`(${item.size.name}/${item.color.name})`}`}
                  description={`${item.quantity} x ${item?.price?.toLocaleString()}đ = ${(
                    item.quantity * item.price
                  )?.toLocaleString()}đ`}
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
            paymentMethod: "CASH",
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
                  <Option value="CASH">💵 Tiền mặt</Option>
                  <Option value="BANK_TRANSFER">🏦 Chuyển khoản</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="receivedAmount" label="Số tiền nhận">
                <InputNumber
                  disabled
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
                    Tiền thừa: {change?.toLocaleString()}đ
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
    </div>
  );
};

export default SalesManagement;
