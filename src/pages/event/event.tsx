import { FC, useEffect } from 'react'
import { Row, Col, Tabs, Radio } from 'antd'
import ReactJson from 'react-json-view'

import {
  RouteComponentProps,
  navigate,
  useParams,
  useModelEffect,
} from '@/ability'
import { Layout } from '@/components'
import type { EventState, IssueState } from '@/models'
import { useCreation, usePersistFn } from '@/hooks'

import Title from './components/Title'
import Profile from './components/Profile'
import Detail from './components/Detail'
import Trend from './components/Trend'
import ExtensionUI from './components/ExtensionUI'

interface EventTabProps {
  event: EventState['current']
  issue: IssueState['current']
}
const EventTab: FC<EventTabProps> = ({ event, issue }) => {
  const tabList = useCreation(() => {
    const base = [
      {
        key: 'detail',
        tab: 'detail',
        disabled: false,
        element: (
          <Row gutter={24}>
            <Col xs={24} sm={24} md={6}>
              <Trend issue={issue} />
            </Col>
            <Col xs={24} sm={24} md={18}>
              <Profile event={event} />
              <Detail event={event} />
            </Col>
          </Row>
        ),
      },
    ]
    if (event?.metaData) {
      Object.keys(event.metaData).forEach((key) => {
        base.push({
          key,
          tab: key,
          disabled: false,
          element: (
            <ExtensionUI
              extensionKey={key}
              data={event.metaData[key]}
              event={event}
            />
          ),
        })
      })
    }
    if (event?.user) {
      base.splice(1, 0, {
        key: 'user',
        tab: 'user',
        disabled: false,
        element: (
          <ReactJson
            src={event.user!}
            iconStyle="circle"
            collapsed={2}
            style={{
              fontFamily:
                'JetBrains Mono, -apple-system, BlinkMacSystemFont, monospace, Roboto',
              background: 'none',
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
          />
        ),
      })
    }
    return base
  }, [event, issue])
  const handlePreviousClick = usePersistFn(() => {
    if (event?.previous)
      navigate(`/issue/${issue?.id}/event/${event?.previous?.id}`)
  })
  const handleNextClick = usePersistFn(() => {
    if (event?.next) navigate(`/issue/${issue?.id}/event/${event?.next?.id}`)
  })

  return (
    <Tabs
      tabBarExtraContent={
        <Radio.Group size="small">
          <Radio.Button
            disabled={!event?.previous}
            onClick={handlePreviousClick}
          >
            {'< Older'}
          </Radio.Button>
          <Radio.Button disabled={!event?.next} onClick={handleNextClick}>
            {'Newer >'}
          </Radio.Button>
        </Radio.Group>
      }
    >
      {tabList.map((tab) => (
        <Tabs.TabPane tab={tab.tab} key={tab.key}>
          {tab.element}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}

const Event: FC<RouteComponentProps> = () => {
  const { data: lastEvent, run: getLatestEvent } = useModelEffect(
    (dispatch) => dispatch.event.getLatestEvent,
    {
      manual: true,
    }
  )
  const { data: event, run: getEvent } = useModelEffect(
    (dispatch) => dispatch.event.get,
    {
      manual: true,
    }
  )
  const { data: issue, run: getIssue } = useModelEffect(
    (dispatch) => dispatch.issue.get,
    {
      manual: true,
    }
  )
  const { issueId, eventId } = useParams()

  useEffect(() => {
    if (eventId === 'latest' && issueId) {
      getLatestEvent({ issueId })
    } else {
      getEvent({
        eventId,
        issueId,
      })
    }
    getIssue({ issueId })
    // eslint-disable-next-line
  }, [eventId, issueId])

  return (
    <Layout>
      {/* 标题信息 */}
      <Title event={lastEvent || event} issue={issue} />

      {/* tab */}
      <EventTab event={lastEvent || event} issue={issue} />
    </Layout>
  )
}

export default Event
