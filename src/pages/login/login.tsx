import type { FC } from 'react'
import { Card, Typography, Form, Input, Button } from 'antd'
import { useAtom } from 'jotai'

import { RouteComponentProps, Redirect } from '@/ability'
import { Layout, Image } from '@/components'
import { usePersistFn } from '@/hooks'
import { useGetUser, useLogin } from '@/services'
import { userAtom } from '@/atoms'

const Login: FC<RouteComponentProps> = () => {
  const { mutateAsync, data, isLoading: loginLoading } = useLogin()
  const { refetch, isLoading: getLoading } = useGetUser(data?.id!)
  const [user] = useAtom(userAtom)
  const onFinish = usePersistFn(async (values) => {
    await mutateAsync(values)
    if (data) {
      await refetch()
    }
  })

  if (user) {
    return <Redirect to="/" />
  }

  return (
    <Layout className="flex justify-center items-center">
      <Card className="w-80 !-mt-20">
        <a
          className="mt-2 mb-10 flex flex-col items-center"
          href="https://ohbug.net"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="w-2/3 mx-auto mb-3"
            src="/logo-white.svg"
            alt="LOGO"
          />
          <Typography.Text type="secondary">
            开源应用信息监控平台
          </Typography.Text>
        </a>

        <Form name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="name"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 4, message: '用户名至少为 4 位字符' },
              { max: 12, message: '用户名最多为 12 位字符' },
            ]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            hasFeedback
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 8, message: '密码至少为 8 位字符' },
              { max: 20, message: '密码最多为 20 位字符' },
            ]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginLoading || getLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  )
}

export default Login
