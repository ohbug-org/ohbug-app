import { FC, useState } from 'react'
import { Modal, Form, Input, Space, Tooltip, Button } from 'antd'
import {
  DingdingOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  WechatOutlined,
} from '@ant-design/icons'
import { useAtom } from 'jotai'

import { currentProjectAtom } from '@/atoms'
import type { NotificationSettingWebHook } from '@/types'
import { usePersistFn, useUpdateEffect } from '@/hooks'
import { RadioIconButton } from '@/components'
import {
  CreateSettingWebhook,
  UpdateSettingWebhook,
  useCreateSettingWebhook,
  useUpdateSettingWebhook,
} from '@/services'

import styles from './EditWebhook.module.less'

const typeList = [
  {
    label: '钉钉',
    value: 'dingtalk',
    icon: <DingdingOutlined />,
  },
  {
    label: '企业微信',
    value: 'wechat_work',
    icon: <WechatOutlined />,
  },
  {
    label: '自定义',
    value: 'others',
    icon: <RobotOutlined />,
  },
]
interface EditWebhookProps {
  visible: boolean
  onCancel: () => void
  initialValues?: NotificationSettingWebHook
}
const EditWebhook: FC<EditWebhookProps> = ({
  visible,
  onCancel,
  initialValues,
}) => {
  const [currentProject] = useAtom(currentProjectAtom)
  const { mutation: createWebhooksSettingMutation } = useCreateSettingWebhook()
  const { mutation: updateWebhooksSettingMutation } = useUpdateSettingWebhook()
  const [form] = Form.useForm()
  const [type, setType] = useState(() => (initialValues ? 'update' : 'create'))
  const confirmLoading =
    createWebhooksSettingMutation.isLoading ||
    updateWebhooksSettingMutation.isLoading

  useUpdateEffect(() => {
    setType(initialValues ? 'update' : 'create')

    if (initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [initialValues])

  const handleOk = usePersistFn(() => {
    form.submit()
  })
  const handleFinish = usePersistFn(
    (payload: CreateSettingWebhook | UpdateSettingWebhook) => {
      if (currentProject) {
        if (type === 'create') {
          const value = payload as CreateSettingWebhook
          createWebhooksSettingMutation.mutate({
            projectId: currentProject.id,
            open: true,
            ...value,
          })
        }
        if (type === 'update') {
          const value = {
            ...payload,
            projectId: currentProject.id,
            id: initialValues?.id,
          } as UpdateSettingWebhook
          updateWebhooksSettingMutation.mutate(value)
        }
        onCancel?.()
      }
    }
  )

  return (
    <Modal
      className={styles.root}
      title="编辑第三方通知"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      width={600}
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        onFinish={handleFinish}
        hideRequiredMark
      >
        <Form.Item
          name="type"
          rules={[{ required: true, message: '请选择第三方通知类型' }]}
          initialValue="dingtalk"
          noStyle
        >
          <RadioIconButton className={styles.type} dataSource={typeList} />
        </Form.Item>

        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入通知名称' },
            {
              max: 24,
              message: '通知名称最多为24个字符',
            },
          ]}
        >
          <Input maxLength={24} />
        </Form.Item>

        <Form.Item
          label="链接"
          name="link"
          rules={[
            { required: true, message: '请输入通知链接' },
            {
              type: 'url',
              message: '链接格式错误 请重新输入',
            },
          ]}
        >
          <Input maxLength={1000} />
        </Form.Item>

        <Form.List name="at">
          {(fields, operation) => (
            <Form.Item
              label={
                <Tooltip title="负责人的联系方式，多用于@对应负责人，通常为手机号。">
                  <span>
                    负责人
                    <QuestionCircleOutlined />
                  </span>
                </Tooltip>
              }
            >
              <Space direction="vertical">
                {fields.map((field: any, index: number) => (
                  <Space key={field.key}>
                    <Form.Item name={[field.name, 'value']} noStyle>
                      <Input maxLength={100} />
                    </Form.Item>
                    {fields.length > 0 ? (
                      <Button
                        onClick={() => {
                          operation.remove(field.name)
                        }}
                        icon={<MinusCircleOutlined />}
                        type="text"
                        size="small"
                      />
                    ) : null}
                    {fields.length < 3 && index === fields.length - 1 && (
                      <Button
                        onClick={() => {
                          operation.add()
                        }}
                        icon={<PlusCircleOutlined />}
                        type="text"
                        size="small"
                      />
                    )}
                  </Space>
                ))}
              </Space>
              {fields.length === 0 && (
                <Button
                  onClick={() => {
                    operation.add()
                  }}
                  icon={<PlusCircleOutlined />}
                  type="text"
                  size="small"
                />
              )}
            </Form.Item>
          )}
        </Form.List>

        <Form.Item label="参考文档" colon={false}>
          <Button
            type="link"
            href="//ohbug.net/docs/dashboard/SettingProject"
            target="_blank"
          >
            接入指引
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditWebhook
