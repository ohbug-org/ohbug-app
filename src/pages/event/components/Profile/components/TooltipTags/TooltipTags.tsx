import type { FC, ReactChild, ReactNode } from 'react'
import { Tag, Tooltip } from 'antd'

interface TooltipTagsProps {
  title: ReactChild
  value: any
  icon: ReactNode
}
const TooltipTags: FC<TooltipTagsProps> = ({ title, value, icon }) => (
  <Tooltip title={title}>
    <Tag icon={icon} color="default">
      {value}
    </Tag>
  </Tooltip>
)

export default TooltipTags
