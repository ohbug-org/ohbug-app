import type { FC } from 'react'
import { Card, Descriptions, Timeline, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { WarningOutlined } from '@ant-design/icons'

import type { EventInAPP } from '@/types'

import StackInfo from '../StackInfo'
import { getMessageAndIconByActionType } from './core'

interface DetailProps {
  event?: EventInAPP<any>
}
const Detail: FC<DetailProps> = ({ event }) => {
  return (
    <div>
      {/* all */}
      {event?.detail.message && (
        <Card className="!mb-3" title="错误信息">
          {typeof event.detail.message === 'string'
            ? event.detail.message
            : JSON.stringify(event.detail.message)}
        </Card>
      )}
      {/* unhandledrejectionError */}
      {/* uncaughtError */}
      {event?.detail.stack && (
        <Card className="!mb-3" title="堆栈信息">
          <StackInfo stack={event.detail.stack} source={event?.source} />
        </Card>
      )}
      {/* resourceError */}
      {event?.detail.selector && (
        <Card className="!mb-3">
          <Descriptions title="DOM 信息" column={1} size="small" bordered>
            <Descriptions.Item label="HTML">
              {event.detail.outerHTML}
            </Descriptions.Item>
            <Descriptions.Item label="selector">
              {event.detail.selector}
            </Descriptions.Item>
            <Descriptions.Item label="nodeType">
              {event.detail.nodeType}
            </Descriptions.Item>
            <Descriptions.Item label="tagName">
              {event.detail.tagName}
            </Descriptions.Item>
            <Descriptions.Item label="id">{event.detail.id}</Descriptions.Item>
            <Descriptions.Item label="className">
              {event.detail.className}
            </Descriptions.Item>
            <Descriptions.Item label="name">
              {event.detail.name}
            </Descriptions.Item>
            <Descriptions.Item label="src">
              {event.detail.src}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
      {/* ajaxError */}
      {/* fetchError */}
      {event?.type === 'ajaxError' && (
        <Card className="!mb-3">
          <Descriptions title="HTTP 信息" column={1} size="small" bordered>
            <Descriptions.Item label="method">
              {event.detail.req.method}
            </Descriptions.Item>
            <Descriptions.Item label="url">
              {event.detail.req.url}
            </Descriptions.Item>
            <Descriptions.Item label="data">
              {JSON.stringify(event.detail.req.data)}
            </Descriptions.Item>

            <Descriptions.Item label="status">
              {event.detail.res.status}
            </Descriptions.Item>
            <Descriptions.Item label="statusText">
              {event.detail.res.statusText}
            </Descriptions.Item>
            <Descriptions.Item label="response">
              {event.detail.res.response}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
      {/* websocketError */}
      {event?.type === 'websocketError' && (
        <Card className="!mb-3">
          <Descriptions title="WebSocket 信息" column={1} size="small" bordered>
            <Descriptions.Item label="url">
              {event.detail.url}
            </Descriptions.Item>
            <Descriptions.Item label="timeStamp">
              {event.detail.timeStamp}
            </Descriptions.Item>
            <Descriptions.Item label="readyState">
              {event.detail.readyState}
            </Descriptions.Item>
            <Descriptions.Item label="protocol">
              {event.detail.protocol}
            </Descriptions.Item>
            <Descriptions.Item label="extensions">
              {event.detail.extensions}
            </Descriptions.Item>
            <Descriptions.Item label="binaryType">
              {event.detail.binaryType}
            </Descriptions.Item>
            <Descriptions.Item label="bufferedAmount">
              {event.detail.bufferedAmount}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* actions */}
      <Card className="!mb-3" title="Actions 信息">
        <Timeline className="overflow-auto pt-1" style={{ maxHeight: 400 }}>
          {event?.actions?.map((action) => {
            const { message, icon } = getMessageAndIconByActionType(action)
            return (
              <Timeline.Item key={action.timestamp + action.data} dot={icon}>
                <div className="flex justify-between">
                  <div className="font-bold" style={{ width: 106 }}>
                    {action.type}
                  </div>
                  <div className="flex-1 text-secondary">{message}</div>
                  <Tooltip
                    title={dayjs(event.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                  >
                    <div className="w-20 text-secondary">
                      {dayjs(event.timestamp).format('HH:mm:ss')}
                    </div>
                  </Tooltip>
                </div>
              </Timeline.Item>
            )
          })}
          {event && (
            <Timeline.Item dot={<WarningOutlined />} color="red">
              <div className="flex justify-between">
                <div className="font-bold" style={{ width: 106 }}>
                  exception
                </div>
                <div className="flex-1 text-secondary">
                  {typeof event.detail.message === 'string'
                    ? event.detail.message
                    : JSON.stringify(event.detail.message)}
                </div>
                <Tooltip
                  title={dayjs(event.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                >
                  <div className="w-20 text-secondary">
                    {dayjs(event.timestamp).format('HH:mm:ss')}
                  </div>
                </Tooltip>
              </div>
            </Timeline.Item>
          )}
        </Timeline>
      </Card>
    </div>
  )
}

export default Detail
