import { FC } from 'react'
import { Collapse, Typography } from 'antd'
import { useAtom } from 'jotai'

import { currentProjectAtom } from '@/atoms'
import { Zone } from '@/components'

const Profile: FC = () => {
  const [currentProject] = useAtom(currentProjectAtom)

  return (
    <section>
      <Zone title="Profile">
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
    </section>
  )
}

export default Profile
