import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  InputNumber,
  Upload,
  Space,
  Typography,
  Breadcrumb,
  message,
  Spin,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import AdminLayout from "../components/AdminLayout.jsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useColor from "../hooks/color.jsx";
import useProducts from "../hooks/product.jsx";
import useSize from "../hooks/size.jsx";
import useMaterial from "../hooks/material.jsx";
import useUploadImages from "../hooks/upload.jsx";
import useProductDetail from "../hooks/productDetail.jsx";

const { Title } = Typography;
const { Option } = Select;

const AddProductPage = ({ messageApi }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  const { productId } = useParams();

  const { getColor, colors, loading: loadingColors } = useColor();
  const {
    fetchProducts,
    products,
    productForShop,
    fetchProductForShop,
    loading: loadingProducts,
  } = useProducts();

  const { getSize, sizes, loading: loadingSizes } = useSize();
  const { getMaterial, materials, loading: loadingMaterials } = useMaterial();
  const { uploadImages, getUrlImage, loading: loadingUpload } = useUploadImages();
  const {
    productDetail,
    fetchProductDetailById,
    createProductDetail,
    updateProductDetail,
    loading: loadingProductDetail,
  } = useProductDetail();
  const colorOptions = colors.map(color => ({ value: color.id, label: color.name }));
  const productOptions = products?.map(product => ({ value: product.id, label: product.name }));
  const sizeOptions = sizes?.map(size => ({ value: size.id, label: size.name }));
  const materialOptions = materials?.map(material => ({
    value: material.id,
    label: material.name,
  }));

  const [form] = Form.useForm();

  const loading =
    loadingColors ||
    loadingProducts ||
    loadingSizes ||
    loadingMaterials ||
    loadingUpload ||
    loadingProductDetail;

  const onNavigateBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  const handleSubmit = async values => {
    try {
      // Simulate API call
      //   await new Promise(resolve => setTimeout(resolve, 1500));
      const prevImageUrls = productDetail?.images?.filter(file => file.id) || [];
      const resImg =
        values.images?.filter(file => !file.id).length > 0 &&
        (await uploadImages(
          values.images?.filter(file => !file.id).map(file => file.originFileObj) || [],
        ));

      const imageUrls = prevImageUrls.concat(resImg).map(img => img.id); // Lấy URL từ phản hồi
      const payloadProdductDetail = {
        name: values.productName,
        quantity: values.quantity,
        price: values.price,
        productId: values.productId,
        sizeId: values.size,
        materialId: values.material,
        colorId: values.color,
        dimensions: values.dimensions,
        description: values.description,
        imageIds: imageUrls,
        status: productDetail?.status ? productDetail?.status : "ACTIVE",
      };
      console.log(imageUrls, payloadProdductDetail);

      if (action === "edit" && productDetail) {
        const res = await updateProductDetail(productId, payloadProdductDetail);
        messageApi.success("Cập nhật sản phẩm thành công!");
        form.resetFields();
        navigate("/product-details");
        return;
      }

      const res = await createProductDetail(payloadProdductDetail);
      console.log(res, payloadProdductDetail);

      messageApi.success("Thêm sản phẩm thành công!");
      form.resetFields();

      navigate("/product-details");
    } catch (error) {
      messageApi.error("Có lỗi xảy ra khi thêm sản phẩm!");
    }
  };
  useEffect(() => {
    if (action !== "new" && productId !== "create") {
      console.log("Fetch product detail by id:", productId);

      fetchProductDetailById(productId);
    }
    getColor();
    fetchProducts();
    getSize();
    getMaterial();
  }, []);

  const color = Form.useWatch("color", form);

  const handleGetImages = async fileList => {
    const imageUrls = await Promise.all(fileList.map(file => getUrlImage(file.fileName)));
    const images = imageUrls.map((url, index) => ({
      uid: index,
      name: `image-${index}`,
      status: "done",
      url: url,
      id: fileList[index].id,
    }));
    form.setFieldsValue({ images: images });
  };

  useEffect(() => {
    if (action !== "new" && productDetail) {
      handleGetImages(productDetail.images);
      form.setFieldsValue({
        productId: productDetail?.product.id,
        quantity: productDetail?.quantity,
        price: productDetail?.price,
        productName: productDetail?.name,
        size: productDetail?.size.id,
        material: productDetail?.material.id,
        color: productDetail?.color.id,
        description: productDetail?.description,
      });
    } else if (productForShop) {
      form.setFieldsValue({
        material: productForShop?.productDetails[0]?.material.id,
      });
    }
  }, [productDetail, productForShop]);

  return (
    <>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>
          {action === "edit" ? "Chỉnh sửa" : action === "view" ? "Xem" : "Thêm"} sản phẩm chi tiết
        </Breadcrumb.Item>
      </Breadcrumb>
      <Spin spinning={loading} tip="Đang tải...">
        {/* Container với max-width để thu nhỏ */}
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Card>
            {/* Header với tiêu đề ở giữa */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "16px",
              }}
            >
              <Title level={2} style={{ margin: 0, color: "#1890ff", textAlign: "center" }}>
                {action === "edit" ? "Chỉnh sửa" : action === "view" ? "Xem" : "Thêm"} sản phẩm chi
                tiết
              </Title>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "16px",
                }}
              >
                <Button icon={<ArrowLeftOutlined />} onClick={onNavigateBack} type="text">
                  Quay lại
                </Button>
              </div>
            </div>

            {/* Form */}
            <Form
              id="add-product-form"
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                color: null,
                size: null,
                material: null,
              }}
              autoComplete="off"
            >
              {/* Basic Information */}
              <Card title="Thông tin cơ bản" style={{ marginBottom: "16px" }}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Tên sản phẩm chi tiết"
                      name="productName"
                      rules={[
                        { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                        { min: 5, message: "Tên sản phẩm phải có ít nhất 5 ký tự!" },
                      ]}
                    >
                      <Input
                        disabled={action === "view"}
                        size="medium"
                        placeholder="Nhập tên sản phẩm"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Số lượng"
                      name="quantity"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng!" },
                        { type: "number", min: 0, message: "Số lượng phải >= 0!" },
                      ]}
                    >
                      <InputNumber
                        disabled={action === "view"}
                        size="large"
                        placeholder="Nhập số lượng"
                        style={{ width: "100%" }}
                        min={0}
                        max={99999}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Giá"
                      name="price"
                      rules={[
                        { required: true, message: "Vui lòng nhập giá!" },
                        { type: "number", min: 1000, message: "Giá phải >= 1,000 VND!" },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        disabled={action === "view"}
                        placeholder="Nhập giá"
                        style={{ width: "100%" }}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={value => value.replace(/\$\s?|(,*)/g, "")}
                        addonAfter="VND"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Product Relations */}
              <Card title="Liên kết sản phẩm" style={{ marginBottom: "20px" }}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Sản phẩm (chính)"
                      name="productId"
                      rules={[{ required: true, message: "Vui lòng chọn sản phẩm chính!" }]}
                    >
                      <Select
                        disabled={action === "view"}
                        placeholder="-- Chọn sản phẩm --"
                        showSearch
                        onChange={value => {
                          form.setFieldsValue({ material: null, color: null, size: null });
                          value && fetchProductForShop(value);
                        }}
                        size="large"
                        options={productOptions}
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Màu sắc"
                      name="color"
                      rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}
                    >
                      <Select
                        disabled={action === "view" || Form.useWatch("productId", form) == null}
                        options={colorOptions}
                        onChange={() => {
                          form.setFieldsValue({ size: null });
                        }}
                        size="large"
                        placeholder="-- Chọn màu sắc --"
                      ></Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Product Details */}
              <Card title="Chi tiết sản phẩm" style={{ marginBottom: "20px" }}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Kích thước"
                      name="size"
                      rules={[{ required: true, message: "Vui lòng chọn kích thước!" }]}
                    >
                      <Select
                        disabled={
                          action === "view" ||
                          Form.useWatch("productId", form) == null ||
                          color == null
                        }
                        size="large"
                        placeholder="-- Chọn kích thước --"
                        options={
                          color == null
                            ? []
                            : productForShop && color
                            ? sizeOptions?.filter(
                                size =>
                                  ![...(productForShop?.productDetails ?? [])]
                                    ?.filter(pd => pd.color.id === color)
                                    ?.map(pd => pd.size.id)
                                    ?.includes(size.value),
                              )
                            : sizeOptions
                        }
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Chất liệu"
                      name="material"
                      rules={[{ required: true, message: "Vui lòng chọn chất liệu!" }]}
                    >
                      <Select
                        disabled={
                          action === "view" ||
                          action === "edit" ||
                          Form.useWatch("productId", form) == null ||
                          (productForShop?.productDetails != null &&
                            productForShop?.productDetails.length > 0)
                        }
                        size="large"
                        placeholder="-- Chọn chất liệu --"
                        options={materialOptions}
                      ></Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Hình ảnh"
                      name="images"
                      valuePropName="fileList"
                      getValueFromEvent={e => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      }}
                    >
                      <Upload
                        disabled={action === "view"}
                        listType="picture-card"
                        maxCount={5}
                        multiple
                        beforeUpload={() => false}
                        accept="image/*"
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh</div>
                        </div>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
                    { min: 20, message: "Mô tả phải có ít nhất 20 ký tự!" },
                  ]}
                >
                  <Input.TextArea
                    disabled={action === "view"}
                    size="medium"
                    rows={4}
                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>
              </Card>

              {/* Action Buttons */}
              <Card style={{ textAlign: "center", padding: "8px" }}>
                <Space size="middle">
                  <Button
                    onClick={() => onNavigateBack && onNavigateBack()}
                    icon={<ArrowLeftOutlined />}
                  >
                    Quay lại
                  </Button>
                  {action !== "view" && (
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{
                        background: "#ff8c42",
                        borderColor: "#ff8c42",
                        minWidth: "100px",
                      }}
                    >
                      Lưu
                    </Button>
                  )}
                </Space>
              </Card>
            </Form>
          </Card>
        </div>
      </Spin>
    </>
  );
};

export default AddProductPage;
