import type { FC, ReactNode } from 'react'
import { Card, Typography } from 'antd'
import clsx from 'clsx'

import { useCreation } from '@/hooks'

import styles from './ProgressCard.module.less'

interface ProgressCardProps {
  icon?: ReactNode
  title: string
  description: string
  percent?: number
}
const ProgressCard: FC<ProgressCardProps> = ({
  icon,
  title,
  description,
  percent,
}) => {
  const progressStyles = useCreation(
    () =>
      clsx(
        styles.progress,
        'relative float-right h-full text-sm flex items-center justify-center text-black bg-gray-300',
        {
          'text-white': percent && percent >= 60,
        }
      ),
    [percent]
  )

  return (
    <Card className={styles.root}>
      <div className={styles.container}>
        <div className="flex flex-col justify-around float-left h-full px-5 py-1">
          {icon && <div>{icon}</div>}
          <Typography.Title className="!m-0" level={5}>
            {title}
          </Typography.Title>
          <Typography.Text className="text-xs" type="secondary">
            {description}
          </Typography.Text>
        </div>

        {percent && (
          <div className={progressStyles}>
            <div
              className="absolute bottom-0 z-10 w-full bg-primary"
              style={{ height: `${percent}%` }}
            />
            <span className="z-20">{percent}%</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProgressCard
