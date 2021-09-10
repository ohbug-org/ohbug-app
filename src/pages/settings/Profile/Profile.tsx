import { FC } from 'react'
import { Collapse, Typography } from 'antd'

import { Zone } from '@/components'
import { useModelState } from '@/ability'

import styles from './Profile.module.less'

const Profile: FC = () => {
  const currentProject = useModelState((state) => state.project.current)

  return (
    <section className={styles.root}>
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
