import type { FC } from 'react'
import { Button, Modal, Input, Form, message } from 'antd'
import { useAtom } from 'jotai'

import { useBoolean, usePersistFn } from '@/hooks'
import { useUpdatePassword } from '@/services'
import { userAtom } from '@/atoms'

const UpdatePassword: FC = () => {
  const [visible, { toggle }] = useBoolean(false)
  const [form] = Form.useForm()
  const [user, setUser] = useAtom(userAtom)
  const { mutateAsync, isLoading, error } = useUpdatePassword()
  const handleFinish = usePersistFn(async (data) => {
    await mutateAsync({
      id: user?.id!,
      ...data,
    })
    if (!error) {
      setUser(null)
      message.success(`修改密码成功`)
    }
    form.resetFields()
    toggle(false)
  })
  const handleCancel = usePersistFn(() => {
    toggle(false)
  })

  return (
    <>
      <Button danger onClick={() => toggle(true)}>
        更改管理员密码
      </Button>
      <Modal
        title="更改管理员密码"
        visible={visible}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isLoading}
      >
        <Form
          name="basic"
          autoComplete="off"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            name="oldPassword"
            hasFeedback
            rules={[
              { required: true, message: '请输入原密码!' },
              { min: 8, message: '密码至少为 8 位字符' },
              { max: 20, message: '密码最多为 20 位字符' },
            ]}
          >
            <Input.Password placeholder="原密码" />
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
            dependencies={['oldPassword']}
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 8, message: '密码至少为 8 位字符' },
              { max: 20, message: '密码最多为 20 位字符' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('oldPassword') !== value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('新密码不能与原密码相同!'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="新密码" />
          </Form.Item>
          <Form.Item
            name="confirm"
            hasFeedback
            dependencies={['password']}
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 8, message: '密码至少为 8 位字符' },
              { max: 20, message: '密码最多为 20 位字符' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('输入的两个密码不匹配!'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="确认密码" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default UpdatePassword
