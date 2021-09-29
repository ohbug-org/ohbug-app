import type { FC } from 'react'
import { Skeleton } from 'antd'
import dayjs from 'dayjs'
import {
  ClockCircleOutlined,
  CloudOutlined,
  DesktopOutlined,
  FontSizeOutlined,
  GlobalOutlined,
  IdcardOutlined,
  PaperClipOutlined,
  PushpinOutlined,
} from '@ant-design/icons'

import type { EventInAPP } from '@/types'
import { RelativeTime } from '@/components'
import { useCreation } from '@/hooks'

import Cards from './components/Cards'
import TooltipTags from './components/TooltipTags'

interface ProfileProps {
  event?: EventInAPP<any>
}
const Profile: FC<ProfileProps> = ({ event }) => {
  const tooltipTagsList = useCreation(() => {
    const result = []
    if (event?.timestamp) {
      result.push({
        key: 'time',
        title: `发生时间: ${dayjs(event.timestamp).format(
          `YYYY-MM-DD HH:mm:ss`
        )}`,
        value: <RelativeTime time={event.timestamp} />,
        icon: <ClockCircleOutlined />,
      })
    }
    if (event?.user?.uuid) {
      result.push({
        key: 'uuid',
        title: `UUID: ${event?.user?.uuid}`,
        value: event?.user?.uuid,
        icon: <IdcardOutlined />,
      })
    }
    if (event?.user?.ip) {
      result.push({
        key: 'ip',
        title: `IP: ${event?.user?.ip}`,
        value: event?.user?.ip,
        icon: <CloudOutlined />,
      })
    }
    if (event?.device?.title) {
      result.push({
        key: 'title',
        title: `标题: ${event.device.title}`,
        value: event.device.title,
        icon: <FontSizeOutlined />,
      })
    }
    if (event?.device?.url) {
      result.push({
        key: 'url',
        title: `URL: ${event.device.url}`,
        value: event.device.url,
        icon: <PaperClipOutlined />,
      })
    }
    if (event?.device?.language) {
      result.push({
        key: 'language',
        title: `Language: ${event.device.language}`,
        value: event.device.language,
        icon: <GlobalOutlined />,
      })
    }
    if (event?.appVersion) {
      result.push({
        key: 'appVersion',
        title: `AppVersion: ${event.appVersion}`,
        value: event.appVersion,
        icon: <PushpinOutlined />,
      })
    }
    if (event?.appType) {
      result.push({
        key: 'appType',
        title: `AppType: ${event.appType}`,
        value: event.appType,
        icon: <PushpinOutlined />,
      })
    }
    if (event?.releaseStage) {
      result.push({
        key: 'releaseStage',
        title: `ReleaseStage: ${event.releaseStage}`,
        value: event.releaseStage,
        icon: <PushpinOutlined />,
      })
    }
    if (
      event?.device?.device?.screenWidth &&
      event?.device?.device?.screenHeight &&
      event?.device?.device?.pixelRatio
    ) {
      result.push({
        key: 'dpi',
        title: `分辨率: ${event?.device?.device?.screenWidth} × ${event?.device?.device?.screenHeight} @ ${event?.device?.device?.pixelRatio}x`,
        value: `${event?.device?.device?.screenWidth} × ${event?.device?.device?.screenHeight} @ ${event?.device?.device?.pixelRatio}x`,
        icon: <DesktopOutlined />,
      })
    }

    return result
  }, [event])

  const loading = !event

  return (
    <div className="mb-4">
      <div className="mb-4">
        <Cards event={event} />
      </div>

      <Skeleton loading={loading}>
        {tooltipTagsList.map((item) => (
          <TooltipTags
            key={item.key}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </Skeleton>
    </div>
  )
}

export default Profile
