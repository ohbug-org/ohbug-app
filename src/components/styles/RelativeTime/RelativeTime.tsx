import type { FC } from 'react'
import dayjs from 'dayjs'

interface RelativeTimeProps {
  time: string | undefined
}
const RelativeTime: FC<RelativeTimeProps> = ({ time }) =>
  time ? <span>{dayjs(time).fromNow()}</span> : null

export default RelativeTime
