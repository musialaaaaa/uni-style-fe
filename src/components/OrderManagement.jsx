import React, { useState } from 'react';
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
    Steps
} from 'antd';
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
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;
const { Step } = Steps;

// Mock data for orders
const mockOrders = [
    {
        id: 1,
        created_at: '2024-12-20 10:30:00',
        created_by: 'customer_01',
        updated_at: '2024-12-20 11:00:00',
        updated_by: 'admin',
        code: 'ORD001',
        expired_at: '2024-12-27 23:59:59',
        full_name: 'Nguyễn Văn A',
        phone_number: '0901234567',
        shipping_address: '123 Đường ABC, Quận 1, TP.HCM',
        status: 'pending',
        total_amount: 1250000,
        account_id: 'ACC001',
        coupon_id: 'KM20'
    },
    {
        id: 2,
        created_at: '2024-12-19 14:15:30',
        created_by: 'customer_02',
        updated_at: '2024-12-19 16:20:00',
        updated_by: 'staff_01',
        code: 'ORD002',
        expired_at: '2024-12-26 23:59:59',
        full_name: 'Trần Thị B',
        phone_number: '0987654321',
        shipping_address: '456 Đường XYZ, Quận 3, TP.HCM',
        status: 'confirmed',
        total_amount: 890000,
        account_id: 'ACC002',
        coupon_id: null
    },
    {
        id: 3,
        created_at: '2024-12-18 09:45:00',
        created_by: 'customer_03',
        updated_at: '2024-12-19 10:30:00',
        updated_by: 'staff_02',
        code: 'ORD003',
        expired_at: '2024-12-25 23:59:59',
        full_name: 'Lê Văn C',
        phone_number: '0912345678',
        shipping_address: '789 Đường DEF, Quận 7, TP.HCM',
        status: 'shipping',
        total_amount: 2100000,
        account_id: 'ACC003',
        coupon_id: 'GIAM500K'
    },
    {
        id: 4,
        created_at: '2024-12-17 16:20:00',
        created_by: 'customer_04',
        updated_at: '2024-12-18 08:15:00',
        updated_by: 'admin',
        code: 'ORD004',
        expired_at: '2024-12-24 23:59:59',
        full_name: 'Phạm Thị D',
        phone_number: '0923456789',
        shipping_address: '321 Đường GHI, Quận 5, TP.HCM',
        status: 'completed',
        total_amount: 750000,
        account_id: 'ACC004',
        coupon_id: null
    },
    {
        id: 5,
        created_at: '2024-12-16 11:10:00',
        created_by: 'customer_05',
        updated_at: '2024-12-16 11:10:00',
        updated_by: 'customer_05',
        code: 'ORD005',
        expired_at: '2024-12-23 23:59:59',
        full_name: 'Hoàng Văn E',
        phone_number: '0934567890',
        shipping_address: '654 Đường JKL, Quận 10, TP.HCM',
        status: 'cancelled',
        total_amount: 1800000,
        account_id: 'ACC005',
        coupon_id: 'KM200'
    }
];

const OrderManagement = () => {
    const [orders, setOrders] = useState(mockOrders);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Status configurations
    const statusConfig = {
        pending: { color: 'orange', text: 'Chờ xác nhận', step: 0 },
        confirmed: { color: 'blue', text: 'Đã xác nhận', step: 1 },
        shipping: { color: 'cyan', text: 'Đang giao hàng', step: 2 },
        completed: { color: 'green', text: 'Hoàn thành', step: 3 },
        cancelled: { color: 'red', text: 'Đã hủy', step: -1 }
    };

    // Filter orders based on search term and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone_number.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStep = (status) => {
        return statusConfig[status]?.step || 0;
    };

    const isExpired = (expiredAt) => {
        return dayjs().isAfter(dayjs(expiredAt));
    };

    const handleEdit = (record) => {
        setEditingOrder(record);
        form.setFieldsValue({
            code: record.code,
            full_name: record.full_name,
            phone_number: record.phone_number,
            shipping_address: record.shipping_address,
            status: record.status,
            total_amount: record.total_amount,
            account_id: record.account_id,
            coupon_id: record.coupon_id,
            expired_at: dayjs(record.expired_at)
        });
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        setViewingOrder(record);
        setIsViewModalVisible(true);
    };

    const handleDelete = (id) => {
        setOrders(prev => prev.filter(order => order.id !== id));
        message.success('Xóa đơn hàng thành công!');
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

            if (editingOrder) {
                // Update existing order
                setOrders(prev => prev.map(order =>
                    order.id === editingOrder.id ? {
                        ...order,
                        ...values,
                        expired_at: values.expired_at.format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: currentTime,
                        updated_by: 'admin'
                    } : order
                ));
                message.success('Cập nhật đơn hàng thành công!');
            } else {
                // Create new order
                const newOrder = {
                    id: Math.max(...orders.map(o => o.id), 0) + 1,
                    ...values,
                    created_at: currentTime,
                    created_by: 'admin',
                    updated_at: currentTime,
                    updated_by: 'admin',
                    expired_at: values.expired_at.format('YYYY-MM-DD HH:mm:ss')
                };

                setOrders(prev => [...prev, newOrder]);
                message.success('Tạo đơn hàng thành công!');
            }

            handleCloseModal();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingOrder(null);
        form.resetFields();
    };

    const handleCloseViewModal = () => {
        setIsViewModalVisible(false);
        setViewingOrder(null);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
            render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (text, record) => (
                <div>
                    <Text strong style={{ color: '#722ed1' }}>{text}</Text>
                    {isExpired(record.expired_at) && (
                        <div><Tag color="red" size="small">Hết hạn</Tag></div>
                    )}
                </div>
            )
        },
        {
            title: 'Khách hàng',
            dataIndex: 'full_name',
            key: 'full_name',
            width: 150,
            render: (text, record) => (
                <div>
                    <div><Text strong>{text}</Text></div>
                    <div style={{ fontSize: 12, color: '#666' }}>{record.phone_number}</div>
                </div>
            )
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'shipping_address',
            key: 'shipping_address',
            width: 200,
            ellipsis: true,
            render: (text) => (
                <Text style={{ fontSize: 12 }} title={text}>{text}</Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            filters: [
                { text: 'Chờ xác nhận', value: 'pending' },
                { text: 'Đã xác nhận', value: 'confirmed' },
                { text: 'Đang giao hàng', value: 'shipping' },
                { text: 'Hoàn thành', value: 'completed' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const config = statusConfig[status];
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            key: 'total_amount',
            width: 120,
            align: 'right',
            render: (amount) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {amount.toLocaleString()}₫
                </Text>
            ),
            sorter: (a, b) => a.total_amount - b.total_amount,
        },
        {
            title: 'Voucher',
            dataIndex: 'coupon_id',
            key: 'coupon_id',
            width: 100,
            render: (coupon) =>
                coupon ? <Tag color="green">{coupon}</Tag> : <Text type="secondary">-</Text>
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 140,
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: 'Hết hạn',
            dataIndex: 'expired_at',
            key: 'expired_at',
            width: 140,
            render: (text) => (
                <div>
                    <div>{dayjs(text).format('DD/MM/YYYY HH:mm')}</div>
                    {isExpired(text) && (
                        <Text type="danger" style={{ fontSize: 11 }}>Đã hết hạn</Text>
                    )}
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                        title="Xem chi tiết"
                        onClick={() => handleView(record)}
                    />

                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        title="Chỉnh sửa"
                        onClick={() => handleEdit(record)}
                        disabled={record.status === 'completed' || record.status === 'cancelled'}
                    />

                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa đơn hàng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            title="Xóa"
                            danger
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                <ShoppingCartOutlined style={{ marginRight: 8 }} />
                                Quản lý Đơn hàng
                            </Title>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalVisible(true)}
                                style={{
                                    borderRadius: 8,
                                    boxShadow: '0 2px 6px rgba(24, 144, 255, 0.3)'
                                }}
                            >
                                Thêm đơn hàng
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <Row gutter={16} align="middle">
                        <Col flex="auto">
                            <Search
                                placeholder="Tìm theo mã đơn hàng, tên khách hàng, số điện thoại..."
                                allowClear
                                style={{ width: '100%' }}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                <Option value="pending">Chờ xác nhận</Option>
                                <Option value="confirmed">Đã xác nhận</Option>
                                <Option value="shipping">Đang giao hàng</Option>
                                <Option value="completed">Hoàn thành</Option>
                                <Option value="cancelled">Đã hủy</Option>
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
                        total: filteredOrders.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} đơn hàng`,
                    }}
                    scroll={{ x: 1400 }}
                    size="small"
                    rowClassName={(record) => {
                        if (isExpired(record.expired_at)) return 'expired-row';
                        if (record.status === 'cancelled') return 'cancelled-row';
                        return '';
                    }}
                />
            </Card>

            {/* Add/Edit Order Modal */}
            <Modal
                title={`${editingOrder ? 'Chỉnh sửa' : 'Thêm'} Đơn hàng`}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
                style={{ top: 20 }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        status: 'pending',
                        expired_at: dayjs().add(7, 'day')
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Mã đơn hàng"
                                name="code"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã đơn hàng!' },
                                    { max: 20, message: 'Mã đơn hàng không được quá 20 ký tự!' }
                                ]}
                            >
                                <Input
                                    prefix={<ShoppingCartOutlined />}
                                    placeholder="VD: ORD001"
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                            >
                                <Select>
                                    <Option value="pending">Chờ xác nhận</Option>
                                    <Option value="confirmed">Đã xác nhận</Option>
                                    <Option value="shipping">Đang giao hàng</Option>
                                    <Option value="completed">Hoàn thành</Option>
                                    <Option value="cancelled">Đã hủy</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên khách hàng"
                                name="full_name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập tên khách hàng"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone_number"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="0901234567"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Địa chỉ giao hàng"
                        name="shipping_address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Nhập địa chỉ giao hàng đầy đủ"
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Tổng tiền"
                                name="total_amount"
                                rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="1000000"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    suffix="₫"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Mã khách hàng"
                                name="account_id"
                                rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng!' }]}
                            >
                                <Input placeholder="ACC001" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Mã voucher"
                                name="coupon_id"
                            >
                                <Input
                                    prefix={<CreditCardOutlined />}
                                    placeholder="KM20 (không bắt buộc)"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Ngày hết hạn"
                        name="expired_at"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                    >
                        <DatePicker
                            showTime
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY HH:mm:ss"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleCloseModal}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingOrder ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Order Details Modal */}
            <Modal
                title="Chi tiết Đơn hàng"
                open={isViewModalVisible}
                onCancel={handleCloseViewModal}
                footer={[
                    <Button key="close" onClick={handleCloseViewModal}>
                        Đóng
                    </Button>
                ]}
                width={700}
            >
                {viewingOrder && (
                    <div>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="ID">{viewingOrder.id}</Descriptions.Item>
                            <Descriptions.Item label="Mã đơn hàng">
                                <Text strong style={{ color: '#722ed1' }}>{viewingOrder.code}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Khách hàng">{viewingOrder.full_name}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{viewingOrder.phone_number}</Descriptions.Item>

                            <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                                {viewingOrder.shipping_address}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                <Tag color={statusConfig[viewingOrder.status].color}>
                                    {statusConfig[viewingOrder.status].text}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
                                <Text strong style={{ color: '#52c41a' }}>
                                    {viewingOrder.total_amount.toLocaleString()}₫
                                </Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Mã khách hàng">{viewingOrder.account_id}</Descriptions.Item>
                            <Descriptions.Item label="Voucher">
                                {viewingOrder.coupon_id ? (
                                    <Tag color="green">{viewingOrder.coupon_id}</Tag>
                                ) : (
                                    <Text type="secondary">Không có</Text>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày tạo">
                                {dayjs(viewingOrder.created_at).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người tạo">{viewingOrder.created_by}</Descriptions.Item>

                            <Descriptions.Item label="Cập nhật cuối">
                                {dayjs(viewingOrder.updated_at).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người cập nhật">{viewingOrder.updated_by}</Descriptions.Item>

                            <Descriptions.Item label="Hết hạn" span={2}>
                                <div>
                                    {dayjs(viewingOrder.expired_at).format('DD/MM/YYYY HH:mm:ss')}
                                    {isExpired(viewingOrder.expired_at) && (
                                        <Tag color="red" style={{ marginLeft: 8 }}>Đã hết hạn</Tag>
                                    )}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 24 }}>
                            <Title level={5}>Tiến trình đơn hàng</Title>
                            <Steps
                                current={getStatusStep(viewingOrder.status)}
                                status={viewingOrder.status === 'cancelled' ? 'error' : 'process'}
                                size="small"
                            >
                                <Step title="Chờ xác nhận" description="Đơn hàng đã được tạo" />
                                <Step title="Đã xác nhận" description="Xác nhận và chuẩn bị hàng" />
                                <Step title="Đang giao hàng" description="Hàng đang được vận chuyển" />
                                <Step title="Hoàn thành" description="Giao hàng thành công" />
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