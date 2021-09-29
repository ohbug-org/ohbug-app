import { FC, Suspense } from 'react'
import { Typography, Button, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useAtom } from 'jotai'

import { currentProjectAtom, projectsAtom } from '@/atoms'
import { Layout } from '@/components'
import { RouteComponentProps, navigate } from '@/ability'

import ProjectCard from './Components/ProjectCard'

function handleToCreateProject() {
  navigate('/create-project')
}

const Overview: FC<RouteComponentProps> = () => {
  const [projects] = useAtom(projectsAtom)
  const [project] = useAtom(currentProjectAtom)

  if (projects) {
    return (
      <Layout>
        <div className="pb-6 flex justify-between">
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
        <div className="grid grid-cols-2">
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
