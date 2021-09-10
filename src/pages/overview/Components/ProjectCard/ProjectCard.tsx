import type { FC } from 'react'
import dayjs from 'dayjs'
import { Card, Image } from 'antd'
import clsx from 'clsx'

import type { Project } from '@/types'
import { useRequest, usePersistFn } from '@/hooks'
import { navigate, useModelDispatch } from '@/ability'
import * as api from '@/api'
import { MiniChart } from '@/components'

import styles from './ProjectCard.module.less'

interface ProjectCardProps {
  project: Project
  active?: boolean
}

function getTrend(projectId: number) {
  const start = dayjs().subtract(13, 'day').toISOString() as unknown as Date
  const end = dayjs().toISOString() as unknown as Date
  return () =>
    api.project.trend.call({
      projectId,
      start,
      end,
    })
}

const ProjectCard: FC<ProjectCardProps> = ({ project, active }) => {
  const { data, loading } = useRequest(getTrend(project.id!), {
    initialData: { buckets: [] },
  })

  const setCurrentProject = useModelDispatch(
    (dispatch) => dispatch.project.setCurrentProject
  )
  const handleToIssue = usePersistFn(() => {
    setCurrentProject(project.id!)
    navigate(`/issue`)
  })

  return (
    <Card
      className={clsx(styles.root, {
        [styles.active]: active,
      })}
      hoverable
      title={
        <div className={styles.title}>
          <div className="flex items-center">
            <Image
              className="!w-8 mr-3"
              src="/images/js.platform.png"
              preview={false}
            />
            <span>{project.name}</span>
          </div>
        </div>
      }
      onClick={handleToIssue}
    >
      <div className={styles.wrapper}>
        <MiniChart trend="14d" loading={loading} data={data.buckets} />
      </div>
    </Card>
  )
}

export default ProjectCard
