import { FC, Suspense } from 'react'
import { Typography, Button, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRecoilValue } from 'recoil'

import { currentProjectState, projectsState } from '@/states'
import { Layout } from '@/components'
import { RouteComponentProps, navigate } from '@/ability'

import ProjectCard from './Components/ProjectCard'

import styles from './overview.module.less'

function handleToCreateProject() {
  navigate('/create-project')
}

const Overview: FC<RouteComponentProps> = () => {
  const projects = useRecoilValue(projectsState)
  const project = useRecoilValue(currentProjectState)

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
            <Suspense key={v.id} fallback={<Spin />}>
              <ProjectCard project={v} active={v.id === project?.id} />
            </Suspense>
          ))}
        </div>
      </Layout>
    )
  }
  return null
}

export default Overview
