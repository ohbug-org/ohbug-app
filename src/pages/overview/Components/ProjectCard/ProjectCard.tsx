import type { FC } from 'react'
import { Card, Image } from 'antd'
import clsx from 'clsx'
import { useAtom } from 'jotai'

import type { Project } from '@/types'
import { usePersistFn } from '@/hooks'
import { navigate } from '@/ability'
import { MiniChart } from '@/components'
import { useGetProjectTrend } from '@/services'
import { currentProjectAtom } from '@/atoms'

import styles from './ProjectCard.module.less'

interface ProjectCardProps {
  project: Project
  active?: boolean
}

const ProjectCard: FC<ProjectCardProps> = ({ project, active }) => {
  const { data } = useGetProjectTrend(project.id!)

  const [, setCurrentProjectState] = useAtom(currentProjectAtom)
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
            <span className="uppercase font-semibold">{project.name}</span>
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
