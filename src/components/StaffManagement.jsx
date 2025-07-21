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
    Badge,
    Switch
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    PhoneOutlined,
    MailOutlined,
    TeamOutlined,
    CalendarOutlined,
    LockOutlined,
    UnlockOutlined,
    ReloadOutlined,
    EyeOutlined,
    CrownOutlined,
    SafetyOutlined,
    KeyOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Password } = Input;

const StaffManagement = ({ token, currentUser }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    // Mock data dựa trên cấu trúc database
    const mockStaff = [
        {
            id: 1,
            username: 'admin',
            email: 'admin@unistyle.com',
            full_name: 'Admin',
            phone: '0123456789',
            role: 'admin',
            status: 'active',
            department: 'IT',
            position: 'System Administrator',
            hire_date: '2022-01-15',
            salary: 25000000,
            address: 'Hà Nội',
            emergency_contact: '0987654321',
            last_login: '2025-01-21 09:30:00',
            permissions: ['all'],
            created_by: 'SYSTEM',
            created_at: '2022-01-15 10:00:00',
            updated_at: '2025-01-21 09:30:00'
        },
        {
            id: 2,
            username: 'manager001',
            email: 'manager@unistyle.com',
            full_name: 'Nguyễn Văn Manager',
            phone: '0901111111',
            role: 'manager',
            status: 'active',
            department: 'Sales',
            position: 'Sales Manager',
            hire_date: '2022-06-10',
            salary: 20000000,
            address: 'TP.HCM',
            emergency_contact: '0912345678',
            last_login: '2025-01-21 08:45:00',
            permissions: ['sales', 'customers', 'reports'],
            created_by: 'admin',
            created_at: '2022-06-10 14:20:00',
            updated_at: '2025-01-21 08:45:00'
        },
        {
            id: 3,
            username: 'staff001',
            email: 'staff1@unistyle.com',
            full_name: 'Trần Thị Staff',
            phone: '0902222222',
            role: 'staff',
            status: 'active',
            department: 'Sales',
            position: 'Sales Representative',
            hire_date: '2023-03-20',
            salary: 12000000,
            address: 'Đà Nẵng',
            emergency_contact: '0923456789',
            last_login: '2025-01-20 17:30:00',
            permissions: ['sales', 'customers'],
            created_by: 'manager001',
            created_at: '2023-03-20 09:15:00',
            updated_at: '2025-01-20 17:30:00'
        },
        {
            id: 4,
            username: 'warehouse001',
            email: 'warehouse@unistyle.com',
            full_name: 'Lê Văn Kho',
            phone: '0903333333',
            role: 'staff',
            status: 'inactive',
            department: 'Warehouse',
            position: 'Warehouse Keeper',
            hire_date: '2023-08-15',
            salary: 10000000,
            address: 'Hà Nội',
            emergency_contact: '0934567890',
            last_login: '2025-01-15 16:00:00',
            permissions: ['inventory', 'products'],
            created_by: 'admin',
            created_at: '2023-08-15 11:30:00',
            updated_at: '2025-01-15 16:00:00'
        }
    ];

    const departments = [
        'IT', 'Sales', 'Marketing', 'Warehouse', 'Customer Service', 'Finance', 'HR'
    ];

    const roles = [
        { value: 'admin', label: 'Quản trị viên', color: 'red' },
        { value: 'manager', label: 'Quản lý', color: 'orange' },
        { value: 'staff', label: 'Nhân viên', color: 'blue' }
    ];

    const permissions = [
        'all', 'sales', 'customers', 'products', 'inventory', 'reports', 'settings'
    ];

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStaff(mockStaff);
            message.success('Tải dữ liệu thành công');
        } catch (error) {
            message.error('Không thể tải dữ liệu nhân viên');
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingStaff(null);
        form.resetFields();
        form.setFieldsValue({
            status: 'active',
            role: 'staff',
            permissions: ['sales']
        });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingStaff(record);
        form.setFieldsValue({
            ...record,
            hire_date: record.hire_date ? moment(record.hire_date) : null
        });
        setModalVisible(true);
    };

    const handleView = (record) => {
        setSelectedStaff(record);
        setDetailModalVisible(true);
    };

    const handleChangePassword = (record) => {
        setSelectedStaff(record);
        passwordForm.resetFields();
        setPasswordModalVisible(true);
    };

    const handleDelete = async (id) => {
        if (id === 1) {
            message.error('Không thể xóa tài khoản Admin chính');
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setStaff(prev => prev.filter(item => item.id !== id));
            message.success('Xóa nhân viên thành công');
        } catch (error) {
            message.error('Không thể xóa nhân viên');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const staffData = {
                ...values,
                hire_date: values.hire_date ? values.hire_date.format('YYYY-MM-DD') : null,
                updated_at: new Date().toISOString(),
                updated_by: currentUser?.username || 'system'
            };

            if (editingStaff) {
                setStaff(prev => prev.map(item =>
                    item.id === editingStaff.id
                        ? { ...item, ...staffData }
                        : item
                ));
                message.success('Cập nhật nhân viên thành công');
            } else {
                const newStaff = {
                    id: Date.now(),
                    ...staffData,
                    last_login: null,
                    created_by: currentUser?.username || 'system',
                    created_at: new Date().toISOString()
                };
                setStaff(prev => [...prev, newStaff]);
                message.success('Thêm nhân viên thành công');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (values) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate password change
            message.success(`Đổi mật khẩu cho ${selectedStaff.username} thành công`);

            setPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            message.error('Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        if (id === 1 && status === 'inactive') {
            message.error('Không thể vô hiệu hóa tài khoản Admin chính');
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setStaff(prev => prev.map(item =>
                item.id === id ? {
                    ...item,
                    status,
                    updated_at: new Date().toISOString()
                } : item
            ));
            message.success(`${status === 'active' ? 'Kích hoạt' : 'Vô hiệu hóa'} nhân viên thành công`);
        } catch (error) {
            message.error('Không thể thay đổi trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staff.filter(member => {
        const matchesSearch =
            member.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            member.email.toLowerCase().includes(searchText.toLowerCase()) ||
            member.phone.includes(searchText) ||
            member.username.toLowerCase().includes(searchText.toLowerCase()) ||
            member.department.toLowerCase().includes(searchText.toLowerCase());

        const matchesRole = !roleFilter || member.role === roleFilter;
        const matchesStatus = !statusFilter || member.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleInfo = (role) => {
        const roleInfo = roles.find(r => r.value === role);
        return roleInfo || { label: role, color: 'default' };
    };

    const columns = [
        {
            title: 'Nhân viên',
            key: 'staff',
            width: 250,
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: record.role === 'admin' ? '#ff4d4f' :
                                record.role === 'manager' ? '#fa8c16' : '#1890ff'
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
                        <Tag size="small" color={getRoleInfo(record.role).color}>
                            {getRoleInfo(record.role).label}
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
            title: 'Phòng ban / Vị trí',
            key: 'department',
            width: 150,
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <TeamOutlined style={{ marginRight: 4 }} />
                        <Text strong>{record.department}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.position}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Lương',
            dataIndex: 'salary',
            key: 'salary',
            width: 120,
            render: (salary) => (
                <Text style={{ color: '#52c41a', fontWeight: 500 }}>
                    {salary ? `${salary.toLocaleString()}đ` : 'Chưa cập nhật'}
                </Text>
            ),
            sorter: (a, b) => (a.salary || 0) - (b.salary || 0),
        },
        {
            title: 'Ngày vào làm',
            dataIndex: 'hire_date',
            key: 'hire_date',
            width: 120,
            render: (date) => (
                <div>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 12 }}>
                        {date ? moment(date).format('DD/MM/YYYY') : 'Chưa có'}
                    </Text>
                </div>
            ),
            sorter: (a, b) => moment(a.hire_date) - moment(b.hire_date),
        },
        {
            title: 'Đăng nhập cuối',
            dataIndex: 'last_login',
            key: 'last_login',
            width: 140,
            render: (date) => (
                <Text style={{ fontSize: 11 }}>
                    {date ? moment(date).format('DD/MM/YYYY HH:mm') : 'Chưa đăng nhập'}
                </Text>
            ),
            sorter: (a, b) => moment(a.last_login) - moment(b.last_login),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status, record) => (
                <Switch
                    checked={status === 'active'}
                    onChange={(checked) => handleStatusChange(record.id, checked ? 'active' : 'inactive')}
                    size="small"
                    disabled={record.id === 1}
                />
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
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
                    <Tooltip title="Đổi mật khẩu">
                        <Button
                            type="text"
                            icon={<KeyOutlined />}
                            size="small"
                            onClick={() => handleChangePassword(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa nhân viên này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                        disabled={record.id === 1}
                    >
                        <Tooltip title={record.id === 1 ? 'Không thể xóa Admin' : 'Xóa'}>
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                disabled={record.id === 1}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Statistics calculations
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.status === 'active').length;
    const adminCount = staff.filter(s => s.role === 'admin').length;
    const managerCount = staff.filter(s => s.role === 'manager').length;

    return (
        <div style={{ padding: '0 24px 24px 24px' }}>
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng nhân viên"
                            value={totalStaff}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Đang hoạt động"
                            value={activeStaff}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Quản trị viên"
                            value={adminCount}
                            prefix={<CrownOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Quản lý"
                            value={managerCount}
                            prefix={<SafetyOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Card
                title={
                    <Space>
                        <TeamOutlined />
                        Quản lý nhân viên
                        <Badge count={filteredStaff.length} showZero color="#1890ff" />
                    </Space>
                }
                extra={
                    <Space>
                        <Input
                            placeholder="Tìm kiếm nhân viên..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Select
                            placeholder="Vai trò"
                            value={roleFilter}
                            onChange={setRoleFilter}
                            style={{ width: 120 }}
                            allowClear
                        >
                            {roles.map(role => (
                                <Option key={role.value} value={role.value}>
                                    {role.label}
                                </Option>
                            ))}
                        </Select>
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
                            onClick={fetchStaff}
                            loading={loading}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Thêm nhân viên
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredStaff}
                    rowKey="id"
                    loading={loading}
                    size="small"
                    pagination={{
                        total: filteredStaff.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} nhân viên`,
                    }}
                    scroll={{ x: 1300 }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
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
                        <Col span={8}>
                            <Form.Item
                                name="role"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                            >
                                <Select placeholder="Chọn vai trò">
                                    {roles.map(role => (
                                        <Option key={role.value} value={role.value}>
                                            {role.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="department"
                                label="Phòng ban"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                            >
                                <Select placeholder="Chọn phòng ban">
                                    {departments.map(dept => (
                                        <Option key={dept} value={dept}>
                                            {dept}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="position"
                                label="Vị trí công việc"
                                rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
                            >
                                <Input placeholder="Nhập vị trí công việc" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="hire_date"
                                label="Ngày vào làm"
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Chọn ngày vào làm"
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="salary"
                                label="Lương (VNĐ)"
                            >
                                <Input
                                    type="number"
                                    placeholder="Nhập mức lương"
                                    addonAfter="đ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="emergency_contact"
                                label="SĐT khẩn cấp"
                            >
                                <Input placeholder="Nhập số điện thoại khẩn cấp" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                    >
                        <TextArea
                            rows={2}
                            placeholder="Nhập địa chỉ..."
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Form.Item
                        name="permissions"
                        label="Quyền hạn"
                        rules={[{ required: true, message: 'Vui lòng chọn quyền hạn' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn quyền hạn"
                            allowClear
                        >
                            {permissions.map(perm => (
                                <Option key={perm} value={perm}>
                                    {perm === 'all' ? 'Tất cả quyền' : perm}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingStaff ? 'Cập nhật' : 'Thêm mới'}
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
                                backgroundColor: selectedStaff?.role === 'admin' ? '#ff4d4f' :
                                    selectedStaff?.role === 'manager' ? '#fa8c16' : '#1890ff'
                            }}
                        />
                        Chi tiết nhân viên
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
                            handleEdit(selectedStaff);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                ]}
                width={700}
            >
                {selectedStaff && (
                    <div>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={6}>
                                <Statistic
                                    title="Vai trò"
                                    value={getRoleInfo(selectedStaff.role).label}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Phòng ban"
                                    value={selectedStaff.department}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Lương"
                                    value={selectedStaff.salary || 0}
                                    formatter={(value) => `${value.toLocaleString()}đ`}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Trạng thái"
                                    value={selectedStaff.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Tên đăng nhập:</Text><br />
                                    <Text>{selectedStaff.username}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Họ và tên:</Text><br />
                                    <Text>{selectedStaff.full_name}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Email:</Text><br />
                                    <Text copyable>{selectedStaff.email}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Số điện thoại:</Text><br />
                                    <Text copyable>{selectedStaff.phone}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>SĐT khẩn cấp:</Text><br />
                                    <Text>{selectedStaff.emergency_contact || 'Chưa cập nhật'}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Vị trí:</Text><br />
                                    <Text>{selectedStaff.position}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Ngày vào làm:</Text><br />
                                    <Text>
                                        {selectedStaff.hire_date
                                            ? moment(selectedStaff.hire_date).format('DD/MM/YYYY')
                                            : 'Chưa cập nhật'
                                        }
                                    </Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Đăng nhập cuối:</Text><br />
                                    <Text>
                                        {selectedStaff.last_login
                                            ? moment(selectedStaff.last_login).format('DD/MM/YYYY HH:mm')
                                            : 'Chưa đăng nhập'
                                        }
                                    </Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Tạo bởi:</Text><br />
                                    <Text>{selectedStaff.created_by}</Text>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Ngày tạo:</Text><br />
                                    <Text>{moment(selectedStaff.created_at).format('DD/MM/YYYY HH:mm')}</Text>
                                </div>
                            </Col>
                        </Row>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Địa chỉ:</Text><br />
                            <Text>{selectedStaff.address || 'Chưa cập nhật'}</Text>
                        </div>

                        <Divider />

                        <div>
                            <Text strong>Quyền hạn:</Text><br />
                            <Space wrap style={{ marginTop: 8 }}>
                                {selectedStaff.permissions?.map(perm => (
                                    <Tag key={perm} color="blue">
                                        {perm === 'all' ? 'Tất cả quyền' : perm}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Change Password Modal */}
            <Modal
                title={
                    <Space>
                        <KeyOutlined />
                        Đổi mật khẩu - {selectedStaff?.full_name}
                    </Space>
                }
                open={passwordModalVisible}
                onCancel={() => {
                    setPasswordModalVisible(false);
                    passwordForm.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordSubmit}
                >
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                        ]}
                    >
                        <Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setPasswordModalVisible(false);
                                passwordForm.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Đổi mật khẩu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StaffManagement;