import React, { useState } from 'react';
import {
  Card, Typography, Tag, Input, Dropdown, Modal, message, Button,
  Form, Space
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  DownOutlined, FolderOutlined,
  AppstoreOutlined, DatabaseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { colors, styles } from '../../components/common/constants';

const { Title, Text } = Typography;

// ==================== 模拟数据 ====================

// 初始分组数据
const initialGroups = [
  { id: 1, name: '小花幼儿园', createTime: '2025-08-28', year: 2025, description: '小花幼儿园所有涂色数据集', datasetCount: 3 },
  { id: 2, name: '小草幼儿园', createTime: '2025-08-28', year: 2025, description: '小草幼儿园所有涂色数据集', datasetCount: 2 },
  { id: 3, name: '小树幼儿园', createTime: '2024-08-28', year: 2024, description: '小树幼儿园所有涂色数据集', datasetCount: 1 },
];

// ==================== 主组件 ====================

const GroupListPage = () => {
  const navigate = useNavigate();

  // -------------------- 状态管理 --------------------
  const [groups, setGroups] = useState(initialGroups);

  // 筛选状态
  const [activeYear, setActiveYear] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  // 分组操作弹窗状态
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  const [form] = Form.useForm();

  // -------------------- 计算属性 --------------------

  // 筛选后的分组列表
  const filteredGroups = groups.filter(group => {
    const matchYear = activeYear === 'all' || group.year === Number(activeYear);
    const matchSearch = group.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                       group.description?.toLowerCase().includes(searchValue.toLowerCase());
    return matchYear && matchSearch;
  });

  // -------------------- 事件处理 --------------------

  // 创建分组
  const handleCreateGroup = (values) => {
    const newGroup = {
      id: Date.now(),
      name: values.name,
      description: values.description || '',
      createTime: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear(),
      datasetCount: 0
    };
    setGroups([...groups, newGroup]);
    setIsCreateModalVisible(false);
    form.resetFields();
    message.success('分组创建成功');
  };

  // 编辑分组
  const handleEditGroup = (values) => {
    setGroups(groups.map(group =>
      group.id === currentGroup.id ? { ...group, name: values.name, description: values.description } : group
    ));
    setIsEditModalVisible(false);
    setCurrentGroup(null);
    form.resetFields();
    message.success('分组更新成功');
  };

  // 删除分组（同时删除其中的数据集）
  const handleDeleteGroup = () => {
    // 获取要删除的分组的数据集数量
    const deletedDatasetCount = currentGroup?.datasetCount || 0;
    
    setGroups(groups.filter(g => g.id !== currentGroup.id));
    setIsDeleteModalVisible(false);
    setCurrentGroup(null);
    
    if (deletedDatasetCount > 0) {
      message.success(`分组删除成功，同时删除了 ${deletedDatasetCount} 个数据集`);
    } else {
      message.success('分组删除成功');
    }
  };

  // 打开编辑弹窗
  const openEditModal = (group) => {
    setCurrentGroup(group);
    form.setFieldsValue({ name: group.name, description: group.description });
    setIsEditModalVisible(true);
  };

  // 打开删除确认弹窗
  const openDeleteModal = (group) => {
    setCurrentGroup(group);
    setIsDeleteModalVisible(true);
  };

  // 点击分组卡片 - 跳转到数据集列表页面
  const handleGroupClick = (group, e) => {
    // 如果事件对象存在，阻止冒泡
    if (e) {
      e.stopPropagation();
    }
    navigate(`/dataset/group/${group.id}`);
  };

  // -------------------- 视图渲染 --------------------

  return (
    <div style={{ width: '100%', height: '100%', padding: '0 24px 24px' }}>
      {/* 顶部栏 */}
      <div style={{
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AppstoreOutlined style={{ fontSize: 24, color: colors.primary }} />
          <Title level={4} style={{ margin: 0, color: colors.textPrimary, fontSize: 20 }}>
            数据集分组管理
          </Title>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Input
            placeholder="搜索分组..."
            prefix={<SearchOutlined style={{ color: colors.textTertiary }} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: 240,
              borderRadius: styles.borderRadius.md,
              backgroundColor: colors.neutralLight,
              border: 'none'
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            style={{
              backgroundColor: colors.primary,
              borderRadius: styles.borderRadius.md,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            新建分组
          </Button>
        </div>
      </div>

      {/* 年份筛选 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>筛选：</Text>
        {['all', 2025, 2024, 2023].map(item => (
          <Tag
            key={item}
            onClick={() => setActiveYear(item.toString())}
            style={{
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: styles.borderRadius.md,
              border: 'none',
              backgroundColor: activeYear === item.toString() ? colors.primaryLight : colors.neutralLight,
              color: activeYear === item.toString() ? colors.primary : colors.textSecondary,
              fontSize: 14,
              fontWeight: activeYear === item.toString() ? 500 : 400,
              transition: styles.transition
            }}
          >
            {item === 'all' ? '全部' : `${item}年`}
          </Tag>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <Text style={{ color: colors.textTertiary, fontSize: 13 }}>
            共 {filteredGroups.length} 个分组
          </Text>
        </div>
      </div>

      {/* 分组卡片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20
      }}>
        {/* 创建新分组卡片 */}
        <Card
          hoverable
          onClick={() => setIsCreateModalVisible(true)}
          style={{
            height: 160,
            borderRadius: styles.borderRadius.lg,
            backgroundColor: colors.neutralLight,
            cursor: 'pointer',
            border: `2px dashed ${colors.neutralDark}`,
            transition: styles.transition
          }}
          bodyStyle={{
            padding: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: colors.primaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <PlusOutlined style={{ fontSize: 28, color: colors.primary }} />
            </div>
            <Text style={{ color: colors.textSecondary, fontSize: 15, fontWeight: 500 }}>
              创建新分组
            </Text>
            <div style={{ marginTop: 4 }}>
              <Text style={{ color: colors.textTertiary, fontSize: 12 }}>
                用于分类管理数据集
              </Text>
            </div>
          </div>
        </Card>

        {/* 现有分组卡片 */}
        {filteredGroups.map(group => (
          <Card
            key={group.id}
            hoverable
            onClick={(e) => handleGroupClick(group, e)}
            style={{
              height: 160,
              borderRadius: styles.borderRadius.lg,
              position: 'relative',
              cursor: 'pointer',
              border: 'none',
              boxShadow: styles.shadow.sm,
              transition: styles.transition
            }}
            bodyStyle={{ padding: '20px', height: '100%' }}
          >
            {/* 右上角下拉菜单 */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
              <Dropdown menu={{
                items: [
                  { key: 'edit', icon: <EditOutlined />, label: '重命名', onClick: (e) => { e.domEvent.stopPropagation(); openEditModal(group); } },
                  { key: 'delete', icon: <DeleteOutlined />, label: '删除分组', danger: true, onClick: (e) => { e.domEvent.stopPropagation(); openDeleteModal(group); } }
                ]
              }} trigger={['click']}>
                <DownOutlined
                  style={{ cursor: 'pointer', color: colors.textTertiary, fontSize: 14, padding: 4, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            </div>

              {/* 卡片内容 */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: styles.borderRadius.md,
                  backgroundColor: colors.primaryLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <FolderOutlined style={{ fontSize: 24, color: colors.primary }} />
                </div>

                <Text style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {group.name}
                </Text>

                <Text style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginBottom: 8,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {group.description || '暂无描述'}
                </Text>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Space size={4}>
                    <DatabaseOutlined style={{ fontSize: 12, color: colors.textTertiary }} />
                    <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
                      {group.datasetCount} 个数据集
                    </Text>
                  </Space>
                  <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                    {group.createTime}
                  </Text>
                </div>
              </div>
            </Card>
        ))}
      </div>

      {/* ==================== 创建分组弹窗 ==================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusOutlined style={{ color: colors.primary }} />
            <span>创建新分组</span>
          </div>
        }
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={480}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item
            name="name"
            label="分组名称"
            rules={[
              { required: true, message: '请输入分组名称' },
              { max: 50, message: '分组名称最多50个字符' }
            ]}
          >
            <Input placeholder="例如：XX幼儿园2025春季" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="description"
            label="分组描述"
            rules={[{ max: 200, message: '描述最多200个字符' }]}
          >
            <Input.TextArea
              placeholder="描述该分组的用途或包含的数据集类型（可选）"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setIsCreateModalVisible(false); form.resetFields(); }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: colors.primary }}>
                创建
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== 编辑分组弹窗 ==================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EditOutlined style={{ color: colors.primary }} />
            <span>编辑分组</span>
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => { setIsEditModalVisible(false); setCurrentGroup(null); form.resetFields(); }}
        footer={null}
        width={480}
      >
        <Form form={form} layout="vertical" onFinish={handleEditGroup}>
          <Form.Item
            name="name"
            label="分组名称"
            rules={[
              { required: true, message: '请输入分组名称' },
              { max: 50, message: '分组名称最多50个字符' }
            ]}
          >
            <Input placeholder="请输入分组名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="description"
            label="分组描述"
            rules={[{ max: 200, message: '描述最多200个字符' }]}
          >
            <Input.TextArea
              placeholder="描述该分组的用途或包含的数据集类型"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setIsEditModalVisible(false); setCurrentGroup(null); form.resetFields(); }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: colors.primary }}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== 删除确认弹窗 ==================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DeleteOutlined style={{ color: colors.danger }} />
            <span>确认删除分组</span>
          </div>
        }
        open={isDeleteModalVisible}
        onOk={handleDeleteGroup}
        onCancel={() => { setIsDeleteModalVisible(false); setCurrentGroup(null); }}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        width={480}
      >
        <div style={{ padding: '8px 0' }}>
          <Text style={{ color: colors.textPrimary }}>
            确定要删除分组 <Text strong>{currentGroup?.name}</Text> 吗？
          </Text>
          {currentGroup?.datasetCount > 0 && (
            <div style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: colors.dangerLight || '#fff2f0',
              borderRadius: styles.borderRadius.md,
              border: `1px solid ${colors.danger}`
            }}>
              <Text style={{ color: colors.danger, fontSize: 13 }}>
                <strong>警告：</strong>该分组包含 {currentGroup.datasetCount} 个数据集，删除分组将同时删除这些数据集，此操作不可恢复。
              </Text>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default GroupListPage;
