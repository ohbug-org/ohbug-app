import type { ReactNode } from 'react'
import type { OhbugAction } from '@ohbug/types'
import { Typography } from 'antd'
import {
  BulbOutlined,
  CodeOutlined,
  PaperClipOutlined,
  SendOutlined,
} from '@ant-design/icons'

export function getMessageAndIconByActionType(action: OhbugAction): {
  message: ReactNode
  icon: ReactNode
} {
  const status = action.data?.res?.status
  switch (action.type) {
    case 'click':
      if (action.data?.selector) {
        return {
          message: action.data?.selector,
          icon: <BulbOutlined />,
        }
      }
      return {
        message: (
          <Typography>
            <Typography.Text>{action.message}</Typography.Text>{' '}
            <Typography.Text type="secondary">{action.data}</Typography.Text>
          </Typography>
        ),
        icon: <BulbOutlined />,
      }
    case 'navigation':
      return {
        message: (
          <>
            <strong>From:</strong> <em>{action.data?.from}</em>{' '}
            <strong>To:</strong> <em>{action.data?.to}</em>
          </>
        ),
        icon: <PaperClipOutlined />,
      }
    case 'ajax':
      return {
        message: (
          <>
            <strong>{action.data?.req?.method}</strong>{' '}
            <em>{action.data?.req?.url}</em>{' '}
            <strong>[{action.data?.res?.status}]</strong>
          </>
        ),
        icon: (
          <SendOutlined
            style={{
              // eslint-disable-next-line no-nested-ternary
              color: status > 400 ? 'red' : status <= 200 ? 'green' : 'grey',
            }}
          />
        ),
      }
    case 'fetch':
      return {
        message: (
          <>
            <strong>{action.data?.req?.method}</strong>{' '}
            <em>{action.data?.req?.url}</em>{' '}
            <strong>[{action.data?.res?.status}]</strong>
          </>
        ),
        icon: (
          <SendOutlined
            style={{
              // eslint-disable-next-line no-nested-ternary
              color: status > 400 ? 'red' : status <= 200 ? 'green' : 'grey',
            }}
          />
        ),
      }
    case 'console':
      return {
        message: `[${action.message}] ${JSON.stringify(action.data)}`,
        icon: <CodeOutlined />,
      }
    default:
      return {
        message: (
          <Typography>
            <Typography.Text>{action.message}</Typography.Text>{' '}
            <Typography.Text type="secondary">{action.data}</Typography.Text>
          </Typography>
        ),
        icon: null,
      }
  }
}
