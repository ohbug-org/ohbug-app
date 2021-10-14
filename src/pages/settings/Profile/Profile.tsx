import { FC } from 'react'
import { Collapse, Typography, Space, Button } from 'antd'
import { useAtom } from 'jotai'

import { currentProjectAtom, userAtom } from '@/atoms'
import { Zone } from '@/components'
import { navigate } from '@/ability'

import UpdatePassword from './UpdatePassword'

const Profile: FC = () => {
  const [currentProject] = useAtom(currentProjectAtom)
  const [, setUser] = useAtom(userAtom)

  return (
    <section>
      <Zone title="Project Profile">
        <Collapse defaultActiveKey={['name', 'type']}>
          <Collapse.Panel header="项目名称" key="name">
            <Typography.Text copyable ellipsis>
              {currentProject?.name}
            </Typography.Text>
          </Collapse.Panel>
          <Collapse.Panel header="项目类型" key="type">
            <Typography.Text>{currentProject?.type}</Typography.Text>
          </Collapse.Panel>
          <Collapse.Panel header="ApiKey" key="apiKey">
            <Typography.Text copyable ellipsis>
              {currentProject?.apiKey}
            </Typography.Text>
          </Collapse.Panel>
        </Collapse>
      </Zone>

      <Zone title="User Profile">
        <Space direction="vertical">
          <UpdatePassword />

          <Button
            ghost
            onClick={() => {
              setUser(null)
              navigate('/')
            }}
          >
            退出登录
          </Button>
        </Space>
      </Zone>
    </section>
  )
}

export default Profile
