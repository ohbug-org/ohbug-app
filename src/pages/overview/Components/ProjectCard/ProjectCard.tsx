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
      className={clsx(styles.root, 'hover:bg-green-900', {
        '!bg-green-900': active,
      })}
      hoverable
      title={
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              className="!w-8 mr-4"
              src="/images/js.platform.png"
              preview={false}
            />
            <span className="uppercase font-semibold">{project.name}</span>
          </div>
        </div>
      }
      onClick={handleToIssue}
    >
      <div className="mt-4 px-6 py-12">
        <MiniChart trend="14d" data={data?.buckets} />
      </div>
    </Card>
  )
}

export default ProjectCard
