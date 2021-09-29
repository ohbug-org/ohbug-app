import type { FC } from 'react'
import { Row, Col, Skeleton, Typography, Card, Statistic } from 'antd'
// import clsx from 'clsx';

import { Image } from '@/components'
import { EventInAPP, Issue } from '@/types'

// interface TrendProps {
//   data: number;
// }
// const Trend: FC<TrendProps> = ({ data }) => {
//   const type = data <= 0 ? 'down' : 'up';
//   const classes = clsx('w-12 h-12 font-semibold text-sm leading-10 text-center rounded-md', {
//     'text-primary bg-primary bg-opacity-60': type === 'up',
//     'text-success bg-primary bg-opacity-20 text-success bg-green-100: type === 'down',
//   });
//   const value = `${type === 'up' ? '+' : ''}${data * 100}%`;
//   return <div className={classes}>{value}</div>;
// };

interface TitleProps {
  event?: EventInAPP<any>
  issue?: Issue
}
const Title: FC<TitleProps> = ({ event, issue }) => {
  const leftLoading = !event
  const rightLoading = !issue
  return (
    <Row gutter={24}>
      <Col xs={24} sm={24} md={18}>
        <div className="relative w-full h-48 rounded-md bg-primary">
          <Skeleton loading={leftLoading}>
            <Typography
              className="absolute top-0 z-20 w-5/12 h-full text-white flex flex-col justify-center"
              style={{ left: '6%' }}
            >
              <Typography.Title>{event?.type}</Typography.Title>
              {event?.detail?.message && (
                <Typography.Text ellipsis strong style={{ fontSize: 16 }}>
                  {typeof event.detail.message === 'string'
                    ? event.detail.message
                    : JSON.stringify(event.detail.message)}
                </Typography.Text>
              )}
              {event?.detail?.filename && (
                <Typography.Paragraph ellipsis strong style={{ fontSize: 16 }}>
                  {event.detail.filename}
                </Typography.Paragraph>
              )}
            </Typography>
            <Image
              className="absolute bottom-0 z-10 w-3/12 max-w-md"
              style={{ right: '12%' }}
              src="/images/issue_title_figure.svg"
              alt="issue_title_figure"
            />
          </Skeleton>
        </div>
      </Col>

      <Col
        className="!flex flex-col items-center justify-between"
        xs={24}
        sm={24}
        md={6}
      >
        <Skeleton loading={rightLoading}>
          <Card size="small" style={{ width: '100%' }}>
            <div className="p-0 flex items-center justify-between">
              <Statistic title="EVENTS" value={issue?.eventsCount} />
              {/* <Trend data={0.15} /> */}
            </div>
          </Card>
        </Skeleton>
        <Skeleton loading={rightLoading}>
          <Card size="small" style={{ width: '100%' }}>
            <div className="p-0 flex items-center justify-between">
              <Statistic title="USERS" value={issue?.usersCount} />
              {/* <Trend data={-0.04} /> */}
            </div>
          </Card>
        </Skeleton>
      </Col>
    </Row>
  )
}

export default Title
