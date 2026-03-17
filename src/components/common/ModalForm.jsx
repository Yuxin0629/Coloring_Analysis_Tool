import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { colors, styles as stylesConfig } from './constants';

const { Option } = Select;

// 通用表单弹窗组件
const ModalForm = ({
  visible,
  title,
  onCancel,
  onFinish,
  initialValues = {},
  type // group:分组表单 / dataset:数据集表单
}) => {
  const [form] = Form.useForm();

  // 重置表单
  React.useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, initialValues]);

  // 提交表单
  const handleFinish = (values) => {
    onFinish(values);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      maskClosable={false}
      style={{ borderRadius: stylesConfig.borderRadius.md }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        {/* 分组表单：仅名称 */}
        {type === 'group' && (
          <Form.Item
            name="name"
            label="分组名称"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input 
              placeholder="例如：小花幼儿园" 
              style={{ borderRadius: stylesConfig.borderRadius.md }}
            />
          </Form.Item>
        )}

        {/* 数据集表单：名称+描述+场景 */}
        {type === 'dataset' && (
          <>
            <Form.Item
              name="name"
              label="数据集名称"
              rules={[{ required: true, message: '请输入数据集名称' }]}
            >
              <Input 
                placeholder="例如：桃花大班" 
                style={{ borderRadius: stylesConfig.borderRadius.md }}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="数据集描述"
              rules={[{ required: true, message: '请输入数据集描述' }]}
            >
              <Input.TextArea
                placeholder="简要说明数据集内容、来源或用途"
                rows={3}
                style={{ borderRadius: stylesConfig.borderRadius.md }}
              />
            </Form.Item>
            <Form.Item
              name="scene"
              label="所属场景"
              rules={[{ required: true, message: '请选择所属场景' }]}
            >
              <Select
                placeholder="请选择场景"
                style={{ borderRadius: stylesConfig.borderRadius.md, width: '100%' }}
              >
                <Option value="child-development">儿童发展评估</Option>
                <Option value="education-research">教育研究</Option>
                <Option value="fine-control">精细控制能力评估</Option>
              </Select>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ModalForm;