import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    message,
    Tag,
    Avatar,
    Tooltip,
    Row,
    Col,
    Select,
    DatePicker,
    Statistic,
    Divider,
    Typography,
    Popconfirm,
    Badge
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined,
    CalendarOutlined,
    ShoppingOutlined,
    ReloadOutlined,
    ExportOutlined,
    ImportOutlined,
    EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const CustomerManagement = ({ token, currentUser }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [form] = Form.useForm();

    // Mock data dựa trên cấu trúc database
    const mockCustomers = [
        {
            id: 1,
            username: 'customer001',
            email: 'nguyenvana@email.com',
            full_name: 'Nguyễn Văn A',
            phone: '0901234567',
            address: 'Số 123, Phố Huế, Hai Bà Trưng, Hà Nội',
            date_of_birth: '1990-05-15',
            gender: 'male',
            status: 'active',
            total_orders: 25,
            total_spent: 12500000,
            last_order_date: '2025-01-15',
            member_since: '2023-03-10',
            loyalty_points: 1250,
            created_at: '2023-03-10 10:30:00',
            updated_at: '2025-01-15 14:20:00'
        },
        {
            id: 2,
            username: 'customer002',
            email: 'tranthib@email.com',
            full_name: 'Trần Thị B',
            phone: '0907654321',
            address: '456 Lê Văn Sỹ, Quận 3, TP.HCM',
            date_of_birth: '1985-08-22',
            gender: 'female',
            status: 'active',
            total_orders: 18,
            total_spent: 8750000,
            last_order_date: '2025-01-18',
            member_since: '2023-06-20',
            loyalty_points: 875,
            created_at: '2023-06-20 09:15:00',
            updated_at: '2025-01-18 16:45:00'
        },
        {
            id: 3,
            username: 'customer003',
            email: 'levancuong@email.com',
            full_name: 'Lê Văn Cường',
            phone: '0903456789',
            address: '789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
            date_of_birth: '1992-12-03',
            gender: 'male',
            status: 'inactive',
            total_orders: 5,
            total_spent: 2100000,
            last_order_date: '2024-11-30',
            member_since: '2024-01-15',
            loyalty_points: 210,
            created_at: '2024-01-15 11:00:00',
            updated_at: '2024-11-30 13:30:00'
        },
        {
            id: 4,
            username: 'customer004',
            email: 'phamthid@email.com',
            full_name: 'Phạm Thị D',
            phone: '0905678123',
            address: '321 Hoàng Diệu, Quận 4, TP.HCM',
            date_of_birth: '1988-07-10',
            gender: 'female',
            status: 'active',
            total_orders: 42,
            total_spent: 18900000,
            last_order_date: '2025-01-20',
            member_since: '2022-11-05',
            loyalty_points: 1890,
            created_at: '2022-11-05 14:20:00',
            updated_at: '2025-01-20 10:15:00'
        }
    ];

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCustomers(mockCustomers);
            message.success('Tải dữ liệu thành công');
        } catch (error) {
            message.error('Không thể tải dữ liệu khách hàng');
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        form.resetFields();
        form.setFieldsValue({
            status: 'active',
            gender: 'male'
        });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingCustomer(record);
        form.setFieldsValue({
            ...record,
            date_of_birth: record.date_of_birth ? moment(record.date_of_birth) : null
        });
        setModalVisible(true);
    };

    const handleView = (record) => {
        setSelectedCustomer(record);
        setDetailModalVisible(true);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setCustomers(prev => prev.filter(item => item.id !== id));
            message.success('Xóa khách hàng thành công');
        } catch (error) {
            message.error('Không thể xóa khách hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const customerData = {
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
                updated_at: new Date().toISOString()
            };

            if (editingCustomer) {
                setCustomers(prev => prev.map(item =>
                    item.id === editingCustomer.id
                        ? { ...item, ...customerData }
                        : item
                ));
                message.success('Cập nhật khách hàng thành công');
            } else {
                const newCustomer = {
                    id: Date.now(),
                    ...customerData,
                    total_orders: 0,
                    total_spent: 0,
                    loyalty_points: 0,
                    member_since: new Date().toISOString().split('T')[0],
                    created_at: new Date().toISOString()
                };
                setCustomers(prev => [...prev, newCustomer]);
                message.success('Thêm khách hàng thành công');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setCustomers(prev => prev.map(item =>
                item.id === id ? {
                    ...item,
                    status,
                    updated_at: new Date().toISOString()
                } : item
            ));
            message.success(`${status === 'active' ? 'Kích hoạt' : 'Vô hiệu hóa'} khách hàng thành công`);
        } catch (error) {
            message.error('Không thể thay đổi trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            customer.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.phone.includes(searchText) ||
            customer.username.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = !statusFilter || customer.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getCustomerLevel = (totalSpent) => {
        if (totalSpent >= 20000000) return { level: 'VIP', color: 'gold' };
        if (totalSpent >= 10000000) return { level: 'Premium', color: 'purple' };
        if (totalSpent >= 5000000) return { level: 'Silver', color: 'blue' };
        return { level: 'Bronze', color: 'default' };
    };

    const columns = [
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 250,
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: record.gender === 'female' ? '#f56a00' : '#1890ff'
                        }}
                    >
                        {record.full_name.charAt(0)}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.full_name}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            @{record.username}
                        </Text>
                        <br />
                        <Tag
                            size="small"
                            color={getCustomerLevel(record.total_spent).color}
                        >
                            {getCustomerLevel(record.total_spent).level}
                        </Tag>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            width: 200,
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <PhoneOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                        <Text copyable={{ text: record.phone }}>{record.phone}</Text>
                    </div>
                    <div>
                        <MailOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                        <Text copyable={{ text: record.email }} ellipsis style={{ maxWidth: 150 }}>
                            {record.email}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thống kê mua hàng',
            key: 'stats',
            width: 150,
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <ShoppingOutlined style={{ marginRight: 4 }} />
                        <Text strong>{record.total_orders}</Text> đơn
                    </div>
                    <div style={{ marginBottom: 4 }}>
                        <Text style={{ color: '#52c41a' }}>
                            {record.total_spent.toLocaleString()}đ
                        </Text>
                    </div>
                    <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {record.loyalty_points} điểm
                        </Text>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.total_spent - b.total_spent,
        },
        {
            title: 'Đơn hàng cuối',
            dataIndex: 'last_order_date',
            key: 'last_order_date',
            width: 120,
            render: (date) => (
                <div>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 12 }}>
                        {date ? moment(date).format('DD/MM/YYYY') : 'Chưa có'}
                    </Text>
                </div>
            ),
            sorter: (a, b) => moment(a.last_order_date) - moment(b.last_order_date),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    size="small"
                    style={{ width: 90 }}
                >
                    <Option value="active">
                        <Badge status="success" text="Hoạt động" />
                    </Option>
                    <Option value="inactive">
                        <Badge status="default" text="Tạm khóa" />
                    </Option>
                </Select>
            ),
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'member_since',
            key: 'member_since',
            width: 100,
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => moment(a.member_since) - moment(b.member_since),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space>
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
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa khách hàng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Statistics calculations
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
    const avgOrderValue = customers.reduce((sum, c) => sum + c.total_orders, 0);

    return (
        <div style={{ padding: '0 24px 24px 24px' }}>
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng khách hàng"
                            value={totalCustomers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Khách hàng hoạt động"
                            value={activeCustomers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng doanh thu"
                            value={totalRevenue}
                            prefix="₫"
                            formatter={(value) => value.toLocaleString()}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng đơn hàng"
                            value={avgOrderValue}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Card
                title={
                    <Space>
                        <UserOutlined />
                        Quản lý khách hàng
                        <Badge count={filteredCustomers.length} showZero color="#1890ff" />
                    </Space>
                }
                extra={
                    <Space>
                        <Input
                            placeholder="Tìm kiếm khách hàng..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Select
                            placeholder="Trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 120 }}
                            allowClear
                        >
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Tạm khóa</Option>
                        </Select>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchCustomers}
                            loading={loading}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Thêm khách hàng
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredCustomers}
                    rowKey="id"
                    loading={loading}
                    size="small"
                    pagination={{
                        total: filteredCustomers.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} khách hàng`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Tên đăng nhập"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                                    { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                                ]}
                            >
                                <Input placeholder="Nhập tên đăng nhập" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="full_name"
                                label="Họ và tên"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ tên' },
                                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="date_of_birth"
                                label="Ngày sinh"
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Chọn ngày sinh"
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                            >
                                <Select placeholder="Chọn giới tính">
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                    <Option value="other">Khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Nhập địa chỉ chi tiết..."
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Tạm khóa</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title={
                    <Space>
                        <Avatar
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: selectedCustomer?.gender === 'female' ? '#f56a00' : '#1890ff'
                            }}
                        />
                        Chi tiết khách hàng
                    </Space>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            setDetailModalVisible(false);
                            handleEdit(selectedCustomer);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                ]}
                width={600}
            >
                {selectedCustomer && (
                    <div>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={8}>
                                <Statistic
                                    title="Tổng đơn hàng"
                                    value={selectedCustomer.total_orders}
                                    prefix={<ShoppingOutlined />}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Tổng chi tiêu"
                                    value={selectedCustomer.total_spent}
                                    formatter={(value) => `${value.toLocaleString()}đ`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Điểm tích lũy"
                                    value={selectedCustomer.loyalty_points}
                                    suffix="điểm"
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Tên đăng nhập:</Text><br />
                                    <Text>{selectedCustomer.username}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Họ và tên:</Text><br />
                                    <Text>{selectedCustomer.full_name}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Email:</Text><br />
                                    <Text copyable>{selectedCustomer.email}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Số điện thoại:</Text><br />
                                    <Text copyable>{selectedCustomer.phone}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Ngày sinh:</Text><br />
                                    <Text>
                                        {selectedCustomer.date_of_birth
                                            ? moment(selectedCustomer.date_of_birth).format('DD/MM/YYYY')
                                            : 'Chưa cập nhật'
                                        }
                                    </Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Giới tính:</Text><br />
                                    <Text>
                                        {selectedCustomer.gender === 'male' ? 'Nam' :
                                            selectedCustomer.gender === 'female' ? 'Nữ' : 'Khác'}
                                    </Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Trạng thái:</Text><br />
                                    <Tag color={selectedCustomer.status === 'active' ? 'green' : 'red'}>
                                        {selectedCustomer.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                    </Tag>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Hạng thành viên:</Text><br />
                                    <Tag color={getCustomerLevel(selectedCustomer.total_spent).color}>
                                        {getCustomerLevel(selectedCustomer.total_spent).level}
                                    </Tag>
                                </div>
                            </Col>
                        </Row>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Địa chỉ:</Text><br />
                            <Text>{selectedCustomer.address || 'Chưa cập nhật'}</Text>
                        </div>

                        <Divider />

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Ngày tham gia:</Text><br />
                                <Text>{moment(selectedCustomer.member_since).format('DD/MM/YYYY')}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Đơn hàng cuối:</Text><br />
                                <Text>
                                    {selectedCustomer.last_order_date
                                        ? moment(selectedCustomer.last_order_date).format('DD/MM/YYYY')
                                        : 'Chưa có đơn hàng'
                                    }
                                </Text>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerManagement;