import React, { useState } from 'react';
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
    message,
    Typography,
    Breadcrumb
} from 'antd';
import {
    UploadOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import AdminLayout from '../components/AdminLayout.jsx';

const { Title } = Typography;
const { Option } = Select;

const AddProductPage = ({ onLogout, currentUser, onNavigateBack, onMenuClick }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Mock data cho dropdowns
    const mockCategories = [
        { id: 1, name: 'Áo thun nam' },
        { id: 2, name: 'Quần jean nữ' },
        { id: 3, name: 'Áo khoác' },
        { id: 4, name: 'Váy' },
        { id: 5, name: 'Giày' },
        { id: 6, name: 'Túi xách' },
    ];

    const mockBrands = [
        { id: 1, name: 'UniStyle' },
        { id: 2, name: 'Fashion Brand' },
        { id: 3, name: 'Trendy Wear' },
    ];

    const mockParentProducts = [
        { id: 1, name: 'Áo thun Basic Collection' },
        { id: 2, name: 'Quần jean Denim Series' },
        { id: 3, name: 'Áo khoác Street Style' },
    ];

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Product data:', values);
            message.success('Thêm sản phẩm thành công!');
            form.resetFields();

            // Navigate back after success
            setTimeout(() => {
                if (onNavigateBack) {
                    onNavigateBack();
                }
            }, 1000);
        } catch (error) {
            message.error('Có lỗi xảy ra khi thêm sản phẩm!');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        form.resetFields();
        message.info('Đã reset form');
    };

    return (
        <AdminLayout
            onLogout={onLogout}
            currentUser={currentUser}
            currentPage="add-product"
            onMenuClick={onMenuClick}
        >
            {/* Breadcrumb - Đã sửa */}
            <Breadcrumb style={{ marginBottom: '16px' }}>
                <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item>Quản lý sản phẩm</Breadcrumb.Item>
                <Breadcrumb.Item>Thêm sản phẩm chi tiết</Breadcrumb.Item>
            </Breadcrumb>

            {/* Container với max-width để thu nhỏ */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Card>
                    {/* Header với tiêu đề ở giữa */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '24px',
                        borderBottom: '1px solid #f0f0f0',
                        paddingBottom: '16px'
                    }}>
                        <Title level={2} style={{ margin: 0, color: '#1890ff', textAlign: 'center' }}>
                            Thêm Sản Phẩm Chi Tiết
                        </Title>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginTop: '16px'
                        }}>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={onNavigateBack}
                                type="text"
                            >
                                Quay lại
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                form="add-product-form"
                                loading={loading}
                                style={{ background: '#ff8c42', borderColor: '#ff8c42' }}
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>

                    {/* Form */}
                    <Form
                        id="add-product-form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                        size="small"
                    >
                        {/* Basic Information */}
                        <Card
                            title="Thông tin cơ bản"
                            size="small"
                            style={{ marginBottom: '20px' }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Mã sản phẩm chi tiết"
                                        name="productCode"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mã sản phẩm!' },
                                            { min: 3, message: 'Mã sản phẩm phải có ít nhất 3 ký tự!' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập mã sản phẩm" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Tên sản phẩm chi tiết"
                                        name="productName"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                                            { min: 5, message: 'Tên sản phẩm phải có ít nhất 5 ký tự!' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập tên sản phẩm" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Số lượng"
                                        name="quantity"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số lượng!' },
                                            { type: 'number', min: 0, message: 'Số lượng phải >= 0!' }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập số lượng"
                                            style={{ width: '100%' }}
                                            min={0}
                                            max={99999}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Giá"
                                        name="price"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập giá!' },
                                            { type: 'number', min: 1000, message: 'Giá phải >= 1,000 VND!' }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            style={{ width: '100%' }}
                                            min={0}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            addonAfter="VND"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Product Relations */}
                        <Card
                            title="Liên kết sản phẩm"
                            size="small"
                            style={{ marginBottom: '20px' }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Sản phẩm (chính)"
                                        name="parentProduct"
                                        rules={[{ required: true, message: 'Vui lòng chọn sản phẩm chính!' }]}
                                    >
                                        <Select
                                            placeholder="-- Chọn sản phẩm --"
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {mockParentProducts.map(product => (
                                                <Option key={product.id} value={product.id}>
                                                    {product.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Danh mục"
                                        name="category"
                                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                    >
                                        <Select
                                            placeholder="-- Chọn danh mục --"
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {mockCategories.map(category => (
                                                <Option key={category.id} value={category.id}>
                                                    {category.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Thương hiệu"
                                        name="brand"
                                        rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
                                    >
                                        <Select
                                            placeholder="-- Chọn thương hiệu --"
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {mockBrands.map(brand => (
                                                <Option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Kích thước"
                                        name="size"
                                        rules={[{ required: true, message: 'Vui lòng chọn kích thước!' }]}
                                    >
                                        <Select placeholder="-- Chọn kích thước --" mode="multiple">
                                            <Option value="xs">XS</Option>
                                            <Option value="s">S</Option>
                                            <Option value="m">M</Option>
                                            <Option value="l">L</Option>
                                            <Option value="xl">XL</Option>
                                            <Option value="xxl">XXL</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Product Details */}
                        <Card
                            title="Chi tiết sản phẩm"
                            size="small"
                            style={{ marginBottom: '20px' }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Chất liệu"
                                        name="material"
                                        rules={[{ required: true, message: 'Vui lòng chọn chất liệu!' }]}
                                    >
                                        <Select placeholder="-- Chọn chất liệu --">
                                            <Option value="cotton">Cotton</Option>
                                            <Option value="polyester">Polyester</Option>
                                            <Option value="denim">Denim</Option>
                                            <Option value="voan">Voan</Option>
                                            <Option value="canvas">Canvas</Option>
                                            <Option value="da">Da</Option>
                                            <Option value="ni">Nỉ</Option>
                                            <Option value="kaki">Kaki</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Màu sắc"
                                        name="color"
                                        rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
                                    >
                                        <Select placeholder="-- Chọn màu sắc --" mode="multiple">
                                            <Option value="trang">Trắng</Option>
                                            <Option value="den">Đen</Option>
                                            <Option value="xam">Xám</Option>
                                            <Option value="xanh">Xanh</Option>
                                            <Option value="do">Đỏ</Option>
                                            <Option value="vang">Vàng</Option>
                                            <Option value="hong">Hồng</Option>
                                            <Option value="navy">Navy</Option>
                                            <Option value="be">Be</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Kích thước (Dimensions)"
                                        name="dimensions"
                                        tooltip="Ví dụ: 35x40x10 cm (Dài x Rộng x Cao)"
                                    >
                                        <Input placeholder="Ví dụ: 35x40x10 cm" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Hình ảnh"
                                        name="images"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e && e.fileList;
                                        }}
                                    >
                                        <Upload
                                            listType="picture-card"
                                            maxCount={5}
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
                                    { required: true, message: 'Vui lòng nhập mô tả sản phẩm!' },
                                    { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự!' }
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                                    showCount
                                    maxLength={1000}
                                />
                            </Form.Item>
                        </Card>

                        {/* Action Buttons */}
                        <Card size="small" style={{ textAlign: 'center', padding: '8px' }}>
                            <Space size="middle">
                                <Button
                                    onClick={() => onNavigateBack && onNavigateBack()}
                                    icon={<ArrowLeftOutlined />}
                                >
                                    ← Quay lại
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    Đặt lại
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    style={{
                                        background: '#ff8c42',
                                        borderColor: '#ff8c42',
                                        minWidth: '100px'
                                    }}
                                >
                                    Lưu
                                </Button>
                            </Space>
                        </Card>
                    </Form>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AddProductPage;