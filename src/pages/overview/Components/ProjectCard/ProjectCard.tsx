import type { FC } from 'react'
import { Card, Image } from 'antd'
import clsx from 'clsx'
import { useSetRecoilState } from 'recoil'

import type { Project } from '@/types'
import { usePersistFn } from '@/hooks'
import { navigate } from '@/ability'
import { MiniChart } from '@/components'
import { useGetProjectTrend } from '@/services'
import { currentProjectState } from '@/states'

import styles from './ProjectCard.module.less'

interface ProjectCardProps {
  project: Project
  active?: boolean
}

const ProjectCard: FC<ProjectCardProps> = ({ project, active }) => {
  const { data } = useGetProjectTrend(project.id!)

  const setCurrentProjectState = useSetRecoilState(currentProjectState)
  const handleToIssue = usePersistFn(() => {
    setCurrentProjectState(project)
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
        <MiniChart trend="14d" data={data.buckets} />
      </div>
    </Card>
  )
}

export default ProjectCard
