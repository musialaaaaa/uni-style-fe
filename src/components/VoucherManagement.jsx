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
    Progress,
    Tooltip,
    Typography,
    Card,
    Row,
    Col,
    Popconfirm,
    message
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ReloadOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

// Mock data for vouchers with new structure
const mockVouchers = [
    {
        id: 1,
        code: 'KM20',
        discountType: 'Phần trăm',
        value: 20,
        expiryDate: '2024-12-22',
        usageLimit: 100,
        used: 23,
        isDeleted: false,
        createdBy: 'Admin',
        createdAt: '2024-12-01 10:30:00',
        lastEditedBy: 'Admin',
        lastEditedAt: '2024-12-01 10:30:00'
    },
    {
        id: 2,
        code: 'GIAM500K',
        discountType: 'Cố định',
        value: 500000,
        expiryDate: '2024-12-25',
        usageLimit: 200,
        used: 3,
        isDeleted: false,
        createdBy: 'Manager',
        createdAt: '2024-12-02 14:15:30',
        lastEditedBy: 'Admin',
        lastEditedAt: '2024-12-03 09:20:15'
    },
    {
        id: 3,
        code: 'KM200',
        discountType: 'Cố định',
        value: 200000,
        expiryDate: '2024-12-20',
        usageLimit: 150,
        used: 89,
        isDeleted: true,
        createdBy: 'Staff01',
        createdAt: '2024-11-15 16:45:22',
        lastEditedBy: 'Manager',
        lastEditedAt: '2024-12-01 11:30:45'
    },
    {
        id: 4,
        code: 'BLACK10',
        discountType: 'Phần trăm',
        value: 10,
        expiryDate: '2024-12-31',
        usageLimit: 500,
        used: 156,
        isDeleted: false,
        createdBy: 'Admin',
        createdAt: '2024-11-25 08:00:00',
        lastEditedBy: 'Admin',
        lastEditedAt: '2024-11-25 08:00:00'
    },
    {
        id: 5,
        code: 'WELCOME50',
        discountType: 'Cố định',
        value: 50000,
        expiryDate: '2025-01-31',
        usageLimit: 1000,
        used: 45,
        isDeleted: false,
        createdBy: 'Manager',
        createdAt: '2024-12-05 12:00:00',
        lastEditedBy: 'Manager',
        lastEditedAt: '2024-12-05 12:00:00'
    }
];

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState(mockVouchers);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeletedVouchers, setShowDeletedVouchers] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [form] = Form.useForm();

    // Filter vouchers based on search term and deleted status
    const filteredVouchers = vouchers.filter(voucher => {
        const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voucher.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDeletedFilter = showDeletedVouchers ? voucher.isDeleted : !voucher.isDeleted;
        return matchesSearch && matchesDeletedFilter;
    });

    const getExpiryStatus = (expiryDate) => {
        const today = dayjs();
        const expiry = dayjs(expiryDate);

        if (expiry.isBefore(today)) {
            return { status: 'error', text: 'Hết hạn' };
        } else {
            const diffDays = expiry.diff(today, 'day');

            if (diffDays <= 7) {
                return { status: 'warning', text: `${diffDays} ngày` };
            } else {
                return { status: 'success', text: `${diffDays} ngày` };
            }
        }
    };

    const handleEdit = (record) => {
        setEditingVoucher(record);
        form.setFieldsValue({
            code: record.code,
            discountType: record.discountType,
            value: record.value,
            expiryDate: dayjs(record.expiryDate),
            usageLimit: record.usageLimit,
            createdBy: record.createdBy
        });
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        Modal.info({
            title: 'Chi tiết Voucher',
            width: 600,
            content: (
                <div style={{ marginTop: 16 }}>
                    <Row gutter={[16, 8]}>
                        <Col span={8}><strong>ID:</strong></Col>
                        <Col span={16}>{record.id}</Col>

                        <Col span={8}><strong>Code:</strong></Col>
                        <Col span={16}><Tag color="purple">{record.code}</Tag></Col>

                        <Col span={8}><strong>Loại:</strong></Col>
                        <Col span={16}>{record.discountType}</Col>

                        <Col span={8}><strong>Giá trị:</strong></Col>
                        <Col span={16}>
                            {record.discountType === 'Phần trăm'
                                ? `${record.value}%`
                                : `${record.value.toLocaleString()}đ`
                            }
                        </Col>

                        <Col span={8}><strong>Hết hạn:</strong></Col>
                        <Col span={16}>{record.expiryDate}</Col>

                        <Col span={8}><strong>Giới hạn:</strong></Col>
                        <Col span={16}>{record.usageLimit.toLocaleString()} lượt</Col>

                        <Col span={8}><strong>Đã dùng:</strong></Col>
                        <Col span={16}>{record.used.toLocaleString()} lượt</Col>

                        <Col span={8}><strong>Trạng thái:</strong></Col>
                        <Col span={16}>
                            <Tag color={record.isDeleted ? 'red' : 'green'}>
                                {record.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                            </Tag>
                        </Col>

                        <Col span={8}><strong>Tạo bởi:</strong></Col>
                        <Col span={16}>{record.createdBy}</Col>

                        <Col span={8}><strong>Ngày tạo:</strong></Col>
                        <Col span={16}>{dayjs(record.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Col>

                        <Col span={8}><strong>Sửa cuối:</strong></Col>
                        <Col span={16}>{record.lastEditedBy}</Col>

                        <Col span={8}><strong>Ngày sửa:</strong></Col>
                        <Col span={16}>{dayjs(record.lastEditedAt).format('DD/MM/YYYY HH:mm:ss')}</Col>
                    </Row>
                </div>
            ),
        });
    };

    const handleToggleDelete = (record) => {
        const action = record.isDeleted ? 'khôi phục' : 'xóa';

        setVouchers(prev => prev.map(voucher =>
            voucher.id === record.id ? {
                ...voucher,
                isDeleted: !voucher.isDeleted,
                lastEditedBy: 'Admin',
                lastEditedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
            } : voucher
        ));

        message.success(`${action === 'xóa' ? 'Xóa' : 'Khôi phục'} voucher thành công!`);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

            if (editingVoucher) {
                // Update existing voucher
                setVouchers(prev => prev.map(voucher =>
                    voucher.id === editingVoucher.id ? {
                        ...voucher,
                        code: values.code.toUpperCase(),
                        discountType: values.discountType,
                        value: values.value,
                        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
                        usageLimit: values.usageLimit,
                        lastEditedBy: 'Admin',
                        lastEditedAt: currentTime
                    } : voucher
                ));
                message.success('Cập nhật voucher thành công!');
            } else {
                // Create new voucher
                const newVoucher = {
                    id: Math.max(...vouchers.map(v => v.id), 0) + 1,
                    code: values.code.toUpperCase(),
                    discountType: values.discountType,
                    value: values.value,
                    expiryDate: values.expiryDate.format('YYYY-MM-DD'),
                    usageLimit: values.usageLimit,
                    used: 0,
                    isDeleted: false,
                    createdBy: values.createdBy,
                    createdAt: currentTime,
                    lastEditedBy: values.createdBy,
                    lastEditedAt: currentTime
                };

                setVouchers(prev => [...prev, newVoucher]);
                message.success('Thêm voucher thành công!');
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
        setEditingVoucher(null);
        form.resetFields();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
            render: (text) => <strong style={{ color: '#1890ff' }}>{text}</strong>
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (text) => (
                <Tag color="purple" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {text}
                </Tag>
            )
        },
        {
            title: 'Loại giảm',
            dataIndex: 'discountType',
            key: 'discountType',
            width: 100,
            filters: [
                { text: 'Cố định', value: 'Cố định' },
                { text: 'Phần trăm', value: 'Phần trăm' },
            ],
            onFilter: (value, record) => record.discountType === value,
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
            width: 120,
            render: (value, record) => (
                <span style={{ color: '#52c41a', fontWeight: 600 }}>
                    {record.discountType === 'Phần trăm'
                        ? `${value}%`
                        : `${value.toLocaleString()}đ`
                    }
                </span>
            )
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            width: 140,
            render: (date) => {
                const status = getExpiryStatus(date);
                return (
                    <div>
                        <div>{date}</div>
                        <Tag color={status.status} size="small">
                            {status.text}
                        </Tag>
                    </div>
                );
            }
        },
        {
            title: 'Giới hạn lượt',
            dataIndex: 'usageLimit',
            key: 'usageLimit',
            width: 110,
            align: 'center',
            render: (text) => text.toLocaleString()
        },
        {
            title: 'Đã dùng',
            dataIndex: 'used',
            key: 'used',
            width: 120,
            align: 'center',
            render: (used, record) => {
                const percentage = Math.min((used / record.usageLimit) * 100, 100);
                return (
                    <div>
                        <div>{used.toLocaleString()}</div>
                        <Progress
                            percent={percentage}
                            size="small"
                            showInfo={false}
                            strokeColor={percentage > 80 ? '#ff4d4f' : percentage > 50 ? '#fa8c16' : '#52c41a'}
                        />
                    </div>
                );
            }
        },
        {
            title: 'Đã xóa',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            width: 100,
            align: 'center',
            render: (isDeleted) => (
                <Tag color={isDeleted ? 'red' : 'green'}>
                    {isDeleted ? 'Đã xóa' : 'Hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Tạo bởi',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Sửa cuối',
            dataIndex: 'lastEditedBy',
            key: 'lastEditedBy',
            width: 100,
        },
        {
            title: 'Ngày sửa',
            dataIndex: 'lastEditedAt',
            key: 'lastEditedAt',
            width: 140,
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            fixed: 'right',
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
                            disabled={record.isDeleted}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title={`Bạn có chắc chắn muốn ${record.isDeleted ? 'khôi phục' : 'xóa'} voucher này?`}
                        onConfirm={() => handleToggleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Tooltip title={record.isDeleted ? "Khôi phục" : "Xóa"}>
                            <Button
                                type="text"
                                icon={record.isDeleted ? <ReloadOutlined /> : <DeleteOutlined />}
                                size="small"
                                danger={!record.isDeleted}
                            />
                        </Tooltip>
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
                                Quản lý Voucher
                            </Title>
                        </Col>
                        <Col>
                            <Space>
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => setShowDeletedVouchers(!showDeletedVouchers)}
                                    type={showDeletedVouchers ? 'primary' : 'default'}
                                >
                                    {showDeletedVouchers ? 'Hiện voucher hoạt động' : 'Hiện voucher đã xóa'}
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsModalVisible(true)}
                                >
                                    Thêm voucher
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <span style={{ marginRight: 8 }}>
                                Hiển thị voucher {showDeletedVouchers ? 'đã xóa' : 'hoạt động'}
                            </span>
                        </Col>
                        <Col>
                            <Search
                                placeholder="Tìm theo mã hoặc người tạo..."
                                allowClear
                                style={{ width: 300 }}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                        </Col>
                    </Row>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredVouchers}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        total: filteredVouchers.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} mục`,
                    }}
                    scroll={{ x: 1400 }}
                    size="small"
                    rowClassName={(record) => record.isDeleted ? 'deleted-row' : ''}
                />
            </Card>

            <Modal
                title={`${editingVoucher ? 'Chỉnh sửa' : 'Thêm'} Voucher`}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        discountType: 'Cố định',
                        createdBy: 'Admin'
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Mã Voucher"
                                name="code"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã voucher!' },
                                    { max: 20, message: 'Mã voucher không được quá 20 ký tự!' }
                                ]}
                            >
                                <Input placeholder="VD: SALE20" style={{ textTransform: 'uppercase' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Loại giảm giá"
                                name="discountType"
                            >
                                <Select>
                                    <Option value="Cố định">Cố định (VNĐ)</Option>
                                    <Option value="Phần trăm">Phần trăm (%)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giá trị giảm"
                                name="value"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    placeholder="VD: 50000"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày hết hạn"
                                name="expiryDate"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giới hạn số lượt sử dụng"
                                name="usageLimit"
                                rules={[{ required: true, message: 'Vui lòng nhập giới hạn sử dụng!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    placeholder="100"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Người tạo"
                                name="createdBy"
                            >
                                <Select>
                                    <Option value="Admin">Admin</Option>
                                    <Option value="Manager">Manager</Option>
                                    <Option value="Staff01">Staff01</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleCloseModal}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingVoucher ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VoucherManagement;