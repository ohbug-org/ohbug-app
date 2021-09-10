import type { FC } from 'react'
import { Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { Layout } from '@/components'
import { RouteComponentProps, navigate, useModelState } from '@/ability'

import ProjectCard from './Components/ProjectCard'

import styles from './overview.module.less'

function handleToCreateProject() {
  navigate('/create-project')
}

const Overview: FC<RouteComponentProps> = () => {
  const projects = useModelState((state) => state.project.data)
  const project = useModelState((state) => state.project.current)

  if (projects) {
    return (
      <Layout className={styles.root}>
        <div className={styles.head}>
          <Typography.Title level={5}>项目总览</Typography.Title>
          <Button
            className="text-secondary"
            icon={<PlusOutlined />}
            type="text"
            onClick={handleToCreateProject}
          >
            创建项目
          </Button>
        </div>
        <div className={styles.projects}>
          {projects.map((v) => (
            <ProjectCard project={v} active={v.id === project?.id} key={v.id} />
          ))}
        </div>
      </Layout>
    )
  }
  return null
}

export default Overview
