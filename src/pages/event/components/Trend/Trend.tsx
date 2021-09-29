import type { FC } from 'react'
import { Card, Typography } from 'antd'
import dayjs from 'dayjs'

import type { Issue } from '@/types'
import { MiniChart } from '@/components'
import { useCreation } from '@/hooks'
import { useGetIssuesTrend } from '@/services'

interface TrendProps {
  issue?: Issue
}
const Trend: FC<TrendProps> = ({ issue }) => {
  const { data } = useGetIssuesTrend({
    ids: issue ? [issue.id] : [],
    period: 'all',
  })
  const result = data?.[0]

  const data14d = useCreation(() => result?.['14d']?.buckets, [data])
  const data24h = useCreation(() => result?.['24h']?.buckets, [data])

  return (
    <div>
      <Card className="!mb-4">
        {data14d && <MiniChart data={data14d} trend="14d" title="过去14天" />}
      </Card>
      <Card className="!mb-4">
        {data24h && <MiniChart data={data24h} trend="24h" title="过去24小时" />}
      </Card>

      <Card className="!mb-4">
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
      <Card className="!mb-4">
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
