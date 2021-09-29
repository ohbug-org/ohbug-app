import { FC, useState } from 'react'
import { Card, Space, List, Radio, Typography, Row, Col } from 'antd'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'

import { currentProjectAtom } from '@/atoms'
import { RouteComponentProps, Link } from '@/ability'
import { Layout, MiniChart, BarChart } from '@/components'
import { usePersistFn } from '@/hooks'
import { useGetIssues, useGetIssuesTrend, useGetProjectTrend } from '@/services'

import Search from './components/Search'

import styles from './issue.module.less'

const twoWeeks = [
  dayjs().subtract(13, 'day').toISOString(),
  dayjs().toISOString(),
]
const Issue: FC<RouteComponentProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1)
  // 默认取近两周
  const [range, setRange] = useState(twoWeeks)
  const [currentType, setCurrentType] = useState<'all'>('all')
  const [period, setPeriod] = useState<'24h' | '14d'>('24h')
  const [project] = useAtom(currentProjectAtom)

  const { data: issues } = useGetIssues({
    projectId: project?.id,
    page: currentPage - 1,
    start: range[0],
    end: range[1],
    type: currentType === 'all' ? undefined : currentType,
  })
  const [data, count] = issues ?? []

  const { data: projectTrend } = useGetProjectTrend(project?.id, ...range)
  const { data: issuesTrend } = useGetIssuesTrend({
    ids: data?.map((v) => v.id),
    period,
  })

  const handleTrendChange = usePersistFn((e) => {
    setPeriod(e.target.value)
  })
  const handleSearch = usePersistFn(({ page, start, end, type }) => {
    if (page) {
      setCurrentPage(page)
    }
    if (start && end) {
      setRange([start, end])
    }
    if (type) {
      setCurrentType(type)
    }
  })

  return (
    <Layout className={styles.root}>
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        {projectTrend && (
          <Card>
            <BarChart data={projectTrend.buckets} />
          </Card>
        )}

        <Card
          className={styles.card}
          title={`问题列表 ${data ? `(${data.length})` : ''}`}
          hoverable
          extra={<Search handleSearch={handleSearch} />}
        >
          <List
            className={styles.list}
            itemLayout="horizontal"
            dataSource={data}
            pagination={
              count
                ? {
                    onChange: setCurrentPage,
                    pageSize: 20,
                    current: currentPage,
                    total: count,
                  }
                : false
            }
            header={
              <div className="px-6 pt-6 font-bold flex items-center justify-between">
                <div className="flex-1">异常信息</div>
                <Row style={{ minWidth: 600 }} gutter={8}>
                  <Col span={6}>时间</Col>
                  <Col span={4}>异常数</Col>
                  <Col span={4}>影响用户数</Col>
                  <Col span={10}>
                    <span>趋势</span>
                    <span style={{ marginLeft: 4 }}>
                      <Radio.Group
                        value={period}
                        onChange={handleTrendChange}
                        size="small"
                        buttonStyle="solid"
                      >
                        <Radio.Button value="24h">当日</Radio.Button>
                        <Radio.Button value="14d">近两周</Radio.Button>
                      </Radio.Group>
                    </span>
                  </Col>
                </Row>
              </div>
            }
            renderItem={(item) => {
              const chartData = issuesTrend?.find(
                (v) => parseInt(v?.issueId, 10) === item.id
              )?.buckets

              return (
                // 获取此 issue 所对应的最新 event
                <Link to={`/issue/${item.id}/event/latest`}>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div className="leading-tight truncate">
                          <Typography.Text className="mr-4 text-base" strong>
                            {item.type}
                          </Typography.Text>
                          {item.metadata.filename && (
                            <Typography.Text type="secondary">
                              {item.metadata.filename}
                            </Typography.Text>
                          )}
                        </div>
                      }
                      description={
                        <Typography.Paragraph className="!mb-0" ellipsis>
                          {item.metadata.message && (
                            <Typography.Text>
                              {typeof item.metadata.message === 'string'
                                ? item.metadata.message
                                : JSON.stringify(item.metadata.message)}
                            </Typography.Text>
                          )}
                          {item.metadata.others && (
                            <Typography.Text>
                              {item.metadata.others}
                            </Typography.Text>
                          )}
                          {!item.metadata.message &&
                            !item.metadata.others &&
                            item.metadata.stack && (
                              <Typography.Text>
                                {typeof item.metadata.stack === 'string'
                                  ? item.metadata.stack
                                  : JSON.stringify(item.metadata.stack)}
                              </Typography.Text>
                            )}
                        </Typography.Paragraph>
                      }
                    />
                    <Row style={{ minWidth: 600 }} gutter={8}>
                      <Col className="!flex items-center" span={6}>
                        {dayjs(item.createdAt).fromNow()}-
                        {dayjs(item.updatedAt).fromNow()}
                      </Col>

                      <Col className="text-error !flex items-center" span={4}>
                        {item.eventsCount}
                      </Col>

                      <Col className="!flex items-center" span={4}>
                        {item.usersCount}
                      </Col>

                      <Col span={10}>
                        <MiniChart data={chartData} trend={period} />
                      </Col>
                    </Row>
                  </List.Item>
                </Link>
              )
            }}
          />
        </Card>
      </Space>

      {children}
    </Layout>
  )
}

export default Issue
