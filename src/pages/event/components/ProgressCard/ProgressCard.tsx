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
      clsx(styles.progress, {
        [styles.white]: percent && percent >= 60,
      }),
    [percent]
  )

  return (
    <Card className={styles.root}>
      <div className={styles.container}>
        <div className={styles.content}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <Typography.Title className={styles.title} level={4}>
            {title}
          </Typography.Title>
          <Typography.Text className={styles.description} type="secondary">
            {description}
          </Typography.Text>
        </div>

        {percent && (
          <div className={progressStyles}>
            <div className={styles.line} style={{ height: `${percent}%` }} />
            <span className={styles.number}>{percent}%</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProgressCard
