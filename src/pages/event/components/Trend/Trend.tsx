import { FC, useEffect } from 'react'
import { Card, Typography } from 'antd'
import dayjs from 'dayjs'

import { useModelEffect } from '@/ability'
import type { IssueState } from '@/models'
import { MiniChart } from '@/components'
import { useCreation } from '@/hooks'

import styles from './Trend.module.less'

interface TrendProps {
  issue: IssueState['current']
}
const Trend: FC<TrendProps> = ({ issue }) => {
  const {
    data,
    loading,
    run: getCurrentTrend,
  } = useModelEffect((dispatch) => dispatch.issue.getCurrentTrend, {
    manual: true,
  })

  useEffect(() => {
    if (issue) {
      const ids = [issue.id]
      getCurrentTrend({ ids, period: 'all' })
    }
    // eslint-disable-next-line
  }, [issue])

  const data14d = useCreation(() => data?.current?.['14d']?.buckets, [data])
  const data24h = useCreation(() => data?.current?.['24h']?.buckets, [data])

  return (
    <div className={styles.root}>
      <Card className={styles.card} loading={loading}>
        {data14d && <MiniChart data={data14d} trend="14d" title="过去14天" />}
      </Card>
      <Card className={styles.card} loading={loading}>
        {data24h && <MiniChart data={data24h} trend="24h" title="过去24小时" />}
      </Card>

      <Card className={styles.card}>
        <Typography.Title level={5}>首次发生</Typography.Title>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.createdAt).fromNow()}
          </Typography.Text>
        </div>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.createdAt).format(`YYYY-MM-DD HH:mm:ss A`)}
          </Typography.Text>
        </div>
      </Card>
      <Card className={styles.card}>
        <Typography.Title level={5}>最近发生</Typography.Title>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.updatedAt).fromNow()}
          </Typography.Text>
        </div>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.updatedAt).format(`YYYY-MM-DD HH:mm:ss A`)}
          </Typography.Text>
        </div>
      </Card>
    </div>
  )
}

export default Trend
