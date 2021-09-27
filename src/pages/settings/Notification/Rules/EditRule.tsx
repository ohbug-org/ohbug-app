import { FC, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Tag,
  Space,
  Tooltip,
  Button,
} from 'antd'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { types } from '@ohbug/core'
import { useAtom } from 'jotai'

import { currentProjectAtom } from '@/atoms'
import type { NotificationRule, NotificationRuleLevel } from '@/types'
import { usePersistFn, useUpdateEffect } from '@/hooks'
import {
  CreateRule,
  UpdateRule,
  useCreateRule,
  useUpdateRule,
} from '@/services'

import { levelList, intervalList } from './Rules.core'

interface LevelComponentProps {
  value?: NotificationRuleLevel
  onChange?: (key: NotificationRuleLevel) => void
}
const LevelComponent: FC<LevelComponentProps> = ({ value, onChange }) => {
  const handleChange = usePersistFn((tag, checked) => {
    if (checked) onChange?.(tag)
  })
  return (
    <>
      {levelList.map((item) => (
        <Tag.CheckableTag
          checked={value === item.value}
          onChange={(checked) => handleChange(item.value, checked)}
          key={item.value}
        >
          {item.label}
        </Tag.CheckableTag>
      ))}
    </>
  )
}
interface EditRuleProps {
  visible: boolean
  onCancel: () => void
  initialValues?: NotificationRule
}
function getRuleDataType(
  rule?: NotificationRule
): 'indicator' | 'range' | undefined {
  if (rule) {
    if (
      Object.prototype.hasOwnProperty.call(rule.data, 'interval') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'percentage')
    ) {
      return 'indicator'
    }
    if (
      Object.prototype.hasOwnProperty.call(rule.data, 'range1') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'range2') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'range3') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'range4')
    ) {
      return 'range'
    }
  }
  return undefined
}
const EditRule: FC<EditRuleProps> = ({ visible, onCancel, initialValues }) => {
  const [currentProject] = useAtom(currentProjectAtom)
  const { mutation: createRuleMutation } = useCreateRule()
  const { mutation: updateRuleMutation } = useUpdateRule()
  const [form] = Form.useForm<CreateRule>()
  const [data, setData] = useState<'indicator' | 'range'>(
    getRuleDataType(initialValues) || 'range'
  )
  const [type, setType] = useState(() => (initialValues ? 'update' : 'create'))

  useUpdateEffect(() => {
    setData(getRuleDataType(initialValues) || 'range')
    setType(initialValues ? 'update' : 'create')

    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        data: initialValues.data,
        whiteList: initialValues.whiteList || [],
        blackList: initialValues.blackList || [],
        level: initialValues.level,
        interval: initialValues.interval,
        open: initialValues.open,
      })
    } else {
      form.resetFields()
    }
  }, [initialValues])

  const handleOk = usePersistFn(() => {
    form.submit()
  })
  const handleFinish = usePersistFn((payload: CreateRule | UpdateRule) => {
    if (currentProject) {
      if (type === 'create') {
        const value = payload as CreateRule
        createRuleMutation.mutate({
          projectId: currentProject.id,
          ...value,
        })
      }
      if (type === 'update') {
        const value = payload as UpdateRule
        value.ruleId = initialValues?.id!
        updateRuleMutation.mutate({
          projectId: currentProject.id,
          ...value,
        })
      }
      onCancel?.()
    }
  })

  return (
    <Modal
      title="编辑通知规则"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={createRuleMutation.isLoading}
      width={750}
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
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入通知名称' },
            {
              max: 24,
              message: '通知规则名称最多为24个字符',
            },
          ]}
        >
          <Input maxLength={24} />
        </Form.Item>

        <Form.Item
          label={
            <Select value={data} onChange={setData} bordered={false}>
              <Select.Option value="indicator" disabled>
                指标
              </Select.Option>
              <Select.Option value="range">区间</Select.Option>
            </Select>
          }
          rules={[{ required: true, message: '请填写匹配规则' }]}
        >
          {data === 'indicator' && (
            <div>
              <span>
                近{' '}
                <Form.Item
                  name={['data', 'interval']}
                  initialValue={180000}
                  noStyle
                >
                  <Select disabled style={{ width: 80 }}>
                    <Select.Option value={180000}>3分钟</Select.Option>
                  </Select>
                </Form.Item>{' '}
                增长率超过{' '}
              </span>
              <Form.Item
                name={['data', 'percentage']}
                rules={[{ required: true, message: '请填写指标' }]}
                initialValue={30}
                noStyle
              >
                <InputNumber min={1} max={100} />
              </Form.Item>
              <span> %</span>
            </div>
          )}
          {data === 'range' && (
            <Space>
              <Form.Item
                name={['data', 'range1']}
                rules={[{ required: true, message: '请填写事件区间1' }]}
                initialValue={1000}
                noStyle
              >
                <InputNumber min={1} max={999999} />
              </Form.Item>
              <Form.Item
                name={['data', 'range2']}
                rules={[{ required: true, message: '请填写事件区间2' }]}
                initialValue={2000}
                noStyle
              >
                <InputNumber min={1} max={999999} />
              </Form.Item>
              <Form.Item
                name={['data', 'range3']}
                rules={[{ required: true, message: '请填写事件区间3' }]}
                initialValue={5000}
                noStyle
              >
                <InputNumber min={1} max={999999} />
              </Form.Item>
              <Form.Item
                name={['data', 'range4']}
                rules={[{ required: true, message: '请填写事件区间4' }]}
                initialValue={10000}
                noStyle
              >
                <InputNumber min={1} max={999999} />
              </Form.Item>
            </Space>
          )}
        </Form.Item>

        {[
          {
            name: 'whiteList',
            label: (
              <Tooltip title="若在白名单则不论是否符合区间内的数量匹配直接触发通知任务">
                <span>白名单</span>
              </Tooltip>
            ),
          },
          {
            name: 'blackList',
            label: (
              <Tooltip title="若在黑名单则不论是否符合区间内的数量匹配直接不触发通知任务">
                <span>黑名单</span>
              </Tooltip>
            ),
          },
        ].map((item) => (
          <Form.List name={item.name} key={item.name}>
            {(fields, operation) => (
              <Form.Item label={item.label}>
                <Space direction="vertical">
                  {fields.map((field: any, index: number) => (
                    <Space key={field.key} align="center">
                      <Form.Item name={[field.name, 'message']} noStyle>
                        <Input
                          placeholder="message..."
                          maxLength={120}
                          addonBefore={
                            <Form.Item
                              name={[field.name, 'type']}
                              initialValue="uncaughtError"
                              noStyle
                            >
                              <Select dropdownMatchSelectWidth={false}>
                                {Object.values(types).map((t: any) => (
                                  <Select.Option value={t} key={t}>
                                    {t}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          }
                        />
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
        ))}

        <Form.Item label="级别" name="level" initialValue="default">
          <LevelComponent />
        </Form.Item>

        <Form.Item
          label="静默期"
          name="interval"
          initialValue={1800000}
          rules={[{ required: true, message: '请选择静默期' }]}
        >
          <Select>
            {intervalList.map((item) => (
              <Select.Option value={item.value} key={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditRule
